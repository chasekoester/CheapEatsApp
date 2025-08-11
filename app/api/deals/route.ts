import { NextResponse } from 'next/server'
import { GoogleSheetsService } from './sheets-service'
import { AIFastFoodGenerator } from './ai-fast-food-generator'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'
export const maxDuration = 30

const locationCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'New York': { latitude: 40.7128, longitude: -74.0060 },
  'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
  'Chicago': { latitude: 41.8781, longitude: -87.6298 },
  'Houston': { latitude: 29.7604, longitude: -95.3698 },
  'Phoenix': { latitude: 33.4484, longitude: -112.0740 },
  'Philadelphia': { latitude: 39.9526, longitude: -75.1652 },
  'San Antonio': { latitude: 29.4241, longitude: -98.4936 },
  'San Diego': { latitude: 32.7157, longitude: -117.1611 },
  'Dallas': { latitude: 32.7767, longitude: -96.7970 },
  'Austin': { latitude: 30.2672, longitude: -97.7431 }
}


export async function GET(request: Request) {
  try {

    // Extract user location from query parameters
    const url = new URL(request.url)
    const userLat = url.searchParams.get('lat') ? parseFloat(url.searchParams.get('lat')!) : undefined
    const userLng = url.searchParams.get('lng') ? parseFloat(url.searchParams.get('lng')!) : undefined
    const radius = url.searchParams.get('radius') ? parseFloat(url.searchParams.get('radius')!) : 25
    const requestedCount = url.searchParams.get('count') ? parseInt(url.searchParams.get('count')!) : 75

    // Validate location
    let location: { latitude: number; longitude: number }

    if (userLat && userLng && !isNaN(userLat) && !isNaN(userLng)) {
      location = { latitude: userLat, longitude: userLng }
    } else {
      // Default to a major city if no location provided
      const defaultCity = 'New York'
      location = locationCoordinates[defaultCity]
    }

    // ONLY use Google Sheets - no fallbacks
    const sheetsService = new GoogleSheetsService()
    let deals: any[] = []
    let dataSource = 'Google Spreadsheet'


    if (!(await sheetsService.isConfigured())) {
      console.error('❌ Google Sheets not configured!')
      return NextResponse.json({
        success: false,
        error: 'Google Sheets is not configured. Please check environment variables.',
        deals: []
      }, { status: 500 })
    }

    try {
      const sheetDeals = await sheetsService.getActiveDeals()

      if (sheetDeals.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No deals currently available. Please check back later.',
          deals: []
        }, { status: 200 })
      }

      // Calculate distances for sheet deals and show ALL of them
      const dealsWithDistance = sheetDeals.map(deal => ({
        ...deal,
        distance: sheetsService.calculateDistance(
          location.latitude,
          location.longitude,
          deal.latitude,
          deal.longitude
        ),
        // Convert to the expected format
        sourceType: 'user_submitted' as const,
        scrapedAt: new Date().toISOString(),
        confidence: 100,
        imageUrl: '/api/placeholder/400/300'
      }))

      // Show ALL spreadsheet deals - no filtering by distance or count
      deals = dealsWithDistance.sort((a, b) => a.distance - b.distance)

    } catch (error) {
      console.error('❌ Failed to read from Google Sheets:', error)

      // Return proper error since Google Sheets should be working now
      return NextResponse.json({
        success: false,
        error: 'Failed to read from Google Spreadsheet: ' + (error instanceof Error ? error.message : 'Unknown error'),
        deals: []
      }, { status: 500 })
    }

    if (deals.length === 0) {
      console.log('📝 No deals available')
      return NextResponse.json({
        success: true,
        message: 'No deals currently available. Please check back later.',
        deals: []
      }, { status: 200 })
    }

    // Smart deduplication - remove duplicates but allow restaurant variety
    const deduplicatedDeals = deals.reduce((acc, deal) => {
      // Check for exact duplicates (same restaurant + title + price)
      const exactKey = `${deal.restaurantName?.toLowerCase().trim()}-${deal.title?.toLowerCase().trim()}-${deal.dealPrice?.toLowerCase().trim()}`

      const hasExactDuplicate = acc.some((existingDeal: typeof deal) => {
        const existingKey = `${existingDeal.restaurantName?.toLowerCase().trim()}-${existingDeal.title?.toLowerCase().trim()}-${existingDeal.dealPrice?.toLowerCase().trim()}`
        return existingKey === exactKey
      })

      // Check for very similar deals at same restaurant (similar titles)
      const hasSimilarDeal = acc.some((existingDeal: typeof deal) => {
        if (existingDeal.restaurantName?.toLowerCase().trim() !== deal.restaurantName?.toLowerCase().trim()) {
          return false
        }

        const existingTitle = existingDeal.title?.toLowerCase().trim() || ''
        const currentTitle = deal.title?.toLowerCase().trim() || ''

        // Check for highly similar titles (80%+ word overlap)
        const existingWords = new Set(existingTitle.split(/\s+/))
        const currentWords = new Set(currentTitle.split(/\s+/))
        const intersection = new Set([...existingWords].filter(x => currentWords.has(x)))
        const similarity = intersection.size / Math.max(existingWords.size, currentWords.size)

        return similarity > 0.8
      })

      if (!hasExactDuplicate && !hasSimilarDeal) {
        acc.push(deal)
      }

      return acc
    }, [] as typeof deals)


    // Sort deals by distance and quality
    const sortedDeals = deduplicatedDeals.sort((a: typeof deals[0], b: typeof deals[0]) => {
      // Primary sort: distance
      const distanceDiff = a.distance - b.distance
      if (Math.abs(distanceDiff) > 0.5) return distanceDiff

      // Secondary sort: quality score
      return (b.qualityScore || 0) - (a.qualityScore || 0)
    })


    return NextResponse.json({
      success: true,
      deals: sortedDeals,
      lastUpdated: new Date().toISOString(),
      totalDeals: sortedDeals.length,
      source: dataSource,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radius
      },
      stats: {
        totalDeals: sortedDeals.length,
        averageQuality: Math.round(sortedDeals.reduce((sum: number, deal: typeof deals[0]) => sum + (deal.qualityScore || 0), 0) / sortedDeals.length),
        categories: [...new Set(sortedDeals.map((deal: typeof deals[0]) => deal.category))],
        restaurants: [...new Set(sortedDeals.map((deal: typeof deals[0]) => deal.restaurantName))].length
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes cache for sheet data
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('💥 Fast Food Deals API Error:', error)

    // Return a meaningful error response
    let errorMessage = 'Unable to find fast food deals at this time.'

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Service configuration issue. Please try again later.'
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        errorMessage = 'Service temporarily unavailable due to high demand. Please try again in a few minutes.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.'
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      deals: [],
      fallbackAvailable: false
    }, {
      status: 500
    })
  }
}

/**
 * POST endpoint for generating targeted deals
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { location, chains, preferences } = body
    
    if (!location || !location.latitude || !location.longitude) {
      return NextResponse.json({
        success: false,
        error: 'Location is required'
      }, { status: 400 })
    }

    const aiGenerator = new AIFastFoodGenerator()
    
    let deals = []
    
    if (chains && chains.length > 0) {
      // Generate targeted deals for specific chains
      console.log(`🎯 Generating targeted deals for: ${chains.join(', ')}`)
      deals = await aiGenerator.generateTargetedChainDeals(chains, location)
    } else {
      // Generate general fast food deals
      const count = preferences?.count || 50
      deals = await aiGenerator.generateFastFoodDeals(location, count)
    }
    
    return NextResponse.json({
      success: true,
      deals: deals,
      totalDeals: deals.length,
      source: 'AI-Generated Targeted Fast Food Deals'
    })
    
  } catch (error) {
    console.error('💥 Targeted deals API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Unable to generate targeted deals',
      deals: []
    }, { status: 500 })
  }
}

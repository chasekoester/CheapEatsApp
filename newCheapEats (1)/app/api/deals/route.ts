import { NextResponse } from 'next/server'
import { AIFastFoodGenerator } from './ai-fast-food-generator'
import { GoogleSheetsService } from './sheets-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    console.log('🚀 Fast Food Deals API called')

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
      console.log(`📍 User location: ${userLat}, ${userLng} (radius: ${radius} miles)`)
    } else {
      // Default to a major city if no location provided
      const defaultCity = 'New York'
      location = locationCoordinates[defaultCity]
      console.log(`📍 Using default location: ${defaultCity}`)
    }

    // Try to get deals from Google Sheets first
    const sheetsService = new GoogleSheetsService()
    let deals: any[] = []
    let dataSource = 'Sheet Stored'

    if (await sheetsService.isConfigured()) {
      console.log('📊 Fetching deals from Google Sheets...')
      try {
        const sheetDeals = await sheetsService.getActiveDeals()

        if (sheetDeals.length > 0) {
          // Calculate distances for sheet deals and sort by proximity
          const dealsWithDistance = sheetDeals.map(deal => ({
            ...deal,
            distance: sheetsService.calculateDistance(
              location.latitude,
              location.longitude,
              deal.latitude,
              deal.longitude
            ),
            // Convert to the expected format
            sourceType: 'sheet_stored' as const,
            scrapedAt: new Date().toISOString(),
            confidence: 95,
            imageUrl: '/api/placeholder/400/300'
          }))

          // Filter by radius and sort by distance
          deals = dealsWithDistance
            .filter(deal => deal.distance <= radius)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, requestedCount)

          console.log(`✅ Using ${deals.length} deals from Google Sheets`)
        }
      } catch (error) {
        console.error('❌ Failed to fetch from Google Sheets:', error)
      }
    }

    // Fallback to AI generation if no sheet deals or sheets not configured
    if (deals.length === 0) {
      console.log('🤖 Fallback: Generating AI deals...')
      const aiGenerator = new AIFastFoodGenerator()
      deals = await aiGenerator.generateFastFoodDeals(location, requestedCount)
      dataSource = 'AI Generated'
    }

    if (deals.length === 0) {
      console.log('❌ No deals found')
      return NextResponse.json({
        success: false,
        error: 'Unable to find fast food deals at this time. Please try again later.',
        deals: []
      }, { status: 500 })
    }

    // Sort deals by distance and quality
    const sortedDeals = deals.sort((a, b) => {
      // Primary sort: distance
      const distanceDiff = a.distance - b.distance
      if (Math.abs(distanceDiff) > 0.5) return distanceDiff

      // Secondary sort: quality score
      return (b.qualityScore || 0) - (a.qualityScore || 0)
    })

    console.log(`✅ Successfully served ${sortedDeals.length} deals from ${dataSource}`)

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
        averageQuality: Math.round(sortedDeals.reduce((sum, deal) => sum + (deal.qualityScore || 0), 0) / sortedDeals.length),
        categories: [...new Set(sortedDeals.map(deal => deal.category))],
        restaurants: [...new Set(sortedDeals.map(deal => deal.restaurantName))].length
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

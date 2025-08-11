import { NextResponse } from 'next/server'
import { AIFastFoodGenerator } from '../ai-fast-food-generator'
import { GoogleSheetsService, SheetDeal } from '../sheets-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'
export const maxDuration = 60

// Major cities to generate deals for
const MAJOR_CITIES = [
  { name: 'New York, NY', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Los Angeles, CA', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Chicago, IL', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Houston, TX', latitude: 29.7604, longitude: -95.3698 },
  { name: 'Phoenix, AZ', latitude: 33.4484, longitude: -112.0740 },
  { name: 'Philadelphia, PA', latitude: 39.9526, longitude: -75.1652 },
  { name: 'San Antonio, TX', latitude: 29.4241, longitude: -98.4936 },
  { name: 'San Diego, CA', latitude: 32.7157, longitude: -117.1611 },
  { name: 'Dallas, TX', latitude: 32.7767, longitude: -96.7970 },
  { name: 'Austin, TX', latitude: 30.2672, longitude: -97.7431 }
]

export async function POST(request: Request) {
  try {
    console.log('🚀 Starting daily deal generation...')

    // Check if this is an authorized request (you might want to add an API key)
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get('key')
    
    if (apiKey !== process.env.DAILY_GENERATION_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    // Initialize services
    const aiGenerator = new AIFastFoodGenerator()
    const sheetsService = new GoogleSheetsService()

    if (!(await sheetsService.isConfigured())) {
      console.warn('⚠️ Google Sheets not configured, cannot save deals')
      return NextResponse.json({
        success: false,
        error: 'Google Sheets not configured'
      }, { status: 500 })
    }

    const allDeals: SheetDeal[] = []

    // Generate deals for each major city
    for (const city of MAJOR_CITIES) {
      console.log(`🌆 Generating deals for ${city.name}...`)
      
      try {
        const cityDeals = await aiGenerator.generateFastFoodDeals(
          { latitude: city.latitude, longitude: city.longitude },
          35 // Generate 35 deals per city for more variety
        )

        // Convert to SheetDeal format
        const sheetDeals: SheetDeal[] = cityDeals.map(deal => ({
          id: deal.id,
          restaurantName: deal.restaurantName,
          title: deal.title,
          description: deal.description,
          originalPrice: deal.originalPrice || '',
          dealPrice: deal.dealPrice || '',
          discountPercent: deal.discountPercent || 0,
          category: deal.category,
          expirationDate: deal.expirationDate || '',
          latitude: deal.latitude ?? city.latitude,
          longitude: deal.longitude ?? city.longitude,
          address: deal.address || '',
          qualityScore: deal.qualityScore || 75,
          verified: deal.verified,
          source: `AI Generated - ${city.name}`,
          dateAdded: new Date().toISOString().split('T')[0],
          status: 'active' as const
        }))

        allDeals.push(...sheetDeals)
        console.log(`✅ Generated ${sheetDeals.length} deals for ${city.name}`)

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`❌ Failed to generate deals for ${city.name}:`, error)
        // Continue with other cities
      }
    }

    if (allDeals.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No deals were generated'
      }, { status: 500 })
    }

    // Save all deals to Google Sheets
    await sheetsService.saveDeals(allDeals)

    console.log(`🎉 Daily deal generation complete! Generated ${allDeals.length} deals across ${MAJOR_CITIES.length} cities`)

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${allDeals.length} deals`,
      totalDeals: allDeals.length,
      cities: MAJOR_CITIES.length,
      generatedAt: new Date().toISOString(),
      summary: {
        restaurants: [...new Set(allDeals.map(d => d.restaurantName))].length,
        categories: [...new Set(allDeals.map(d => d.category))],
        averageDiscount: Math.round(allDeals.reduce((sum, d) => sum + d.discountPercent, 0) / allDeals.length)
      }
    })

  } catch (error) {
    console.error('💥 Daily deal generation failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate daily deals',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Optional: Add a GET endpoint to check when deals were last generated
export async function GET() {
  try {
    const sheetsService = new GoogleSheetsService()
    
    if (!(await sheetsService.isConfigured())) {
      return NextResponse.json({
        configured: false,
        message: 'Google Sheets not configured'
      })
    }

    const deals = await sheetsService.getActiveDeals()
    const lastGenerated = deals.length > 0 ? deals[0]?.dateAdded : null

    return NextResponse.json({
      configured: true,
      totalActiveDeals: deals.length,
      lastGenerated,
      cities: [...new Set(deals.map(d => d.source))].length,
      restaurants: [...new Set(deals.map(d => d.restaurantName))].length
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check deal status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

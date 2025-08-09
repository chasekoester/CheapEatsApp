import { NextResponse } from 'next/server'
import { GoogleSheetsService } from '../sheets-service'
import { AIFastFoodGenerator } from '../ai-fast-food-generator'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'
export const maxDuration = 45

// This endpoint runs automatically to ensure deals are always available
export async function GET() {
  try {
    console.log('🚀 Checking if daily deals need to be generated...')

    const sheetsService = new GoogleSheetsService()
    
    if (!(await sheetsService.isConfigured())) {
      console.log('📊 Google Sheets not configured, using AI fallback')
      return NextResponse.json({
        status: 'sheets_not_configured',
        message: 'Google Sheets not configured, will use AI fallback'
      })
    }

    // Check current deals
    const existingDeals = await sheetsService.getActiveDeals()
    const today = new Date().toISOString().split('T')[0]
    
    // Force regeneration to include sourceUrl - temporary for testing
    console.log('🔄 Forcing regeneration to include sourceUrl in all deals...')

    console.log('🤖 Generating fresh daily deals...')
    
    // Generate deals for major cities
    const aiGenerator = new AIFastFoodGenerator()
    const MAJOR_CITIES = [
      { name: 'New York, NY', latitude: 40.7128, longitude: -74.0060 },
      { name: 'Los Angeles, CA', latitude: 34.0522, longitude: -118.2437 },
      { name: 'Chicago, IL', latitude: 41.8781, longitude: -87.6298 },
      { name: 'Houston, TX', latitude: 29.7604, longitude: -95.3698 },
      { name: 'Phoenix, AZ', latitude: 33.4484, longitude: -112.0740 }
    ]

    const allDeals: any[] = []

    for (const city of MAJOR_CITIES) {
      try {
        console.log(`🌆 Generating deals for ${city.name}...`)
        
        const cityDeals = await aiGenerator.generateFastFoodDeals(
          { latitude: city.latitude, longitude: city.longitude },
          15 // 15 deals per city = 75 total deals
        )

        // Convert to sheet format
        const sheetDeals = cityDeals.map(deal => ({
          id: deal.id,
          restaurantName: deal.restaurantName,
          title: deal.title,
          description: deal.description,
          originalPrice: deal.originalPrice || '',
          dealPrice: deal.dealPrice || '',
          discountPercent: deal.discountPercent || 0,
          category: deal.category,
          expirationDate: deal.expirationDate || '',
          latitude: deal.latitude,
          longitude: deal.longitude,
          address: deal.address || '',
          qualityScore: deal.qualityScore || 75,
          verified: deal.verified,
          source: `AI Generated - ${city.name}`,
          sourceUrl: deal.sourceUrl || undefined,
          dateAdded: today,
          status: 'active' as const
        }))

        allDeals.push(...sheetDeals)
        console.log(`✅ Generated ${sheetDeals.length} deals for ${city.name}`)

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`❌ Failed to generate deals for ${city.name}:`, error)
        // Continue with other cities
      }
    }

    if (allDeals.length > 0) {
      // Preserve manually added deals and deals from other days
      // Only replace AI-generated deals from today
      const preservedDeals = existingDeals.filter(d =>
        d.dateAdded !== today || !d.source.includes('AI Generated')
      )
      const allValidDeals = [...preservedDeals, ...allDeals]
      await sheetsService.saveDeals(allValidDeals)

      console.log(`🎉 Successfully generated and saved ${allDeals.length} new deals!`)
      console.log(`📝 Preserved ${preservedDeals.length} existing/manual deals`)
    }

    return NextResponse.json({
      status: 'generation_complete',
      message: `Successfully generated ${allDeals.length} new deals`,
      newDeals: allDeals.length,
      totalDeals: existingDeals.length + allDeals.length,
      cities: MAJOR_CITIES.length,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('💥 Startup deal generation failed:', error)
    
    return NextResponse.json({
      status: 'error',
      error: 'Failed to generate deals',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

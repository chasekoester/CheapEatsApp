import { NextResponse } from 'next/server'
import { GoogleSheetsService } from '../deals/sheets-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🧪 Testing Google Sheets connection...')
    
    const sheetsService = new GoogleSheetsService()
    
    console.log('🔧 Checking if configured...')
    const isConfigured = await sheetsService.isConfigured()
    console.log(`✅ Configured: ${isConfigured}`)
    
    if (isConfigured) {
      console.log('📊 Attempting to get deals...')
      const deals = await sheetsService.getActiveDeals()
      console.log(`✅ Retrieved ${deals.length} deals`)
      
      return NextResponse.json({
        success: true,
        configured: isConfigured,
        dealsCount: deals.length,
        firstFewDeals: deals.slice(0, 3).map(d => ({
          title: d.title,
          restaurant: d.restaurantName,
          status: d.status
        }))
      })
    } else {
      return NextResponse.json({
        success: false,
        configured: false,
        error: 'Google Sheets not configured'
      })
    }
  } catch (error) {
    console.error('🚨 Test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

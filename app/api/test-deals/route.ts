import { NextResponse } from 'next/server'

// Sample test deals to verify the frontend works
const sampleDeals = [
  {
    id: 'test-001',
    restaurantName: 'McDonald\'s',
    title: 'Big Mac Meal Deal',
    description: 'Get a Big Mac, fries, and drink for just $6.99',
    originalPrice: '$12.99',
    dealPrice: '$6.99',
    discountPercent: 46,
    category: 'Burgers',
    expirationDate: '2024-12-31',
    latitude: 40.7128,
    longitude: -74.0060,
    address: '123 Main St, New York, NY',
    qualityScore: 85,
    verified: true,
    source: 'Test Data',
    sourceUrl: 'https://mcdonalds.com',
    dateAdded: '2024-01-15',
    status: 'active',
    distance: 0.5,
    sourceType: 'user_submitted',
    scrapedAt: new Date().toISOString(),
    confidence: 100,
    imageUrl: '/api/placeholder/400/300'
  },
  {
    id: 'test-002',
    restaurantName: 'Burger King',
    title: 'Whopper Wednesday',
    description: 'Buy one Whopper, get one free every Wednesday',
    originalPrice: '$8.99',
    dealPrice: '$4.50',
    discountPercent: 50,
    category: 'Burgers',
    expirationDate: '2024-12-31',
    latitude: 40.7180,
    longitude: -74.0100,
    address: '456 Broadway, New York, NY',
    qualityScore: 82,
    verified: true,
    source: 'Test Data',
    sourceUrl: 'https://burgerking.com',
    dateAdded: '2024-01-15',
    status: 'active',
    distance: 0.8,
    sourceType: 'user_submitted',
    scrapedAt: new Date().toISOString(),
    confidence: 100,
    imageUrl: '/api/placeholder/400/300'
  },
  {
    id: 'test-003',
    restaurantName: 'Taco Bell',
    title: 'Crunchwrap Supreme Combo',
    description: 'Crunchwrap Supreme with nachos and drink',
    originalPrice: '$9.49',
    dealPrice: '$5.99',
    discountPercent: 37,
    category: 'Mexican',
    expirationDate: '2024-12-31',
    latitude: 40.7090,
    longitude: -74.0020,
    address: '789 5th Ave, New York, NY',
    qualityScore: 88,
    verified: true,
    source: 'Test Data',
    sourceUrl: 'https://tacobell.com',
    dateAdded: '2024-01-15',
    status: 'active',
    distance: 1.2,
    sourceType: 'user_submitted',
    scrapedAt: new Date().toISOString(),
    confidence: 100,
    imageUrl: '/api/placeholder/400/300'
  }
]

export async function GET(request: Request) {
  try {
    console.log('🧪 Test deals API called - returning sample data')
    
    // Extract query parameters
    const url = new URL(request.url)
    const userLat = url.searchParams.get('lat') ? parseFloat(url.searchParams.get('lat')!) : 40.7128
    const userLng = url.searchParams.get('lng') ? parseFloat(url.searchParams.get('lng')!) : -74.0060
    
    console.log(`📍 Test location: ${userLat}, ${userLng}`)
    
    // Calculate distances and sort deals
    const dealsWithDistance = sampleDeals.map(deal => {
      // Simple distance calculation for testing
      const latDiff = Math.abs(deal.latitude - userLat)
      const lngDiff = Math.abs(deal.longitude - userLng)
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 69 // Rough miles
      
      return {
        ...deal,
        distance: Math.round(distance * 10) / 10
      }
    }).sort((a, b) => a.distance - b.distance)
    
    console.log(`✅ Returning ${dealsWithDistance.length} test deals`)
    
    return NextResponse.json({
      success: true,
      deals: dealsWithDistance,
      lastUpdated: new Date().toISOString(),
      totalDeals: dealsWithDistance.length,
      source: 'Test Data - Sample Deals',
      location: {
        latitude: userLat,
        longitude: userLng,
        radius: 25
      },
      stats: {
        totalDeals: dealsWithDistance.length,
        averageQuality: Math.round(dealsWithDistance.reduce((sum, deal) => sum + deal.qualityScore, 0) / dealsWithDistance.length),
        categories: [...new Set(dealsWithDistance.map(deal => deal.category))],
        restaurants: dealsWithDistance.length
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('❌ Test deals API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Test deals API failed',
      deals: []
    }, { status: 500 })
  }
}

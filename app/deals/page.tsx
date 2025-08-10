'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Deal interface to match the actual API structure
interface Deal {
  id: string
  title: string
  description: string
  originalPrice?: string
  dealPrice?: string
  discountPercent?: number
  restaurantName: string
  category: string
  expirationDate?: string
  imageUrl?: string
  sourceUrl?: string
  address?: string
  distance?: number
  qualityScore?: number
  verified: boolean
  source: string
  scrapedAt: string
  confidence: number
  // Legacy properties for compatibility
  restaurant?: string
  price?: string
  savings?: string
  rating?: number
  delivery_time?: string
  delivery_fee?: string
}

// Helper function to parse price strings like "$5.99" to numbers
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0
  const cleanPrice = priceStr.replace(/[$,]/g, '')
  const parsed = parseFloat(cleanPrice)
  return isNaN(parsed) ? 0 : parsed
}

// Helper function to calculate discount percentage
const calculateDiscountPercent = (originalPrice?: string, dealPrice?: string): number => {
  const original = parsePrice(originalPrice || '0')
  const deal = parsePrice(dealPrice || '0')

  // If deal price is $0 (free), it's 100% off
  if (deal === 0 && original > 0) return 100

  // If original price is 0 or negative, no valid discount
  if (original <= 0) return 0

  // Calculate percentage
  const discount = Math.round(((original - deal) / original) * 100)

  // Cap at 100% and don't allow negative discounts
  return Math.max(0, Math.min(100, discount))
}

// Comprehensive fast food chain logo database with reliable URLs
const FAST_FOOD_LOGOS = {
  // McDonald's variants
  "mcdonald's": { url: 'https://logoeps.com/wp-content/uploads/2013/03/mcdonalds-vector-logo.png', bgColor: '#FFC72C' },
  "mcdonalds": { url: 'https://logoeps.com/wp-content/uploads/2013/03/mcdonalds-vector-logo.png', bgColor: '#FFC72C' },
  "mcdonald": { url: 'https://logoeps.com/wp-content/uploads/2013/03/mcdonalds-vector-logo.png', bgColor: '#FFC72C' },

  // Burger King variants
  "burger king": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Burger-King-Logo.png', bgColor: '#D62300' },
  "burgerking": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Burger-King-Logo.png', bgColor: '#D62300' },
  "bk": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Burger-King-Logo.png', bgColor: '#D62300' },

  // Taco Bell variants
  "taco bell": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Taco-Bell-Logo.png', bgColor: '#702F8A' },
  "tacobell": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Taco-Bell-Logo.png', bgColor: '#702F8A' },

  // KFC variants
  "kfc": { url: 'https://logos-world.net/wp-content/uploads/2020/05/KFC-Logo.png', bgColor: '#F40027' },
  "kentucky fried chicken": { url: 'https://logos-world.net/wp-content/uploads/2020/05/KFC-Logo.png', bgColor: '#F40027' },

  // Subway variants
  "subway": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Subway-Logo.png', bgColor: '#009639' },

  // Pizza chains
  "pizza hut": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Pizza-Hut-Logo.png', bgColor: '#EE3124' },
  "pizzahut": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Pizza-Hut-Logo.png', bgColor: '#EE3124' },
  "dominos": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Dominos-Logo.png', bgColor: '#0078AE' },
  "domino's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Dominos-Logo.png', bgColor: '#0078AE' },
  "papa johns": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Papa-Johns-Logo.png', bgColor: '#CE1126' },
  "papa john's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Papa-Johns-Logo.png', bgColor: '#CE1126' },
  "little caesars": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Little-Caesars-Logo.png', bgColor: '#FF6600' },
  "little caesar's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Little-Caesars-Logo.png', bgColor: '#FF6600' },

  // Coffee chains
  "starbucks": { url: 'https://logos-world.net/wp-content/uploads/2020/04/Starbucks-Logo.png', bgColor: '#00704A' },
  "dunkin": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Dunkin-Donuts-Logo.png', bgColor: '#FF6600' },
  "dunkin'": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Dunkin-Donuts-Logo.png', bgColor: '#FF6600' },
  "dunkin donuts": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Dunkin-Donuts-Logo.png', bgColor: '#FF6600' },
  "tim hortons": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Tim-Hortons-Logo.png', bgColor: '#E31837' },

  // Chicken chains
  "chick-fil-a": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Chick-fil-A-Logo.png', bgColor: '#E31837' },
  "chick fil a": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Chick-fil-A-Logo.png', bgColor: '#E31837' },
  "chickfila": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Chick-fil-A-Logo.png', bgColor: '#E31837' },
  "popeyes": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Popeyes-Logo.png', bgColor: '#FF6600' },
  "raising canes": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Raising-Canes-Logo.png', bgColor: '#FFD700' },
  "raising cane's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Raising-Canes-Logo.png', bgColor: '#FFD700' },

  // Other burger chains
  "wendy's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Wendys-Logo.png', bgColor: '#E31837' },
  "wendys": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Wendys-Logo.png', bgColor: '#E31837' },
  "five guys": { url: 'https://logos-world.net/wp-content/uploads/2021/12/Five-Guys-Logo.png', bgColor: '#E31837' },
  "in-n-out": { url: 'https://logos-world.net/wp-content/uploads/2020/05/In-N-Out-Logo.png', bgColor: '#E31837' },
  "in n out": { url: 'https://logos-world.net/wp-content/uploads/2020/05/In-N-Out-Logo.png', bgColor: '#E31837' },
  "whataburger": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Whataburger-Logo.png', bgColor: '#E31837' },
  "white castle": { url: 'https://logos-world.net/wp-content/uploads/2020/05/White-Castle-Logo.png', bgColor: '#FFFFFF' },
  "carls jr": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Carls-Jr-Logo.png', bgColor: '#E31837' },
  "carl's jr": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Carls-Jr-Logo.png', bgColor: '#E31837' },
  "hardees": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Hardees-Logo.png', bgColor: '#E31837' },
  "hardee's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Hardees-Logo.png', bgColor: '#E31837' },
  "jack in the box": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Jack-in-the-Box-Logo.png', bgColor: '#E31837' },

  // Mexican chains
  "chipotle": { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1200px-Chipotle_Mexican_Grill_logo.svg.png', bgColor: '#A81612' },
  "qdoba": { url: 'https://logos-world.net/wp-content/uploads/2020/06/Qdoba-Logo-700x394.png', bgColor: '#E31837' },
  "del taco": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Del-Taco-Logo-700x394.png', bgColor: '#E31837' },
  "taco johns": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Taco-Johns-Logo-700x394.png', bgColor: '#E31837' },
  "taco john's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Taco-Johns-Logo-700x394.png', bgColor: '#E31837' },

  // Sandwich chains
  "jimmy johns": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Jimmy-Johns-Logo-700x394.png', bgColor: '#E31837' },
  "jimmy john's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Jimmy-Johns-Logo-700x394.png', bgColor: '#E31837' },
  "firehouse subs": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Firehouse-Subs-Logo-700x394.png', bgColor: '#E31837' },
  "jersey mikes": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Jersey-Mikes-Logo-700x394.png', bgColor: '#E31837' },
  "jersey mike's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Jersey-Mikes-Logo-700x394.png', bgColor: '#E31837' },

  // Fast casual
  "panera": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Panera-Bread-Logo-700x394.png', bgColor: '#7FB069' },
  "panera bread": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Panera-Bread-Logo-700x394.png', bgColor: '#7FB069' },
  "panda express": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Panda-Express-Logo-700x394.png', bgColor: '#E31837' },

  // Other chains
  "sonic": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Sonic-Drive-In-Logo-700x394.png', bgColor: '#3398DC' },
  "sonic drive-in": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Sonic-Drive-In-Logo-700x394.png', bgColor: '#3398DC' },
  "arbys": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Arbys-Logo-700x394.png', bgColor: '#E31837' },
  "arby's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Arbys-Logo-700x394.png', bgColor: '#E31837' },
  "dairy queen": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Dairy-Queen-Logo-700x394.png', bgColor: '#E31837' },
  "dq": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Dairy-Queen-Logo-700x394.png', bgColor: '#E31837' },
  "culvers": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Culvers-Logo-700x394.png', bgColor: '#E31837' },
  "culver's": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Culvers-Logo-700x394.png', bgColor: '#E31837' },
  "shake shack": { url: 'https://logos-world.net/wp-content/uploads/2020/05/Shake-Shack-Logo-700x394.png', bgColor: '#7FB069' }
}

// Simple fuzzy search function
const fuzzyMatch = (input: string, target: string): number => {
  input = input.toLowerCase()
  target = target.toLowerCase()

  // Exact match gets highest score
  if (input === target) return 100

  // Check if input contains target or target contains input
  if (input.includes(target) || target.includes(input)) return 90

  // Remove common words and check again
  const cleanInput = input.replace(/\b(the|and|&|restaurant|food|drive|in|out)\b/g, '').trim()
  const cleanTarget = target.replace(/\b(the|and|&|restaurant|food|drive|in|out)\b/g, '').trim()

  if (cleanInput.includes(cleanTarget) || cleanTarget.includes(cleanInput)) return 80

  // Check individual words
  const inputWords = cleanInput.split(/\s+/)
  const targetWords = cleanTarget.split(/\s+/)

  let matchCount = 0
  for (const word of inputWords) {
    if (targetWords.some(tWord => tWord.includes(word) || word.includes(tWord))) {
      matchCount++
    }
  }

  if (matchCount > 0) {
    return Math.floor((matchCount / Math.max(inputWords.length, targetWords.length)) * 70)
  }

  return 0
}

// Function to get directions to nearest restaurant location
const getDirectionsToRestaurant = (restaurantName: string, userLocation?: { latitude: number; longitude: number }) => {
  if (!restaurantName) return

  // Clean up restaurant name for search
  const cleanName = restaurantName.trim()

  if (userLocation) {
    // Use user's location for more precise directions
    const { latitude, longitude } = userLocation
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(cleanName)}/@${latitude},${longitude},15z`
    window.open(mapsUrl, '_blank')
  } else {
    // Fallback to general search
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(cleanName + ' near me')}`
    window.open(mapsUrl, '_blank')
  }
}

// Function to get restaurant brand color
const getRestaurantBrandColor = (restaurantName: string) => {
  if (!restaurantName) {
    return '#6B7280' // Default gray
  }

  const cleanName = restaurantName.toLowerCase().trim()
  let bestMatch = ''
  let bestScore = 0

  // Find the best fuzzy match
  for (const chainName of Object.keys(FAST_FOOD_LOGOS)) {
    const score = fuzzyMatch(cleanName, chainName)
    if (score > bestScore && score > 60) { // Minimum threshold
      bestScore = score
      bestMatch = chainName
    }
  }

if (bestMatch && bestMatch in FAST_FOOD_LOGOS) {
  return FAST_FOOD_LOGOS[bestMatch as keyof typeof FAST_FOOD_LOGOS].bgColor;
}


  // Default color for unknown restaurants
  return '#6B7280'
}

export default function DealsPage() {
  const { data: session } = useSession()
  const [deals, setDeals] = useState<(Deal & { distance: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'ai_generating' | 'processing' | 'complete'>('initial')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'savings' | 'rating'>('distance')
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationName, setLocationName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [favoriteDeals, setFavoriteDeals] = useState<string[]>([])
  const [favoriteLoading, setFavoriteLoading] = useState<{ [dealId: string]: boolean }>({})

  // Function to get user's current location
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    console.log('🗺️ Starting location request...')

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('❌ Geolocation not supported, using default NYC location')
        resolve({ latitude: 40.7128, longitude: -74.0060 })
        return
      }

      console.log('📱 Requesting geolocation permission...')

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ Location success:', position.coords.latitude, position.coords.longitude)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.log('⚠️ Location error:', error.code, error.message)
          console.log('🗽 Using default NYC location')
          resolve({ latitude: 40.7128, longitude: -74.0060 })
        },
        {
          timeout: 8000,
          enableHighAccuracy: true,
          maximumAge: 60000
        }
      )
    })
  }

  // Function to fetch user's favorite deals
  const fetchFavoriteDeals = async () => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setFavoriteDeals(data.profile?.favoriteDeals || [])
      }
    } catch (error) {
      console.error('Error fetching favorite deals:', error)
    }
  }

  // Function to toggle favorite status of a deal
  const toggleFavorite = async (dealId: string) => {
    if (!session?.user) return

    setFavoriteLoading(prev => ({ ...prev, [dealId]: true }))

    try {
      const isFavorite = favoriteDeals.includes(dealId)
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId,
          action: isFavorite ? 'remove' : 'add'
        })
      })

      if (response.ok) {
        if (isFavorite) {
          setFavoriteDeals(prev => prev.filter(id => id !== dealId))
        } else {
          setFavoriteDeals(prev => [...prev, dealId])
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [dealId]: false }))
    }
  }

  // Function to get location name from coordinates (using major cities database)
  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    const majorCities = [
      { name: 'New York, NY', lat: 40.7128, lng: -74.0060, radius: 50 },
      { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, radius: 50 },
      { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, radius: 40 },
      { name: 'Houston, TX', lat: 29.7604, lng: -95.3698, radius: 40 },
      { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740, radius: 30 },
      { name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652, radius: 30 },
      { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936, radius: 25 },
      { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611, radius: 25 },
      { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970, radius: 30 },
      { name: 'Austin, TX', lat: 30.2672, lng: -97.7431, radius: 25 }
    ]

    // Find nearest major city
    for (const city of majorCities) {
      const distance = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)) * 69 // Rough miles conversion
      if (distance <= city.radius) {
        return city.name
      }
    }

    // Default to coordinates if no major city found
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`
  }

  // Load deals from API
  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      setLoadingPhase('initial')
      setLoadingProgress(10)

      // Check if user location is already in localStorage (from homepage)
      let userLocation: { latitude: number; longitude: number }

      try {
        const storedLocation = localStorage.getItem('userLocation')
        if (storedLocation) {
          userLocation = JSON.parse(storedLocation)
          console.log('📍 Using stored location:', userLocation)
          setLoadingProgress(25)
        } else {
          // Get user location via geolocation
          userLocation = await getCurrentLocation()
        }
      } catch (e) {
        console.warn('Failed to read localStorage, getting fresh location')
        userLocation = await getCurrentLocation()
      }

      setLocation(userLocation)
      setLoadingProgress(25)

      // Get location name
      const locName = await getLocationName(userLocation.latitude, userLocation.longitude)
      setLocationName(locName)
      setLoadingProgress(40)

      setLoadingPhase('ai_generating')
      setLoadingProgress(50)

      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout

      try {
        const response = await fetch(`/api/deals?lat=${userLocation.latitude}&lng=${userLocation.longitude}&count=200`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        setLoadingProgress(75)
        setLoadingPhase('processing')

        const data = await response.json()
        
        if (data.deals && Array.isArray(data.deals)) {
          setDeals(data.deals)
          setLoadingProgress(100)
          setLoadingPhase('complete')
        } else {
          throw new Error('Invalid data format received from API')
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          console.warn('Request timed out, using fallback deals')
        } else {
          console.warn('API request failed:', fetchError)
        }
        
        // Use fallback deals on any error
        const fallbackDeals = [
          {
            id: "fallback-1",
            title: "Big Mac Meal Deal",
            description: "Big Mac, Medium Fries, Medium Drink",
            originalPrice: "$12.99",
            dealPrice: "$8.99",
            discountPercent: 31,
            restaurantName: "McDonald's",
            category: "Burgers",
            expirationDate: "2024-12-31",
            imageUrl: "/api/placeholder/400/300",
            sourceUrl: "https://mcdonalds.com",
            address: "Near you",
            distance: 0.5,
            qualityScore: 85,
            verified: true,
            source: "Fallback",
            scrapedAt: new Date().toISOString(),
            confidence: 100
          },
          {
            id: "fallback-2",
            title: "Whopper Wednesday",
            description: "Flame-grilled Whopper with special sauce",
            originalPrice: "$9.99",
            dealPrice: "$5.99",
            discountPercent: 40,
            restaurantName: "Burger King",
            category: "Burgers",
            expirationDate: "2024-12-31",
            imageUrl: "/api/placeholder/400/300",
            sourceUrl: "https://burgerking.com",
            address: "Downtown",
            distance: 0.8,
            qualityScore: 80,
            verified: true,
            source: "Fallback",
            scrapedAt: new Date().toISOString(),
            confidence: 100
          }
        ]

        setDeals(fallbackDeals)
        setLoadingProgress(100)
        setLoadingPhase('complete')
      }
    } catch (error: any) {
      console.error('Error loading deals:', error)
      setError('Failed to load deals. Please try again.')
      setLoadingProgress(100)
      setLoadingPhase('complete')
    } finally {
      setLoading(false)
    }
  }

  // Load deals on component mount
  useEffect(() => {
    loadDeals()
  }, [])

  // Fetch favorite deals when user signs in
  useEffect(() => {
    if (session?.user) {
      fetchFavoriteDeals()
    } else {
      setFavoriteDeals([])
    }
  }, [session])

  // Filter and sort deals
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parsePrice(a.dealPrice || '0') - parsePrice(b.dealPrice || '0')
      case 'savings':
        return (b.discountPercent || calculateDiscountPercent(b.originalPrice, b.dealPrice)) -
               (a.discountPercent || calculateDiscountPercent(a.originalPrice, a.dealPrice))
      case 'rating':
        return ((b.qualityScore || 75) / 20) - ((a.qualityScore || 75) / 20)
      case 'distance':
      default:
        return (a.distance || 0) - (b.distance || 0)
    }
  })

  // Get unique categories
  const categories = Array.from(new Set(deals.map(deal => deal.category)))

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'spin 2s linear infinite'
          }}>
            <div style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>🍔</div>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Finding Amazing Deals
          </h2>

          <p style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            {loadingPhase === 'initial' && 'Getting your location...'}
            {loadingPhase === 'ai_generating' && 'AI is discovering the best deals near you...'}
            {loadingPhase === 'processing' && 'Processing deals and calculating savings...'}
            {loadingPhase === 'complete' && 'Almost ready!'}
          </p>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: `${loadingProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>

          <div style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            fontWeight: '500',
            marginBottom: '1.5rem'
          }}>
            {loadingProgress}% Complete
          </div>

          {/* Skip Location Button - show after 3 seconds */}
          {loadingPhase === 'initial' && (
            <button
              onClick={async () => {
                console.log('🚀 Skip location button clicked, loading deals with default location')
                setLocation({ latitude: 40.7128, longitude: -74.0060 })
                setLocationName('New York, NY')
                setLoadingProgress(50)
                setLoadingPhase('ai_generating')

                // Load deals without user location
                try {
                  const response = await fetch('/api/deals?count=200')
                  const data = await response.json()

                  if (data.deals && Array.isArray(data.deals)) {
                    setDeals(data.deals)
                    setLoadingProgress(100)
                    setLoadingPhase('complete')
                    setTimeout(() => setLoading(false), 500)
                  }
                } catch (error) {
                  console.error('Failed to load deals:', error)
                  setError('Failed to load deals. Please try again.')
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
            >
              Skip Location - Browse All Deals
            </button>
          )}
        </div>

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading Deals</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'clamp(0.75rem, 4vw, 2rem)'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'clamp(1.5rem, 5vw, 2.5rem)',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: 'white',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          lineHeight: '1.1'
        }}>
          Fast Food Deals Near You
        </h1>


        <style jsx>{`
          @keyframes glow {
            from { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 165, 0, 0.6); }
            to { text-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 165, 0, 0.8); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>

      {/* Search */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto 2rem auto'
      }}>
        <input
          type="text"
          placeholder="🔍 Search for your favorite deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: 'clamp(1rem, 3vw, 1.25rem) clamp(1.5rem, 4vw, 2rem)',
            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            fontWeight: '500',
            border: 'none',
            borderRadius: '25px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit',
            textAlign: 'center'
          }}
          onFocus={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            e.target.style.textAlign = 'left'
          }}
          onBlur={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            if (!e.target.value) e.target.style.textAlign = 'center'
          }}
        />

      </div>

      {/* Deals Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(0.75rem, 3vw, 1.5rem)',
        marginBottom: '2rem'
      }}>
        {sortedDeals.map((deal) => {
          const discountPercent = deal.discountPercent || calculateDiscountPercent(deal.originalPrice, deal.dealPrice)

          return (
            <div
              key={deal.id}
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '24px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                position: 'relative'
              }}
              onClick={() => setSelectedDeal(deal)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)'
                e.currentTarget.style.borderColor = '#667eea'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)'
              }}
            >
              {/* Header Bar */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: 'clamp(0.75rem, 3vw, 1rem)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 0
              }}>
                <div style={{
                  color: 'white',
                  fontSize: 'clamp(1rem, 3.5vw, 1.1rem)',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  flex: 1
                }}>
                  {deal.restaurantName || 'Restaurant'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Favorite Button */}
                  {session?.user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(deal.id)
                      }}
                      disabled={favoriteLoading[deal.id]}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: favoriteLoading[deal.id] ? 'not-allowed' : 'pointer',
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        opacity: favoriteLoading[deal.id] ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!favoriteLoading[deal.id]) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                          e.currentTarget.style.transform = 'scale(1.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      {favoriteDeals.includes(deal.id) ? '❤️' : '🤍'}
                    </button>
                  )}

                  {/* Discount Badge */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#667eea',
                    borderRadius: '20px',
                    padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
                    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                    fontWeight: '700',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {discountPercent}% OFF
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div style={{
                padding: 'clamp(1.25rem, 4vw, 1.5rem)'
              }}>
                {/* Distance & Rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(0.75rem, 3vw, 1rem)',
                  marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                  color: '#64748b',
                  fontWeight: '600'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    📍 {deal.distance ? deal.distance.toFixed(1) + ' mi' : 'N/A'}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    ⭐ {((deal.qualityScore || 75) / 20).toFixed(1)}
                  </span>
                </div>

                {/* Deal Title */}
                <h3 style={{
                  fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                  lineHeight: '1.3',
                  letterSpacing: '-0.01em'
                }}>
                  {deal.title || 'Deal Title'}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  color: '#64748b',
                  marginBottom: 'clamp(1rem, 3vw, 1.25rem)',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>
                  {deal.description || 'Great deal available!'}
                </p>

                {/* Price Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 'clamp(0.75rem, 3vw, 1rem)',
                  marginBottom: 'clamp(1.25rem, 4vw, 1.5rem)',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    fontSize: 'clamp(1.75rem, 6vw, 2.25rem)',
                    fontWeight: '700',
                    color: '#10b981',
                    lineHeight: '1'
                  }}>
                    {parsePrice(deal.dealPrice || '0') === 0 ? 'FREE' : `$${parsePrice(deal.dealPrice || '0').toFixed(2)}`}
                  </div>
                  {parsePrice(deal.originalPrice || '0') > 0 && (
                    <div style={{
                      fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                      color: '#94a3b8',
                      textDecoration: 'line-through',
                      fontWeight: '600'
                    }}>
                      ${parsePrice(deal.originalPrice || '0').toFixed(2)}
                    </div>
                  )}
                  {parsePrice(deal.originalPrice || '0') > parsePrice(deal.dealPrice || '0') && (
                    <div style={{
                      fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                      color: '#dc2626',
                      fontWeight: '700',
                      backgroundColor: '#fef2f2',
                      padding: 'clamp(0.3rem, 1.5vw, 0.4rem) clamp(0.6rem, 2.5vw, 0.75rem)',
                      borderRadius: '12px',
                      border: '1px solid #fecaca'
                    }}>
                      Save ${(parsePrice(deal.originalPrice || '0') - parsePrice(deal.dealPrice || '0')).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: deal.sourceUrl ? '1fr 1fr' : '1fr',
                  gap: 'clamp(0.75rem, 3vw, 1rem)'
                }}>
                  {/* View Deal Button */}
                  {deal.sourceUrl && (
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        padding: 'clamp(0.875rem, 3.5vw, 1rem)',
                        fontSize: 'clamp(0.95rem, 3vw, 1.05rem)',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontFamily: 'inherit',
                        touchAction: 'manipulation',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.25)',
                        letterSpacing: '0.025em'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.25)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(deal.sourceUrl, '_blank')
                      }}
                    >
                      🎯 View Deal
                    </button>
                  )}

                  {/* Directions Button */}
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      padding: 'clamp(0.875rem, 3.5vw, 1rem)',
                      fontSize: 'clamp(0.95rem, 3vw, 1.05rem)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontFamily: 'inherit',
                      touchAction: 'manipulation',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                      letterSpacing: '0.025em'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.25)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      getDirectionsToRestaurant(deal.restaurantName, location || undefined)
                    }}
                  >
                    �� Get Directions
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {sortedDeals.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '3rem 1rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No deals found</h3>
          <p style={{ opacity: '0.8' }}>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000
        }}
        onClick={() => setSelectedDeal(null)}
        >
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                {selectedDeal.title}
              </h2>
              <button
                onClick={() => setSelectedDeal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#667eea', marginBottom: '0.5rem' }}>
                {selectedDeal.restaurantName}
              </div>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                {selectedDeal.description}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: '#059669' }}>
                  ${parsePrice(selectedDeal.dealPrice || '0').toFixed(2)}
                </span>
                <span style={{ fontSize: '1.25rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                  ${parsePrice(selectedDeal.originalPrice || '0').toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: '1rem', color: '#dc2626', fontWeight: '600' }}>
                Save ${(parsePrice(selectedDeal.originalPrice || '0') - parsePrice(selectedDeal.dealPrice || '0')).toFixed(2)} ({selectedDeal.discountPercent || calculateDiscountPercent(selectedDeal.originalPrice, selectedDeal.dealPrice)}% off)
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Deal Details:</div>
              <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                📍 {selectedDeal.address || 'Near you'}<br/>
                📅 Valid until: {selectedDeal.expirationDate || 'Limited time'}<br/>
                ⭐ Quality Score: {selectedDeal.qualityScore || 75}/100<br/>
                🏷️ Category: {selectedDeal.category}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: selectedDeal.sourceUrl ? '1fr 1fr' : '1fr',
              gap: '1rem'
            }}>
              {selectedDeal.sourceUrl && (
                <button
                  onClick={() => window.open(selectedDeal.sourceUrl, '_blank')}
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  🎯 View Deal
                </button>
              )}

              <button
                onClick={() => getDirectionsToRestaurant(selectedDeal.restaurantName, location || undefined)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                🧭 Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

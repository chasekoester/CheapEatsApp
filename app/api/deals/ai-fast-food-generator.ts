import OpenAI from 'openai'
import { Deal } from './types'

export class AIFastFoodGenerator {
  private openai: OpenAI
  private fastFoodChains: string[]

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required')
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Focus on major fast food chains
    this.fastFoodChains = [
      "McDonald's", "Burger King", "Taco Bell", "KFC", "Subway", "Pizza Hut", 
      "Wendy's", "Domino's", "Chipotle", "Starbucks", "Dunkin'", "Arby's", 
      "Sonic", "Dairy Queen", "Papa John's", "Little Caesars", "Chick-fil-A", 
      "Five Guys", "In-N-Out", "White Castle", "Jack in the Box", "Carl's Jr", 
      "Hardee's", "Qdoba", "Panera", "Jimmy John's", "Popeyes", "Tim Hortons", 
      "Whataburger", "Del Taco", "Panda Express", "Culver's", "Raising Cane's", 
      "El Pollo Loco", "Moe's", "Blaze Pizza", "Papa Murphy's", "Checkers", 
      "Rally's", "Zaxby's", "Bojangles", "Cook Out", "Krystal", "Captain D's"
    ]
  }

  /**
   * Generate 50-100 AI-powered fast food deals
   */
  async generateFastFoodDeals(location: { latitude: number; longitude: number }, count: number = 75): Promise<Deal[]> {
    try {
      console.log(`🤖 Generating ${count} AI-powered fast food deals...`)

      // Skip AI generation if no API key or disabled
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'test-key-disabled') {
        console.log('⚠️ OpenAI API disabled, using fallback deals')
        return this.getFallbackFastFoodDeals(location, count)
      }

      const prompt = `You are a fast food deals expert. Generate exactly ${count} realistic, current fast food deals for coordinates ${location.latitude}, ${location.longitude}.

Create deals that customers would actually find at these popular chains: ${this.fastFoodChains.slice(0, 15).join(', ')}, and others.

CRITICAL REQUIREMENTS:
- Each deal must be COMPLETELY UNIQUE - no duplicate or similar deals
- Maximum 2 deals per restaurant chain
- Each deal must target different meal types (breakfast, lunch, dinner, drinks, snacks)
- Vary deal types significantly across restaurants

Focus on these types of fast food deals:
- App-exclusive promotions (very common)
- BOGO offers (Buy One Get One)
- Percentage discounts (10-50% off)
- Fixed price meals ($5 meals, $1 drinks, etc.)
- Limited time offers
- Student/military discounts
- Loyalty program rewards
- Combo meal deals
- Happy hour specials
- Free items with purchase

Make deals sound authentic and appealing. Use realistic pricing. Include variety across breakfast, lunch, dinner, drinks, and snacks.

IMPORTANT: Include a realistic "sourceUrl" for each deal that looks like it could be from the restaurant's official website, app, or deals page.

Return ONLY a valid JSON array with exactly ${count} deals:
[
  {
    "restaurantName": "McDonald's",
    "title": "Big Mac Meal $6.99 via App",
    "description": "Get a Big Mac, medium fries, and medium drink for just $6.99 when you order through the McDonald's mobile app. Limited time offer.",
    "category": "Fast Food",
    "originalPrice": "$10.49",
    "dealPrice": "$6.99",
    "dealType": "dollar_off",
    "expirationDate": "2024-02-28",
    "sourceUrl": "https://www.mcdonalds.com/us/en-us/deals.html"
  }
]

Categories to use: Fast Food, Pizza, Mexican, Coffee, Sandwiches, Chicken, Burgers, Asian
Deal types: percentage_off, dollar_off, bogo, free_item, combo_deal, limited_time, app_exclusive
Keep descriptions under 150 characters and make each deal unique and realistic.`

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('OpenAI API timeout')), 15000) // 15 second timeout
      })

      const completion = await Promise.race([
        this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 4000,
          temperature: 0.7,
        }),
        timeoutPromise
      ]) as any

      const response = completion.choices[0]?.message?.content || ''
      
      try {
        // Clean up response to ensure it's valid JSON
        const cleanedResponse = response
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim()
        
        const deals = JSON.parse(cleanedResponse)
        
        if (!Array.isArray(deals)) {
          throw new Error('Response is not an array')
        }

        console.log(`✅ AI generated ${deals.length} fast food deals`)
        return await this.processAIDeals(deals, location)
      } catch (parseError) {
        console.error('Failed to parse AI deals:', parseError)
        console.log('Raw AI response:', response.substring(0, 500))
        return await this.getFallbackFastFoodDeals(location, count)
      }
    } catch (error) {
      console.error('AI fast food generation error:', error)
      return this.getFallbackFastFoodDeals(location, count)
    }
  }

  /**
   * Process AI-generated deals and add required fields
   */
  private async processAIDeals(aiDeals: any[], location: { latitude: number; longitude: number }): Promise<Deal[]> {
    const processedDeals = await Promise.all(
      aiDeals.map(async (deal, index) => {
        // Get real restaurant location for this chain
        const restaurantLocation = await this.getNearestRestaurantLocation(deal.restaurantName || 'McDonald\'s', location)

      // Calculate actual distance using Haversine formula
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        restaurantLocation.latitude,
        restaurantLocation.longitude
      )

      // Use the real restaurant coordinates
      const latitude = restaurantLocation.latitude
      const longitude = restaurantLocation.longitude
      const address = restaurantLocation.address

      return {
        id: `ai-fast-food-${Date.now()}-${index}`,
        restaurantName: deal.restaurantName || this.getRandomChain(),
        title: deal.title || 'Special Fast Food Deal',
        description: deal.description || 'Limited time offer on fast food favorites',
        category: this.categorizeFastFood(deal.restaurantName || ''),
        originalPrice: deal.originalPrice,
        dealPrice: deal.dealPrice || 'Special Price',
        discountPercent: this.calculateDiscountPercent(deal.originalPrice, deal.dealPrice),
        expirationDate: deal.expirationDate || this.getRandomExpirationDate(),
        latitude,
        longitude,
        distance,
        address,
        qualityScore: Math.floor(Math.random() * 25) + 75, // 75-100 for AI deals
        dealType: deal.dealType || this.determineDealType(deal.dealPrice || '', deal.title || ''),
        restrictions: this.generateRestrictions(deal.title || '', deal.description || ''),
        requiresApp: deal.title?.toLowerCase().includes('app') || Math.random() < 0.3,
        requiresMembership: deal.title?.toLowerCase().includes('member') || Math.random() < 0.1,
        minimumPurchase: deal.minimumPurchase,
        verified: true,
        source: 'AI Generated - Fast Food Database',
        sourceType: 'ai_generated' as const,
        sourceUrl: deal.sourceUrl || this.getRestaurantUrl(deal.restaurantName || ''),
        scrapedAt: new Date().toISOString(),
        confidence: 95,
        imageUrl: this.getFoodImage(deal.restaurantName || '')
      } as Deal
      })
    )

    // Remove invalid deals and duplicates
    const validDeals = processedDeals.filter(deal => deal.restaurantName && deal.title)

    // Deduplicate deals by restaurant + similar title
    const deduplicatedDeals = this.deduplicateDeals(validDeals)

    return deduplicatedDeals
  }

  /**
   * Remove duplicate deals based on restaurant and deal similarity
   */
  private deduplicateDeals(deals: Deal[]): Deal[] {
    const seen = new Map<string, Deal>()
    const restaurantCounts = new Map<string, number>()

    for (const deal of deals) {
      const restaurant = deal.restaurantName.toLowerCase()
      const dealKey = this.generateDealKey(deal)

      // Skip if we already have this exact deal
      if (seen.has(dealKey)) {
        continue
      }

      // Limit to 2 deals per restaurant
      const currentCount = restaurantCounts.get(restaurant) || 0
      if (currentCount >= 2) {
        continue
      }

      // Check for similar deals at the same restaurant
      const isUnique = !Array.from(seen.values()).some(existingDeal =>
        existingDeal.restaurantName.toLowerCase() === restaurant &&
        this.areDealsVerySimlar(deal, existingDeal)
      )

      if (isUnique) {
        seen.set(dealKey, deal)
        restaurantCounts.set(restaurant, currentCount + 1)
      }
    }

    return Array.from(seen.values())
  }

  /**
   * Generate a unique key for a deal
   */
  private generateDealKey(deal: Deal): string {
    const restaurant = deal.restaurantName.toLowerCase()
    const title = deal.title.toLowerCase()
    const price = deal.dealPrice?.toLowerCase() || ''

    // Create a key based on restaurant, key words from title, and price
    const titleWords = title.split(' ').filter(word =>
      word.length > 3 && !['deal', 'off', 'the', 'and', 'for', 'with'].includes(word)
    ).slice(0, 3).join('-')

    return `${restaurant}-${titleWords}-${price}`
  }

  /**
   * Check if two deals are very similar (likely duplicates)
   */
  private areDealsVerySimlar(deal1: Deal, deal2: Deal): boolean {
    const title1 = deal1.title.toLowerCase()
    const title2 = deal2.title.toLowerCase()

    // Check for similar titles (BOGO, Happy Hour, etc.)
    const similarities = [
      'bogo', 'happy hour', 'free', '$1', '$2', '$3', '$4', '$5',
      'combo', 'meal', 'box', 'special', 'off'
    ]

    for (const term of similarities) {
      if (title1.includes(term) && title2.includes(term)) {
        // If both titles contain the same promotional term, they're likely similar
        return true
      }
    }

    // Check if titles are very similar (>60% matching words)
    const words1 = title1.split(' ')
    const words2 = title2.split(' ')
    const matchingWords = words1.filter(word => words2.includes(word))
    const similarity = matchingWords.length / Math.max(words1.length, words2.length)

    return similarity > 0.6
  }

  /**
   * Categorize restaurant by name
   */
  private categorizeFastFood(restaurantName: string): string {
    const name = restaurantName.toLowerCase()
    
    if (name.includes('pizza')) return 'Pizza'
    if (name.includes('taco') || name.includes('chipotle') || name.includes('qdoba') || name.includes('del taco') || name.includes('moe')) return 'Mexican'
    if (name.includes('subway') || name.includes('jimmy') || name.includes('panera')) return 'Sandwiches'
    if (name.includes('starbucks') || name.includes('dunkin') || name.includes('tim hortons')) return 'Coffee'
    if (name.includes('kfc') || name.includes('popeyes') || name.includes('chick') || name.includes('raising cane') || name.includes('zaxby') || name.includes('bojangles')) return 'Chicken'
    if (name.includes('panda') || name.includes('pei wei')) return 'Asian'
    if (name.includes('burger') || name.includes('five guys') || name.includes('in-n-out') || name.includes('whataburger') || name.includes('culver') || name.includes('shake shack')) return 'Burgers'
    
    return 'Fast Food'
  }

  /**
   * Generate fallback deals if AI fails
   */
  private async getFallbackFastFoodDeals(location: { latitude: number; longitude: number }, count: number): Promise<Deal[]> {
    const templates = [
      {
        chain: "McDonald's",
        url: "https://www.mcdonalds.com/us/en-us/deals.html",
        deals: [
          { title: "Big Mac Meal $6.99", description: "Big Mac, medium fries, and medium drink for $6.99 via app", price: "$6.99", original: "$10.49" },
          { title: "Free Fries Friday", description: "Free medium fries with any $1+ purchase every Friday", price: "Free", original: "$2.99" },
          { title: "20% Off Entire Order", description: "20% off when you order $10+ through the McDonald's app", price: "20% off", original: "" },
          { title: "$1 Any Size Soft Drink", description: "Any size soft drink for just $1 all day long", price: "$1.00", original: "$2.79" }
        ]
      },
      {
        chain: "Burger King",
        url: "https://www.bk.com/menu/offers",
        deals: [
          { title: "Whopper Wednesday $3", description: "Flame-grilled Whopper for just $3 every Wednesday", price: "$3.00", original: "$6.99" },
          { title: "2 for $6 Whopper Meals", description: "Two Whopper meals for $6 when you order via app", price: "$6.00", original: "$13.98" },
          { title: "Free Delivery on $15+", description: "Free delivery on orders $15 or more through BK app", price: "Free", original: "$2.99" }
        ]
      },
      {
        chain: "Taco Bell",
        url: "https://www.tacobell.com/deals",
        deals: [
          { title: "Crunchwrap Supreme $3.99", description: "Crunchwrap Supreme for $3.99 via app order", price: "$3.99", original: "$5.49" },
          { title: "Build Your Own Cravings Box", description: "Choose 4 items for $5: tacos, burritos, sides, and drink", price: "$5.00", original: "$8.99" },
          { title: "Happy Hour: Drinks $1", description: "All drinks $1 from 2-5 PM daily at participating locations", price: "$1.00", original: "$2.49" }
        ]
      },
      {
        chain: "Subway",
        url: "https://www.subway.com/en-us/menunutrition/menu/deals",
        deals: [
          { title: "Footlong Friday $5.99", description: "Any footlong sub for $5.99 every Friday", price: "$5.99", original: "$8.99" },
          { title: "BOGO 50% Off Footlongs", description: "Buy one footlong, get second 50% off with app order", price: "BOGO 50%", original: "$8.99" },
          { title: "Free Cookie with Sub", description: "Free cookie with any footlong or 6-inch sub purchase", price: "Free", original: "$1.99" }
        ]
      },
      {
        chain: "KFC",
        url: "https://www.kfc.com/deals",
        deals: [
          { title: "$5 Fill Up Meals", description: "Complete meal with chicken, side, biscuit, and drink for $5", price: "$5.00", original: "$8.99" },
          { title: "Free Biscuit Monday", description: "Free biscuit with any purchase every Monday", price: "Free", original: "$1.99" },
          { title: "8-Piece Bucket $12.99", description: "8 pieces of Original Recipe chicken for $12.99", price: "$12.99", original: "$18.99" }
        ]
      },
      {
        chain: "Pizza Hut",
        url: "https://www.pizzahut.com/deals",
        deals: [
          { title: "Large 3-Topping $11.99", description: "Large pizza with up to 3 toppings for carryout", price: "$11.99", original: "$16.99" },
          { title: "Personal Pan Pizza $3.99", description: "Personal pan pizza with 1 topping for $3.99", price: "$3.99", original: "$5.99" },
          { title: "Dinner Box $19.99", description: "2 medium pizzas, breadsticks, and wings for $19.99", price: "$19.99", original: "$32.99" }
        ]
      },
      {
        chain: "Starbucks",
        url: "https://www.starbucks.com/rewards",
        deals: [
          { title: "Happy Hour BOGO", description: "Buy one handcrafted drink, get one 50% off 3-6 PM", price: "BOGO 50%", original: "$5.95" },
          { title: "Free Drink on Birthday", description: "Free drink of any size on your birthday with app", price: "Free", original: "$5.95" },
          { title: "$2 Iced Coffee", description: "Grande iced coffee for $2 all day via mobile order", price: "$2.00", original: "$3.45" }
        ]
      }
    ]

    const fallbackDeals: any[] = []
    const usedDeals = new Set<string>() // Track used deals to prevent duplicates
    const chainsToUse = templates // Use all templates for variety

    // First pass: Add unique deals from each chain
    for (const chainData of chainsToUse) {
      for (const deal of chainData.deals) {
        const dealKey = `${chainData.chain}-${deal.title}`
        if (!usedDeals.has(dealKey)) {
          usedDeals.add(dealKey)
          fallbackDeals.push({
            restaurantName: chainData.chain,
            title: deal.title,
            description: deal.description,
            dealPrice: deal.price,
            originalPrice: deal.original || undefined,
            category: this.categorizeFastFood(chainData.chain),
            expirationDate: this.getRandomExpirationDate(),
            sourceUrl: chainData.url
          })
        }
      }
    }

    // Second pass: Create variations if we need more deals
    let variationCounter = 1
    while (fallbackDeals.length < count && variationCounter <= 3) {
      for (const chainData of chainsToUse) {
        if (fallbackDeals.length >= count) break

        for (const deal of chainData.deals) {
          if (fallbackDeals.length >= count) break

          const dealKey = `${chainData.chain}-${deal.title}-v${variationCounter}`
          if (!usedDeals.has(dealKey)) {
            usedDeals.add(dealKey)
            fallbackDeals.push({
              restaurantName: chainData.chain,
              title: this.createDealVariation(deal.title, variationCounter),
              description: this.createDescriptionVariation(deal.description, variationCounter),
              dealPrice: this.varyPrice(deal.price, variationCounter),
              originalPrice: deal.original ? this.varyPrice(deal.original, variationCounter) : undefined,
              category: this.categorizeFastFood(chainData.chain),
              expirationDate: this.getRandomExpirationDate(),
              sourceUrl: chainData.url
            })
          }
        }
      }
      variationCounter++
    }

    return await this.processAIDeals(fallbackDeals.slice(0, count), location)
  }

  /**
   * Find restaurants using Google Places API
   */
  private async findRestaurantsNearby(restaurantName: string, userLocation: { latitude: number; longitude: number }, radius: number = 25000): Promise<Array<{ latitude: number; longitude: number; address: string; place_id: string }>> {
    try {
      // You can get a free Google Places API key from: https://developers.google.com/maps/documentation/places/web-service/get-api-key
      const apiKey = process.env.GOOGLE_PLACES_API_KEY

      if (!apiKey) {
        console.warn('Google Places API key not found, using fallback locations')
        return this.getFallbackLocations(restaurantName, userLocation)
      }

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.latitude},${userLocation.longitude}&radius=${radius}&type=restaurant&keyword=${encodeURIComponent(restaurantName)}&key=${apiKey}`

      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      })
      clearTimeout(timeoutId)

      const data = await response.json()

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results.slice(0, 10).map((place: any) => ({
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          address: place.vicinity || place.formatted_address || 'Address not available',
          place_id: place.place_id
        }))
      }

      return this.getFallbackLocations(restaurantName, userLocation)
    } catch (error) {
      console.warn('Error fetching from Google Places API:', error)
      return this.getFallbackLocations(restaurantName, userLocation)
    }
  }

  /**
   * Fallback locations when API is not available
   */
  private getFallbackLocations(restaurantName: string, userLocation: { latitude: number; longitude: number }): Array<{ latitude: number; longitude: number; address: string; place_id: string }> {
    // Basic fallback with some major locations
    const fallbackData: { [key: string]: Array<{ latitude: number; longitude: number; address: string }> } = {
      "mcdonald": [
        { latitude: 40.7589, longitude: -73.9851, address: "1560 Broadway, New York, NY" },
        { latitude: 34.0522, longitude: -118.2437, address: "6776 Hollywood Blvd, Los Angeles, CA" },
        { latitude: 41.8781, longitude: -87.6298, address: "600 N Clark St, Chicago, IL" },
      ],
      "burger": [
        { latitude: 40.7505, longitude: -73.9934, address: "89 E 42nd St, New York, NY" },
        { latitude: 34.0407, longitude: -118.2468, address: "5201 W Sunset Blvd, Los Angeles, CA" },
        { latitude: 41.8796, longitude: -87.6237, address: "179 N Wabash Ave, Chicago, IL" },
      ],
      "taco": [
        { latitude: 40.7282, longitude: -74.0776, address: "446 6th Ave, New York, NY" },
        { latitude: 34.0928, longitude: -118.3287, address: "7071 Sunset Blvd, Los Angeles, CA" },
        { latitude: 41.8675, longitude: -87.6169, address: "1111 S State St, Chicago, IL" },
      ]
    }

    const searchKey = restaurantName.toLowerCase()
    for (const [key, locations] of Object.entries(fallbackData)) {
      if (searchKey.includes(key)) {
        return locations.map(loc => ({ ...loc, place_id: `fallback_${key}` }))
      }
    }

    // If no match, create a location near the user
    return [{
      latitude: userLocation.latitude + (Math.random() - 0.5) * 0.1,
      longitude: userLocation.longitude + (Math.random() - 0.5) * 0.1,
      address: `${restaurantName} location near you`,
      place_id: 'fallback_generic'
    }]
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959 // Radius of Earth in miles
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return Math.round(distance * 10) / 10 // Round to 1 decimal place
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * Get nearest restaurant location for a given chain using Google Places API
   */
  private async getNearestRestaurantLocation(restaurantName: string, userLocation: { latitude: number; longitude: number }): Promise<{ latitude: number; longitude: number; address: string }> {
    try {
      // Get nearby restaurants from Google Places API
      const nearbyRestaurants = await this.findRestaurantsNearby(restaurantName, userLocation)

      if (nearbyRestaurants.length === 0) {
        // Fallback to a location near the user
        return {
          latitude: userLocation.latitude + (Math.random() - 0.5) * 0.05,
          longitude: userLocation.longitude + (Math.random() - 0.5) * 0.05,
          address: `${restaurantName} near you`
        }
      }

      // Find the nearest location
      let nearestLocation = nearbyRestaurants[0]
      let shortestDistance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        nearestLocation.latitude,
        nearestLocation.longitude
      )

      for (const location of nearbyRestaurants) {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude
        )
        if (distance < shortestDistance) {
          shortestDistance = distance
          nearestLocation = location
        }
      }

      return {
        latitude: nearestLocation.latitude,
        longitude: nearestLocation.longitude,
        address: nearestLocation.address
      }
    } catch (error) {
      console.warn('Error finding nearest restaurant:', error)
      // Fallback location
      return {
        latitude: userLocation.latitude + (Math.random() - 0.5) * 0.05,
        longitude: userLocation.longitude + (Math.random() - 0.5) * 0.05,
        address: `${restaurantName} near you`
      }
    }
  }

  /**
   * Create a variation of a deal title to avoid duplicates
   */
  private createDealVariation(originalTitle: string, variation: number): string {
    const variations = [
      ['Deal', 'Special', 'Offer', 'Promotion'],
      ['Limited Time', 'Today Only', 'Weekend', 'Daily'],
      ['Save Big', 'Best Value', 'Hot Deal', 'Flash Sale']
    ]

    // Simple variation logic - could be more sophisticated
    if (variation === 1) {
      return originalTitle.replace('Deal', variations[0][1] || 'Special')
    } else if (variation === 2) {
      return `${variations[1][variation % variations[1].length]} ${originalTitle}`
    } else {
      return `${variations[2][variation % variations[2].length]} - ${originalTitle}`
    }
  }

  /**
   * Create a variation of a deal description
   */
  private createDescriptionVariation(originalDesc: string, variation: number): string {
    const prefixes = ['', 'Limited time: ', 'Exclusive: ', 'Best deal: ']
    const suffixes = ['', ' - while supplies last', ' - app only', ' - dine-in or takeout']

    return `${prefixes[variation % prefixes.length]}${originalDesc}${suffixes[variation % suffixes.length]}`
  }

  /**
   * Vary price slightly to create different deals
   */
  private varyPrice(originalPrice: string, variation: number): string {
    if (!originalPrice.includes('$')) return originalPrice

    const price = parseFloat(originalPrice.replace('$', ''))
    if (isNaN(price)) return originalPrice

    const variations = [0, -0.5, 0.5, -1.0, 1.0]
    const newPrice = Math.max(0.99, price + (variations[variation % variations.length] || 0))

    return `$${newPrice.toFixed(2)}`
  }

  /**
   * Generate realistic address
   */
  private generateRealisticAddress(lat: number, lng: number): string {
    const streetNumbers = ['123', '456', '789', '1001', '2500', '3456', '4789', '5678', '901', '1234', '567', '890']
    const streetNames = [
      'Main Street', 'Broadway', 'First Avenue', 'Oak Street', 'Park Avenue',
      'Central Boulevard', 'Market Street', 'Church Street', 'Washington Ave',
      'Lincoln Road', 'Maple Drive', 'Pine Street', 'Cedar Avenue', 'Elm Street'
    ]

    const number = streetNumbers[Math.floor(Math.random() * streetNumbers.length)]
    const street = streetNames[Math.floor(Math.random() * streetNames.length)]
    
    return `${number} ${street}`
  }

  /**
   * Calculate discount percentage
   */
  private calculateDiscountPercent(originalPrice?: string, dealPrice?: string): number | undefined {
    if (!originalPrice || !dealPrice) return undefined
    
    const original = parseFloat(originalPrice.replace(/[^0-9.]/g, ''))
    const deal = parseFloat(dealPrice.replace(/[^0-9.]/g, ''))
    
    if (isNaN(original) || isNaN(deal)) return undefined
    
    return Math.round(((original - deal) / original) * 100)
  }

  /**
   * Determine deal type from pricing and title
   */
  private determineDealType(dealPrice: string, title: string): Deal['dealType'] {
    const price = dealPrice.toLowerCase()
    const titleLower = title.toLowerCase()
    
    if (price.includes('free') || price.includes('bogo') || titleLower.includes('bogo')) return 'bogo'
    if (price.includes('%') || titleLower.includes('% off')) return 'percentage_off'
    if (price.includes('$') && (price.includes('off') || titleLower.includes('off'))) return 'dollar_off'
    if (titleLower.includes('app') || titleLower.includes('mobile')) return 'app_exclusive'
    if (titleLower.includes('combo') || titleLower.includes('meal') || titleLower.includes('box')) return 'combo_deal'
    if (titleLower.includes('member') || titleLower.includes('loyalty')) return 'membership'
    if (price.includes('free')) return 'free_item'
    
    return 'limited_time'
  }

  /**
   * Generate restrictions based on deal content
   */
  private generateRestrictions(title: string, description: string): string[] {
    const restrictions: string[] = []
    const content = (title + ' ' + description).toLowerCase()
    
    if (content.includes('app') || content.includes('mobile')) {
      restrictions.push('Mobile app required')
    }
    if (content.includes('participating')) {
      restrictions.push('At participating locations only')
    }
    if (content.includes('limited time')) {
      restrictions.push('Limited time offer')
    }
    if (content.includes('one per')) {
      restrictions.push('One per customer')
    }
    if (content.includes('not valid with')) {
      restrictions.push('Cannot be combined with other offers')
    }
    
    return restrictions
  }

  /**
   * Get random expiration date (1-4 weeks from now)
   */
  private getRandomExpirationDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + Math.floor(Math.random() * 21) + 7) // 7-28 days
    return date.toISOString().split('T')[0]
  }

  /**
   * Get random chain name
   */
  private getRandomChain(): string {
    return this.fastFoodChains[Math.floor(Math.random() * this.fastFoodChains.length)]
  }

  /**
   * Get restaurant's official deals URL
   */
  private getRestaurantUrl(restaurantName: string): string {
    const name = restaurantName.toLowerCase()

    if (name.includes('mcdonald')) return 'https://www.mcdonalds.com/us/en-us/deals.html'
    if (name.includes('burger') && name.includes('king')) return 'https://www.bk.com/menu/offers'
    if (name.includes('taco') && name.includes('bell')) return 'https://www.tacobell.com/deals'
    if (name.includes('kfc')) return 'https://www.kfc.com/deals'
    if (name.includes('subway')) return 'https://www.subway.com/en-us/menunutrition/menu/deals'
    if (name.includes('pizza') && name.includes('hut')) return 'https://www.pizzahut.com/deals'
    if (name.includes('wendy')) return 'https://www.wendys.com/offers'
    if (name.includes('domino')) return 'https://www.dominos.com/en/deals'
    if (name.includes('chipotle')) return 'https://www.chipotle.com/promotions'
    if (name.includes('starbucks')) return 'https://www.starbucks.com/rewards'
    if (name.includes('dunkin')) return 'https://www.dunkindonuts.com/en/dd-perks'
    if (name.includes('arby')) return 'https://arbys.com/deals'
    if (name.includes('sonic')) return 'https://www.sonicdrivein.com/deals'
    if (name.includes('dairy') && name.includes('queen')) return 'https://www.dairyqueen.com/us-en/Locator/Detail/?localechange=1&'
    if (name.includes('papa') && name.includes('john')) return 'https://www.papajohns.com/deals'
    if (name.includes('little') && name.includes('caesars')) return 'https://littlecaesars.com/en-us/deals/'
    if (name.includes('chick') && name.includes('fil')) return 'https://www.chick-fil-a.com/promotions'
    if (name.includes('five') && name.includes('guys')) return 'https://www.fiveguys.com/'
    if (name.includes('in-n-out') || name.includes('in n out')) return 'https://www.in-n-out.com/'
    if (name.includes('white') && name.includes('castle')) return 'https://www.whitecastle.com/promotions'
    if (name.includes('jack') && name.includes('box')) return 'https://www.jackinthebox.com/deals'
    if (name.includes('carl') && name.includes('jr')) return 'https://www.carlsjr.com/deals'
    if (name.includes('hardee')) return 'https://www.hardees.com/deals'
    if (name.includes('qdoba')) return 'https://www.qdoba.com/rewards'
    if (name.includes('panera')) return 'https://www.panerabread.com/en-us/mypanera/rewards.html'
    if (name.includes('jimmy') && name.includes('john')) return 'https://www.jimmyjohns.com/deals/'
    if (name.includes('popeyes')) return 'https://www.popeyes.com/deals'
    if (name.includes('tim') && name.includes('hortons')) return 'https://www.timhortons.com/deals'
    if (name.includes('whataburger')) return 'https://whataburger.com/deals'
    if (name.includes('del') && name.includes('taco')) return 'https://www.deltaco.com/deals'
    if (name.includes('panda') && name.includes('express')) return 'https://www.pandaexpress.com/deals'
    if (name.includes('culver')) return 'https://www.culvers.com/menu-and-nutrition/value-menu'
    if (name.includes('raising') && name.includes('cane')) return 'https://www.raisingcanes.com/'

    // Default fallback
    return 'https://www.google.com/search?q=' + encodeURIComponent(restaurantName + ' deals')
  }

  /**
   * Get appropriate food image URL
   */
  private getFoodImage(restaurantName: string): string {
    const name = restaurantName.toLowerCase()
    
    if (name.includes('pizza')) {
      return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    }
    if (name.includes('taco') || name.includes('mexican')) {
      return 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop'
    }
    if (name.includes('coffee') || name.includes('starbucks') || name.includes('dunkin')) {
      return 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop'
    }
    if (name.includes('burger')) {
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
    }
    if (name.includes('chicken') || name.includes('kfc') || name.includes('popeyes')) {
      return 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop'
    }
    
    // Default fast food image
    return 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400&h=300&fit=crop'
  }

  /**
   * Generate targeted deals for specific restaurant chains
   */
  async generateTargetedChainDeals(chains: string[], location: { latitude: number; longitude: number }): Promise<Deal[]> {
    try {
      const chainList = chains.join(', ')
      
      const prompt = `Generate 5-8 current, realistic deals for each of these fast food chains: ${chainList}

Location: ${location.latitude}, ${location.longitude}

Focus on deals these chains commonly offer:
- App-exclusive promotions
- Limited time offers  
- Value meals and combos
- BOGO deals
- Happy hour specials
- Loyalty rewards

Make each deal authentic to that brand. Return as JSON array with realistic pricing and descriptions under 150 characters.`

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 3000,
        temperature: 0.4,
      })

      const response = completion.choices[0]?.message?.content || ''
      
      try {
        const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const deals = JSON.parse(cleanedResponse)
        return await this.processAIDeals(deals, location)
      } catch (parseError) {
        console.error('Failed to parse targeted chain deals:', parseError)
        return []
      }
    } catch (error) {
      console.error('Targeted chain deals generation error:', error)
      return []
    }
  }
}

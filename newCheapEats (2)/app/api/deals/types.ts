export interface Deal {
  id: string
  restaurantName: string
  title: string
  description: string
  category: string
  originalPrice?: string
  dealPrice?: string
  discountPercent?: number
  savings?: string
  expirationDate?: string
  validFrom?: string
  sourceUrl?: string
  imageUrl?: string
  
  // Enhanced fields for better deal quality
  qualityScore: number // 0-100 score based on various factors
  dealType: 'percentage_off' | 'dollar_off' | 'bogo' | 'free_item' | 'combo_deal' | 'limited_time' | 'membership'
  restrictions?: string[]
  requiresApp?: boolean
  requiresMembership?: boolean
  minimumPurchase?: string
  maxRedemptions?: number
  
  // Location and availability
  latitude?: number
  longitude?: number
  address?: string
  zipCodes?: string[]
  radius?: number // miles
  availableLocations?: string[]
  
  // Verification and tracking
  verified: boolean
  lastVerified?: string
  reportedExpired?: boolean
  usageCount?: number
  successRate?: number // percentage of successful redemptions
  
  // Source metadata
  source: string
  sourceType: 'official_api' | 'restaurant_website' | 'deal_aggregator' | 'social_media' | 'user_submitted' | 'ai_generated'
  scrapedAt: string
  confidence: number // 0-100 confidence in deal accuracy
}

export interface DealSource {
  name: string
  type: 'official_api' | 'restaurant_website' | 'deal_aggregator' | 'social_media' | 'ai_generated'
  baseUrl: string
  enabled: boolean
  rateLimit: number // requests per minute
  lastFetch?: string
  successRate: number
}

export interface ScrapingResult {
  source: string
  deals: Deal[]
  success: boolean
  errorMessage?: string
  scrapedAt: string
  processingTime: number
}

export interface QualityMetrics {
  hasValidPricing: boolean
  hasExpirationDate: boolean
  isFromOfficialSource: boolean
  hasLocationData: boolean
  hasRestrictions: boolean
  descriptionQuality: number // 0-100
  titleQuality: number // 0-100
  overallScore: number // 0-100
}

export const RESTAURANT_CHAINS = [
  // Fast Food
  "McDonald's", "Burger King", "Taco Bell", "KFC", "Subway", "Pizza Hut", 
  "Wendy's", "Domino's", "Papa John's", "Little Caesars", "Chick-fil-A",
  "Sonic Drive-In", "Dairy Queen", "Arby's", "Jack in the Box", "Carl's Jr",
  "Hardee's", "White Castle", "Krystal", "Checkers", "Rally's",
  
  // Fast Casual
  "Chipotle", "Panera Bread", "Qdoba", "Moe's Southwest Grill", "Panda Express",
  "Five Guys", "Shake Shack", "In-N-Out Burger", "Culver's", "Whataburger",
  "Raising Cane's", "Zaxby's", "El Pollo Loco", "Popeyes", "Bojangles",
  
  // Coffee & Beverages
  "Starbucks", "Dunkin'", "Tim Hortons", "Caribou Coffee", "Peet's Coffee",
  "Einstein Bros. Bagels", "Panera Bread",
  
  // Pizza
  "Pizza Hut", "Domino's", "Papa John's", "Little Caesars", "Papa Murphy's",
  "Blaze Pizza", "MOD Pizza", "Godfather's Pizza", "Casey's",
  
  // Sandwiches & Subs
  "Subway", "Jimmy John's", "Firehouse Subs", "Jersey Mike's", "Potbelly",
  "Quiznos", "Which Wich", "Penn Station",
  
  // Casual Dining
  "Applebee's", "Chili's", "Olive Garden", "Red Lobster", "Outback Steakhouse",
  "TGI Friday's", "Buffalo Wild Wings", "Hooters", "Cracker Barrel", "IHOP",
  "Denny's", "Perkins", "Bob Evans",
  
  // Regional & Others
  "Sheetz", "Wawa", "QuikTrip", "Buc-ee's", "Royal Farms", "Speedway"
] as const

export const DEAL_CATEGORIES = {
  'Fast Food': ['burger', 'fries', 'chicken', 'sandwich', 'combo', 'meal'],
  'Pizza': ['pizza', 'breadsticks', 'wings', 'calzone', 'slice'],
  'Mexican': ['taco', 'burrito', 'quesadilla', 'nachos', 'bowl', 'salsa'],
  'Coffee': ['coffee', 'latte', 'cappuccino', 'espresso', 'frappuccino', 'tea'],
  'Sandwiches': ['sandwich', 'sub', 'hoagie', 'panini', 'wrap', 'bagel'],
  'Casual Dining': ['appetizer', 'entree', 'dessert', 'salad', 'soup', 'pasta'],
  'Desserts': ['ice cream', 'frozen yogurt', 'cake', 'cookie', 'donut', 'pastry'],
  'Asian': ['noodles', 'rice', 'stir fry', 'sushi', 'ramen', 'teriyaki'],
  'Breakfast': ['pancakes', 'waffles', 'eggs', 'bacon', 'sausage', 'hash browns']
} as const

export type RestaurantChain = typeof RESTAURANT_CHAINS[number]
export type DealCategory = keyof typeof DEAL_CATEGORIES

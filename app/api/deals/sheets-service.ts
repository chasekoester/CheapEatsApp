import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

export interface SheetDeal {
  id: string
  restaurantName: string
  title: string
  description: string
  originalPrice: string
  dealPrice: string
  discountPercent: number
  category: string
  expirationDate: string
  latitude: number
  longitude: number
  address: string
  distance?: number
  qualityScore: number
  verified: boolean
  source: string
  sourceUrl?: string
  dateAdded: string
  status: 'active' | 'inactive'
}

export class GoogleSheetsService {
  private doc: GoogleSpreadsheet | null = null
  private sheet: any = null

  constructor() {
    // Initialize with environment variables
    if (process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      this.initializeSheet()
    }
  }

  private async initializeSheet() {
    try {
      // Get and format the private key properly
      let privateKey = process.env.GOOGLE_PRIVATE_KEY
      if (privateKey) {
        // Replace escaped newlines with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n')

        // Ensure the key has proper BEGIN/END markers if missing
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
          privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`
        }
      }

      // Create JWT auth
      const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      })

      // Initialize the sheet
      this.doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID!, serviceAccountAuth)
      await this.doc.loadInfo()
      
      // Get or create the deals sheet
      this.sheet = this.doc.sheetsByIndex[0] || await this.doc.addSheet({
        title: 'Fast Food Deals',
        headerValues: [
          'id', 'restaurantName', 'title', 'description', 'originalPrice', 'dealPrice',
          'discountPercent', 'category', 'expirationDate', 'latitude', 'longitude',
          'address', 'qualityScore', 'verified', 'source', 'sourceUrl', 'dateAdded', 'status'
        ]
      })

      console.log('✅ Google Sheets initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets:', error)
      throw error
    }
  }

  async saveDeals(deals: SheetDeal[]): Promise<void> {
    if (!this.sheet) {
      console.warn('Google Sheets not initialized, skipping save')
      return
    }

    try {
      // Clear existing deals (optional - you might want to keep history)
      await this.sheet.clear()
      
      // Add headers
      await this.sheet.setHeaderRow([
        'id', 'restaurantName', 'title', 'description', 'originalPrice', 'dealPrice',
        'discountPercent', 'category', 'expirationDate', 'latitude', 'longitude',
        'address', 'qualityScore', 'verified', 'source', 'sourceUrl', 'dateAdded', 'status'
      ])

      // Add deals
      const rows = deals.map(deal => ({
        id: deal.id,
        restaurantName: deal.restaurantName,
        title: deal.title,
        description: deal.description,
        originalPrice: deal.originalPrice,
        dealPrice: deal.dealPrice,
        discountPercent: deal.discountPercent,
        category: deal.category,
        expirationDate: deal.expirationDate,
        latitude: deal.latitude,
        longitude: deal.longitude,
        address: deal.address,
        qualityScore: deal.qualityScore,
        verified: deal.verified,
        source: deal.source,
        sourceUrl: deal.sourceUrl || '',
        dateAdded: deal.dateAdded,
        status: deal.status
      }))

      await this.sheet.addRows(rows)
      console.log(`✅ Saved ${deals.length} deals to Google Sheets`)
    } catch (error) {
      console.error('❌ Failed to save deals to Google Sheets:', error)
      throw error
    }
  }

  async getActiveDeals(): Promise<SheetDeal[]> {
    // Force reinitialization if sheet is not available
    if (!this.sheet) {
      console.log('🔄 Google Sheets not initialized, forcing initialization...')
      await this.initializeSheet()
    }

    if (!this.sheet) {
      console.error('❌ Failed to initialize Google Sheets after retry')
      return []
    }

    try {
      console.log(`🔧 Reading from Sheet 1 (${this.sheet.title})...`)

      // Force reload the sheet info
      await this.doc!.loadInfo()
      this.sheet = this.doc!.sheetsByIndex[0] // Ensure we're reading from Sheet 1

      await this.sheet.loadHeaderRow()
      const rows = await this.sheet.getRows()

      console.log(`📊 Found ${rows.length} rows in spreadsheet`)

      if (rows.length === 0) {
        console.log(`⚠️ No rows found in Sheet 1!`)
        return []
      }

      // Get ALL deals from spreadsheet - no filtering by status
      const deals: SheetDeal[] = rows
        .filter((row: any) => {
          const title = row.get('title')
          const restaurant = row.get('restaurantName')
          return title && restaurant // Only require title and restaurant
        })
        .map((row: any) => ({
          id: row.get('id') || `sheet-${Date.now()}-${Math.random()}`,
          restaurantName: row.get('restaurantName'),
          title: row.get('title'),
          description: row.get('description') || '',
          originalPrice: row.get('originalPrice') || '',
          dealPrice: row.get('dealPrice') || '',
          discountPercent: parseInt(row.get('discountPercent')) || 0,
          category: row.get('category') || 'Fast Food',
          expirationDate: row.get('expirationDate') || '',
          latitude: parseFloat(row.get('latitude')) || 40.7128,
          longitude: parseFloat(row.get('longitude')) || -74.0060,
          address: row.get('address') || 'Near you',
          qualityScore: parseInt(row.get('qualityScore')) || 85,
          verified: true,
          source: row.get('source') || 'Spreadsheet',
          sourceUrl: row.get('sourceUrl') || '',
          dateAdded: row.get('dateAdded') || new Date().toISOString().split('T')[0],
          status: 'active' as const
        }))

      console.log(`✅ Successfully retrieved ${deals.length} deals from spreadsheet`)
      return deals
    } catch (error) {
      console.error('❌ Failed to read from Google Sheets:', error)
      return []
    }
  }

  async isConfigured(): Promise<boolean> {
    return !!(process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
  }

  // Helper method to calculate distance between user and deal
  calculateDistance(userLat: number, userLng: number, dealLat: number, dealLng: number): number {
    const R = 3959 // Radius of Earth in miles
    const dLat = this.toRadians(dealLat - userLat)
    const dLon = this.toRadians(dealLng - userLng)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(userLat)) * Math.cos(this.toRadians(dealLat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c * 10) / 10 // Round to 1 decimal place
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

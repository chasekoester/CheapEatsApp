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
      // Create JWT auth
      const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
    if (!this.sheet) {
      console.warn('Google Sheets not initialized, returning empty array')
      return []
    }

    try {
      await this.sheet.loadHeaderRow()
      const rows = await this.sheet.getRows()

      console.log(`📊 Total rows in spreadsheet: ${rows.length}`)

      // Debug: Check what status values we have
      if (rows.length > 0) {
        const statusValues = rows.slice(0, 5).map((row: any) => row.get('status'))
        console.log(`🔍 First 5 status values:`, statusValues)
      }

      const deals: SheetDeal[] = rows
        .filter((row: any) => {
          const status = row.get('status')
          const title = row.get('title')
          const restaurant = row.get('restaurantName')

          // Debug: log all rows to see what's actually there
          if (rows.indexOf(row) < 5) {
            console.log(`🔍 Row ${rows.indexOf(row)}: "${title}" at ${restaurant} (status: "${status}")`)
          }

          // For now, return ALL rows regardless of status to see everything
          return title && restaurant // Only filter out completely empty rows
        })
        .map((row: any) => ({
          id: row.get('id'),
          restaurantName: row.get('restaurantName'),
          title: row.get('title'),
          description: row.get('description'),
          originalPrice: row.get('originalPrice'),
          dealPrice: row.get('dealPrice'),
          discountPercent: parseInt(row.get('discountPercent')) || 0,
          category: row.get('category'),
          expirationDate: row.get('expirationDate'),
          latitude: parseFloat(row.get('latitude')) || 0,
          longitude: parseFloat(row.get('longitude')) || 0,
          address: row.get('address'),
          qualityScore: parseInt(row.get('qualityScore')) || 75,
          verified: row.get('verified') === 'true',
          source: row.get('source'),
          sourceUrl: row.get('sourceUrl') || undefined,
          dateAdded: row.get('dateAdded'),
          status: row.get('status') as 'active' | 'inactive'
        }))

      console.log(`✅ Retrieved ${deals.length} active deals from ${rows.length} total rows`)
      return deals
    } catch (error) {
      console.error('❌ Failed to get deals from Google Sheets:', error)
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

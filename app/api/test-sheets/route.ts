import { NextResponse } from 'next/server'
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'

export async function GET() {
  try {
    console.log('🔍 Testing Google Sheets configuration...')
    
    // Check environment variables
    const requiredEnvVars = {
      GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? '[SET]' : '[NOT SET]'
    }
    
    console.log('Environment variables:', requiredEnvVars)
    
    if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing required environment variables',
        config: requiredEnvVars
      })
    }
    
    // Test private key format
    let privateKey = process.env.GOOGLE_PRIVATE_KEY
    console.log('📋 Original private key length:', privateKey.length)
    console.log('📋 Private key starts with:', privateKey.substring(0, 50))
    
    // Clean and format the private key
    privateKey = privateKey.replace(/\\n/g, '\n')
    
    console.log('📋 After \\n replacement, starts with:', privateKey.substring(0, 50))
    
    // Test JWT creation
    try {
      const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      })
      
      console.log('✅ JWT object created successfully')
      
      // Test Google Sheets connection
      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth)
      
      console.log('📊 Attempting to load spreadsheet info...')
      await doc.loadInfo()
      
      console.log('✅ Successfully connected to Google Sheets!')
      console.log('📋 Spreadsheet title:', doc.title)
      console.log('📋 Number of sheets:', doc.sheetCount)
      
      // Get first sheet info
      const sheet = doc.sheetsByIndex[0]
      if (sheet) {
        console.log('📄 First sheet title:', sheet.title)
        console.log('📄 First sheet row count:', sheet.rowCount)
        console.log('📄 First sheet column count:', sheet.columnCount)
        
        // Try to load a few rows
        await sheet.loadHeaderRow()
        const rows = await sheet.getRows({ limit: 5 })
        console.log('📄 Found', rows.length, 'rows in the sheet')
        
        return NextResponse.json({
          success: true,
          message: 'Google Sheets connection successful!',
          info: {
            spreadsheetTitle: doc.title,
            sheetCount: doc.sheetCount,
            firstSheetTitle: sheet.title,
            firstSheetRows: sheet.rowCount,
            firstSheetColumns: sheet.columnCount,
            sampleRowCount: rows.length
          }
        })
      } else {
        return NextResponse.json({
          success: true,
          message: 'Connected to spreadsheet but no sheets found',
          info: {
            spreadsheetTitle: doc.title,
            sheetCount: doc.sheetCount
          }
        })
      }
      
    } catch (jwtError) {
      console.error('❌ JWT/Sheets error:', jwtError)
      return NextResponse.json({
        success: false,
        error: 'JWT authentication failed',
        details: jwtError instanceof Error ? jwtError.message : 'Unknown JWT error',
        config: requiredEnvVars
      })
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

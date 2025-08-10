'use client'

import React, { useEffect } from 'react'

export default function AutoDealGenerator() {
  useEffect(() => {
    // Run automatic deal generation check on app startup
    const checkAndGenerateDeals = async () => {
      try {
        console.log('🔄 Checking if deals need to be generated...')
        
        const response = await fetch('/api/deals/startup')
        const result = await response.json()
        
        console.log('📊 Deal generation status:', result)
        
        if (result.status === 'generation_complete') {
          console.log(`✅ ${result.newDeals} new deals generated successfully!`)
        } else if (result.status === 'deals_current') {
          console.log(`✅ ${result.todaysDeals} deals already available for today`)
        } else if (result.status === 'sheets_not_configured') {
          console.log('⚠️ Google Sheets not configured, using AI fallback')
        }
      } catch (error) {
        console.warn('⚠️ Auto deal generation check failed:', error)
        // Fail silently - users can still get AI-generated deals on demand
      }
    }

    // Run immediately when component mounts
    checkAndGenerateDeals()
    
    // Set up interval to check again later (every 4 hours)
    const interval = setInterval(checkAndGenerateDeals, 4 * 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  // This component renders nothing - it's just for background functionality
  return null
}

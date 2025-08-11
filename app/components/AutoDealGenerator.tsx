'use client'

import React, { useEffect } from 'react'

export default function AutoDealGenerator() {
  useEffect(() => {
    // Run automatic deal generation check on app startup
    const checkAndGenerateDeals = async () => {
      try {
        console.log('🔄 Checking if deals need to be generated...')

        // Add timeout and abort controller for better error handling
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch('/api/deals/startup', {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        console.log('📊 Deal generation status:', result)

        if (result.status === 'generation_complete') {
          console.log(`✅ ${result.newDeals} new deals generated successfully!`)
        } else if (result.status === 'deals_current') {
          console.log(`✅ ${result.todaysDeals} deals already available for today`)
        } else if (result.status === 'sheets_not_configured') {
          console.log('⚠️ Google Sheets not configured, using AI fallback')
        }
      } catch (error: any) {
        console.warn('⚠️ Auto deal generation check failed:', error.message || error)
        // Fail silently - users can still get AI-generated deals on demand
        // Don't throw or rethrow to prevent React error boundaries from catching
      }
    }

    // Delay initial check to avoid race conditions during app startup
    const initialTimeout = setTimeout(() => {
      checkAndGenerateDeals()
    }, 2000) // 2 second delay

    // Set up interval to check again later (every 4 hours)
    const interval = setInterval(checkAndGenerateDeals, 4 * 60 * 60 * 1000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [])

  // This component renders nothing - it's just for background functionality
  return null
}

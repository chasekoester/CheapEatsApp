'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import NextAuthErrorBoundary from '../components/NextAuthErrorBoundary'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Enhanced global error handler for NextAuth fetch errors
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      if (reason && (
        reason.message?.includes('Failed to fetch') ||
        reason.message?.includes('CLIENT_FETCH_ERROR') ||
        reason.toString().includes('Failed to fetch') ||
        reason.toString().includes('CLIENT_FETCH_ERROR') ||
        reason.name === 'TypeError' && reason.message?.includes('fetch')
      )) {
        console.log('NextAuth CLIENT_FETCH_ERROR suppressed:', reason.message || reason)
        event.preventDefault()
      }
    }

    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Failed to fetch') ||
          event.message?.includes('CLIENT_FETCH_ERROR')) {
        console.log('NextAuth error suppressed:', event.message)
        event.preventDefault()
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <NextAuthErrorBoundary>
      <SessionProvider
        basePath="/api/auth"
        refetchInterval={0}
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
      >
        {children}
      </SessionProvider>
    </NextAuthErrorBoundary>
  )
}

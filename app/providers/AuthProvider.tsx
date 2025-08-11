'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import NextAuthErrorBoundary from '../components/NextAuthErrorBoundary'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Add global error handler for NextAuth fetch errors
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Failed to fetch') ||
          event.reason?.toString()?.includes('CLIENT_FETCH_ERROR')) {
        console.log('NextAuth CLIENT_FETCH_ERROR handled globally:', event.reason)
        event.preventDefault() // Prevent the error from bubbling up
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <NextAuthErrorBoundary>
      <SessionProvider
        basePath="/api/auth"
        refetchInterval={0}
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
        session={null}
      >
        {children}
      </SessionProvider>
    </NextAuthErrorBoundary>
  )
}

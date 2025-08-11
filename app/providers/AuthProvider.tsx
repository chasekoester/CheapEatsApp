'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Simplified SessionProvider to debug CLIENT_FETCH_ERROR
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

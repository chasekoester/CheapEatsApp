'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={300}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}

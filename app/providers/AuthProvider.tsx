'use client'

import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Temporarily disabled NextAuth SessionProvider to fix CLIENT_FETCH_ERROR
  return <>{children}</>
}

'use client'

import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Temporarily disabled NextAuth to debug CLIENT_FETCH_ERROR
  return (
    <div>
      {children}
    </div>
  )
}

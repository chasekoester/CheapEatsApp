'use client'

import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

// Simple auth provider - no external dependencies, no fetch requests
export default function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>
}

'use client'

import { ReactNode, createContext, useContext } from 'react'

// Mock session context to replace NextAuth
const MockSessionContext = createContext({
  data: null,
  status: 'unauthenticated'
})

export const useMockSession = () => useContext(MockSessionContext)

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // No network requests, no fetch calls, no CLIENT_FETCH_ERROR
  return (
    <MockSessionContext.Provider value={{ data: null, status: 'unauthenticated' }}>
      {children}
    </MockSessionContext.Provider>
  )
}

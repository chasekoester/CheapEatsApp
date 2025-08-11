'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class NextAuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a NextAuth CLIENT_FETCH_ERROR
    if (error.message?.includes('Failed to fetch') || 
        error.toString().includes('CLIENT_FETCH_ERROR')) {
      console.log('NextAuth CLIENT_FETCH_ERROR caught and suppressed:', error)
      return { hasError: false } // Don't show error UI, just suppress it
    }
    
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (!error.message?.includes('Failed to fetch') && 
        !error.toString().includes('CLIENT_FETCH_ERROR')) {
      console.error('Non-NextAuth error caught:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>
    }

    return this.props.children
  }
}

export default NextAuthErrorBoundary

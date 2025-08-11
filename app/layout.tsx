import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import Navigation from './components/Navigation'
import AutoDealGenerator from './components/AutoDealGenerator'
import AuthProvider from './providers/AuthProvider'

export const metadata: Metadata = {
  title: 'CheapEats - AI-Powered Fast Food Deals',
  description: 'Find the best fast food deals near you with AI-powered discovery from 40+ restaurants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced debugging for CLIENT_FETCH_ERROR
              const originalFetch = window.fetch;
              window.fetch = function(...args) {
                console.log('NextAuth fetch request:', args[0], args[1]);
                return originalFetch.apply(this, args).catch(error => {
                  console.error('NextAuth fetch failed:', error, 'URL:', args[0]);
                  throw error;
                });
              };

              // Global error handler for fetch errors
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && (
                  event.reason.message?.includes('Failed to fetch') ||
                  event.reason.toString().includes('Failed to fetch') ||
                  event.reason.message?.includes('CLIENT_FETCH_ERROR')
                )) {
                  console.error('CLIENT_FETCH_ERROR details:', {
                    message: event.reason.message,
                    stack: event.reason.stack,
                    reason: event.reason
                  });
                  event.preventDefault();
                }
              });

              // Global error handler for script errors
              window.addEventListener('error', function(event) {
                if (event.message?.includes('Failed to fetch')) {
                  console.error('Script fetch error:', event);
                  event.preventDefault();
                }
              });
            `,
          }}
        />
        <AuthProvider>
          {/* <AutoDealGenerator /> Temporarily disabled to prevent CLIENT_FETCH_ERROR */}
          <Navigation />
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

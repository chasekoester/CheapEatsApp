import './globals.css'
import type { Metadata } from 'next'
import Navigation from './components/Navigation'
import AutoDealGenerator from './components/AutoDealGenerator'

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
        <AutoDealGenerator />
        <Navigation />
        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  )
}

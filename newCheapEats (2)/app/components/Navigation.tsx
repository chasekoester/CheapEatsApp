'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 2rem)',
        position: 'relative'
      }}>
        {/* Brand Name */}
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.01em'
          }}
        >
          CheapEats
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.75rem, 4vw, 2rem)'
        }}>
          <Link 
            href="/deals" 
            style={{
              textDecoration: 'none',
              fontSize: 'clamp(14px, 3vw, 16px)',
              fontWeight: '600',
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              position: 'relative',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            Deals
          </Link>
          
          
          <Link 
            href="/about" 
            style={{
              textDecoration: 'none',
              color: '#6b7280',
              fontSize: 'clamp(14px, 3vw, 16px)',
              fontWeight: '600',
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1f2937'
              e.currentTarget.style.background = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}

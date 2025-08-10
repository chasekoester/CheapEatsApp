'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div style={{
      padding: 'clamp(1rem, 4vw, 2rem)',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* Improved Back Button */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textDecoration: 'none',
          fontSize: 'clamp(0.9rem, 3vw, 1rem)',
          fontWeight: '600',
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          marginBottom: '2rem',
          border: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Home
      </Link>

      {/* Simple Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 3rem)',
          fontWeight: '800',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em'
        }}>
          About CheapEats
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 4vw, 1.2rem)',
          color: '#6b7280',
          lineHeight: '1.6',
          margin: '0 auto'
        }}>
          Find real fast food deals near you, instantly.
        </p>
      </div>

      {/* Simple Content Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* What We Do */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: 'clamp(1.5rem, 5vw, 2rem)',
          borderRadius: '20px',
          border: '1px solid rgba(229, 231, 235, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            🍔 What We Do
          </h2>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            fontSize: 'clamp(1rem, 3vw, 1.1rem)'
          }}>
            CheapEats finds verified fast food deals from McDonald's, Burger King, Taco Bell, and more.
            We show you real deals near your location so you can save money on great food.
          </p>
        </div>

        {/* How It Works */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: 'clamp(1.5rem, 5vw, 2rem)',
          borderRadius: '20px',
          border: '1px solid rgba(229, 231, 235, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            📍 How It Works
          </h2>
          <ol style={{
            color: '#6b7280',
            lineHeight: '1.8',
            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            paddingLeft: '1.5rem'
          }}>
            <li><strong>Share your location</strong> - We'll find deals nearby</li>
            <li><strong>Browse deals</strong> - See verified offers sorted by distance</li>
            <li><strong>Save money</strong> - Use deals at your favorite restaurants</li>
          </ol>
        </div>

        {/* Privacy */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: 'clamp(1.5rem, 5vw, 2rem)',
          borderRadius: '20px',
          border: '1px solid rgba(229, 231, 235, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            🔒 Your Privacy
          </h2>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            fontSize: 'clamp(1rem, 3vw, 1.1rem)'
          }}>
            We use your location only to calculate distances to restaurants.
            No tracking, no storing location data, no selling information to third parties.
          </p>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          padding: 'clamp(1.5rem, 5vw, 2rem)',
          borderRadius: '20px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#667eea'
          }}>
            Ready to Save Money?
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            lineHeight: '1.6'
          }}>
            Find fast food deals near you right now.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#1f2937',
              textDecoration: 'none',
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              fontWeight: '700',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.3)'
            }}
          >
            🍟 Find Deals Near Me
          </Link>
        </div>

      </div>
    </div>
  )
}

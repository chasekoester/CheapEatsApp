'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import NewsletterSignup from './components/NewsletterSignup'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLocationRequest = async () => {
    console.log('🔘 Find Fast Food Deals button clicked!')
    setIsLoading(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }))
        setIsLoading(false)
        router.push('/deals')
      },
      (error) => {
        setIsLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services and try again.')
            break
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setError('Location request timed out. Please try again.')
            break
          default:
            setError('An unknown error occurred while retrieving location.')
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section - Mobile First */}
      <div className="hero-section" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        padding: '2rem 1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.1
        }}></div>

        <div className="hero-content" style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            marginBottom: '2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            padding: '8px 20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: '#4ade80',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></span>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
              AI-Powered Fast Food Deals
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            color: 'white',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            Fast Food Deals
            <br />
            <span style={{
              background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Found Instantly
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.3rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '3rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            AI finds 50+ verified fast food deals near you instantly. McDonald's, Burger King, Taco Bell, and more.
          </p>

          <button
            onClick={handleLocationRequest}
            disabled={isLoading}
            style={{
              background: isLoading
                ? 'rgba(255, 255, 255, 0.3)'
                : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              border: 'none',
              borderRadius: '20px',
              padding: 'clamp(16px, 5vw, 20px) clamp(32px, 8vw, 48px)',
              color: isLoading ? 'rgba(255, 255, 255, 0.7)' : '#1f2937',
              fontSize: 'clamp(16px, 4vw, 18px)',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isLoading
                ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                : '0 12px 35px rgba(251, 191, 36, 0.4)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              margin: '0 auto',
              minWidth: '280px',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(251, 191, 36, 0.6)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(251, 191, 36, 0.4)'
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Finding Location...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Find Fast Food Deals
              </>
            )}
          </button>

          {error && (
            <div style={{
              marginTop: '2rem',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ 
                marginBottom: '0.5rem', 
                fontSize: '1.1rem',
                color: 'white',
                fontWeight: '600'
              }}>
                Location Access Required
              </h3>
              <p style={{ 
                marginBottom: '0', 
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.5'
              }}>
                {error}
              </p>
            </div>
          )}
        </div>
      </div>



      {/* How It Works Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1f2937',
            textAlign: 'center',
            letterSpacing: '-0.02em'
          }}>
            How It Works
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            textAlign: 'center'
          }}>
            Three simple steps to find and save on fast food
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(2rem, 6vw, 3rem)'
          }}>
            <div style={{
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: 'clamp(60px, 15vw, 80px)',
                height: 'clamp(60px, 15vw, 80px)',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: '600'
              }}>
                1
              </div>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1f2937'
              }}>
                Share Location
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontSize: 'clamp(0.95rem, 3vw, 1.1rem)'
              }}>
                Allow location access to find fast food deals within miles of you
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: 'clamp(60px, 15vw, 80px)',
                height: 'clamp(60px, 15vw, 80px)',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: '600'
              }}>
                2
              </div>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1f2937'
              }}>
                AI Finds Deals
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontSize: 'clamp(0.95rem, 3vw, 1.1rem)'
              }}>
                Our AI instantly generates 50+ current fast food deals and promotions
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: 'clamp(60px, 15vw, 80px)',
                height: 'clamp(60px, 15vw, 80px)',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: '600'
              }}>
                3
              </div>
              <h3 style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1f2937'
              }}>
                Navigate & Save
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontSize: 'clamp(0.95rem, 3vw, 1.1rem)'
              }}>
                Get directions to the nearest location and enjoy your savings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        padding: 'clamp(4rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)'
      }}>
        <NewsletterSignup />
      </div>

      {/* Stats Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: '600',
            marginBottom: '3rem',
            color: 'white'
          }}>
            AI-Powered Fast Food Deal Discovery
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(2rem, 6vw, 3rem)'
          }}>
            <div>
              <div style={{
                fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                fontWeight: '700',
                color: '#fbbf24',
                marginBottom: '0.5rem'
              }}>
                75+
              </div>
              <div style={{ 
                color: '#d1d5db', 
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                fontWeight: '600'
              }}>
                AI-Generated Deals
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                fontWeight: '700',
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                40+
              </div>
              <div style={{ 
                color: '#d1d5db', 
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                fontWeight: '600'
              }}>
                Fast Food Chains
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                fontWeight: '700',
                color: '#8b5cf6',
                marginBottom: '0.5rem'
              }}>
              &lt;10s
              </div>
              <div style={{ 
                color: '#d1d5db', 
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                fontWeight: '600'
              }}>
                Deal Discovery Time
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                fontWeight: '700',
                color: '#ef4444',
                marginBottom: '0.5rem'
              }}>
                30%
              </div>
              <div style={{ 
                color: '#d1d5db', 
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                fontWeight: '600'
              }}>
                Average Savings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

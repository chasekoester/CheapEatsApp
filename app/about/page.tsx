'use client'

import React from 'react'
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

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 3rem)',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#1f2937',
            letterSpacing: '-0.02em'
          }}>
            About CheapEats
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 4vw, 1.25rem)',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Find verified fast food deals near you and save money on great food.
          </p>
        </div>

        <div style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
          <section style={{ marginBottom: '4rem' }}>
            <div className="form-container" style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                margin: '0 auto 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ color: '#667eea', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '700' }}>
                Our Mission
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                CheapEats helps you discover verified restaurant deals in your area.
                We make it easy to find authentic savings from trusted restaurants.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{
              color: '#1f2937',
              marginBottom: '2rem',
              fontSize: '2.25rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              How CheapEats Works
            </h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              <div className="form-container" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                padding: '2rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '800'
                  }}>
                    1
                  </span>
                </div>
                <div>
                  <h3 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
                    Share Your Location
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.6' }}>
                    We use your location to find nearby restaurants and calculate distances.
                    Your privacy is protected - we don't store or track your location.
                  </p>
                </div>
              </div>

              <div className="form-container" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                padding: '2rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '800'
                  }}>
                    2
                  </span>
                </div>
                <div>
                  <h3 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
                    Browse Verified Deals
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.6' }}>
                    Explore curated deals sorted by distance. Every deal is verified for accuracy and value.
                    Search by restaurant or deal type to find what you want.
                  </p>
                </div>
              </div>

              <div className="form-container" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                padding: '2rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '800'
                  }}>
                    3
                  </span>
                </div>
                <div>
                  <h3 style={{ color: '#1f2937', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
                    Navigate & Save
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.6' }}>
                    Get directions through Google Maps. Present deal details to claim your savings
                    and enjoy quality food at great prices.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '4rem' }}>
            <div className="form-container" style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <h2 style={{ color: '#10b981', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '700' }}>
                Real Deals, Real Savings
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                <div>
                  <h4 style={{ color: '#1f2937', marginBottom: '1rem', fontSize: '1.25rem' }}>
                    Verified Deals
                  </h4>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    Every deal comes from official restaurant sources. We maintain high standards
                    to ensure authenticity and remove expired offers.
                  </p>
                </div>
                <div>
                  <h4 style={{ color: '#1f2937', marginBottom: '1rem', fontSize: '1.25rem' }}>
                    Always Fresh
                  </h4>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    Our system continuously updates deal information. New deals are added
                    as they become available.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="form-container" style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(240, 147, 251, 0.1) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              textAlign: 'center'
            }}>
              <h2 style={{ color: '#667eea', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '700' }}>
                Ready to Start Saving?
              </h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '2rem',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto 2rem'
              }}>
                Join thousands who are saving money with CheapEats.
                Find amazing deals near you right now.
              </p>
              <Link
                href="/"
                className="primary-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1f2937',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
                  border: 'none'
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
                Find Deals Near Me
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

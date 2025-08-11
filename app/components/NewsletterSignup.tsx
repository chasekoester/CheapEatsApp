'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function NewsletterSignup() {
  // Use static null session to prevent CLIENT_FETCH_ERROR
  const session = null
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || (session?.user?.name),
          action: 'subscribe'
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: '🎉 Successfully subscribed to newsletter!' })
        setEmail('')
        setName('')
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: 'clamp(2rem, 6vw, 3rem)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '1rem'
      }}>
        📧
      </div>

      <h2 style={{
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: '600',
        color: 'white',
        marginBottom: '1rem',
        letterSpacing: '-0.01em'
      }}>
        Never Miss a Deal!
      </h2>

      <p style={{
        fontSize: 'clamp(1rem, 3vw, 1.1rem)',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '2rem',
        lineHeight: '1.6',
        fontWeight: '500'
      }}>
        Get the hottest fast food deals delivered straight to your inbox. 
        Be the first to know about limited-time offers and exclusive discounts!
      </p>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {!session?.user && (
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
          />
        )}

        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          style={{
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.7 : 1
          }}
          onFocus={(e) => {
            if (!loading) {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            }
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            borderRadius: '16px',
            border: 'none',
            background: loading 
              ? 'rgba(255, 255, 255, 0.3)' 
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
            letterSpacing: '0.025em'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(16, 185, 129, 0.4)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)'
          }}
        >
          {loading ? 'Subscribing...' : '🚀 Subscribe Now'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          borderRadius: '12px',
          background: message.type === 'success' 
            ? 'rgba(16, 185, 129, 0.2)' 
            : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: 'white',
          fontSize: '0.95rem',
          fontWeight: '600'
        }}>
          {message.text}
        </div>
      )}

      <p style={{
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: '1.5rem',
        lineHeight: '1.5'
      }}>
        We respect your privacy. Unsubscribe at any time. No spam, just great deals! 🔒
      </p>
    </div>
  )
}

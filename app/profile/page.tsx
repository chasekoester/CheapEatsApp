'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserProfile {
  id: string
  email: string
  name: string
  image?: string
  createdAt: string
  favoriteDeals: string[]
  newsletterSubscribed: boolean
}

interface Deal {
  id: string
  title: string
  description: string
  originalPrice?: string
  dealPrice?: string
  discountPercent?: number
  restaurantName: string
  category: string
  expirationDate?: string
  imageUrl?: string
  sourceUrl?: string
  address?: string
  distance?: number
  qualityScore?: number
  verified: boolean
  source: string
  scrapedAt: string
  confidence: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [favoriteDealsData, setFavoriteDealsData] = useState<Deal[]>([])
  const [dealsLoading, setDealsLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (session?.user) {
      fetchProfile()
    }
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      // First create/update profile
      const createResponse = await fetch('/api/user/profile', {
        method: 'POST'
      })
      
      if (createResponse.ok) {
        const getResponse = await fetch('/api/user/profile')
        if (getResponse.ok) {
          const data = await getResponse.json()
          setProfile(data.profile)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleNewsletter = async () => {
    if (!session?.user?.email || !profile) return
    
    setNewsletterLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          action: profile.newsletterSubscribed ? 'unsubscribe' : 'subscribe'
        })
      })

      if (response.ok) {
        setProfile(prev => prev ? {
          ...prev,
          newsletterSubscribed: !prev.newsletterSubscribed
        } : null)
      }
    } catch (error) {
      console.error('Error updating newsletter subscription:', error)
    } finally {
      setNewsletterLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</div>
      </div>
    )
  }

  if (!session || !profile) {
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #f1f5f9'
        }}>
          {profile.image && (
            <img
              src={profile.image}
              alt={profile.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          )}
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#1f2937',
              margin: '0'
            }}>
              {profile.name}
            </h1>
            <p style={{
              color: '#6b7280',
              margin: '0.5rem 0 0 0'
            }}>
              {profile.email}
            </p>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.9rem',
              margin: '0.25rem 0 0 0'
            }}>
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Newsletter Section */}
        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 1rem 0'
          }}>
            Newsletter Subscription
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '1rem'
          }}>
            {profile.newsletterSubscribed 
              ? 'You\'re subscribed to our newsletter! You\'ll receive updates about new deals and features.'
              : 'Subscribe to our newsletter to get the latest deals delivered to your inbox.'
            }
          </p>
          <button
            onClick={toggleNewsletter}
            disabled={newsletterLoading}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: profile.newsletterSubscribed 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontWeight: '600',
              cursor: newsletterLoading ? 'not-allowed' : 'pointer',
              opacity: newsletterLoading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {newsletterLoading 
              ? 'Updating...' 
              : profile.newsletterSubscribed 
                ? 'Unsubscribe' 
                : 'Subscribe to Newsletter'
            }
          </button>
        </div>

        {/* Favorite Deals */}
        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 1rem 0'
          }}>
            Favorite Deals
          </h2>
          {profile.favoriteDeals.length > 0 ? (
            <p style={{ color: '#6b7280' }}>
              You have {profile.favoriteDeals.length} favorite deal{profile.favoriteDeals.length !== 1 ? 's' : ''}.
            </p>
          ) : (
            <p style={{ color: '#6b7280' }}>
              No favorite deals yet. Start browsing deals to save your favorites!
            </p>
          )}
          <Link
            href="/deals"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Browse Deals
          </Link>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'transparent',
            color: '#6b7280',
            textDecoration: 'none',
            fontWeight: '600',
            border: '2px solid #e5e7eb',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.color = '#1f2937'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

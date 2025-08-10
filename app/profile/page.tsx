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

          // Fetch favorite deals data if user has favorites
          if (data.profile?.favoriteDeals?.length > 0) {
            fetchFavoriteDealsData(data.profile.favoriteDeals)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavoriteDealsData = async (favoriteIds: string[]) => {
    if (favoriteIds.length === 0) return

    setDealsLoading(true)
    try {
      // Fetch all deals and filter by favorite IDs
      const response = await fetch('/api/deals?count=200')
      if (response.ok) {
        const data = await response.json()
        if (data.deals && Array.isArray(data.deals)) {
          const favoriteDeals = data.deals.filter((deal: Deal) => favoriteIds.includes(deal.id))
          setFavoriteDealsData(favoriteDeals)
        }
      }
    } catch (error) {
      console.error('Error fetching favorite deals data:', error)
    } finally {
      setDealsLoading(false)
    }
  }

  const removeFavorite = async (dealId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId,
          action: 'remove'
        })
      })

      if (response.ok) {
        setProfile(prev => prev ? {
          ...prev,
          favoriteDeals: prev.favoriteDeals.filter(id => id !== dealId)
        } : null)
        setFavoriteDealsData(prev => prev.filter(deal => deal.id !== dealId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0
    const cleanPrice = priceStr.replace(/[$,]/g, '')
    const parsed = parseFloat(cleanPrice)
    return isNaN(parsed) ? 0 : parsed
  }

  const calculateDiscountPercent = (originalPrice?: string, dealPrice?: string): number => {
    const original = parsePrice(originalPrice || '0')
    const deal = parsePrice(dealPrice || '0')

    if (deal === 0 && original > 0) return 100
    if (original <= 0) return 0

    const discount = Math.round(((original - deal) / original) * 100)
    return Math.max(0, Math.min(100, discount))
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
            Favorite Deals ({profile.favoriteDeals.length})
          </h2>

          {dealsLoading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              padding: '2rem 0'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #6b7280',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Loading your favorite deals...
            </div>
          ) : favoriteDealsData.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {favoriteDealsData.map((deal) => {
                const discountPercent = deal.discountPercent || calculateDiscountPercent(deal.originalPrice, deal.dealPrice)

                return (
                  <div
                    key={deal.id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFavorite(deal.id)}
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      💔
                    </button>

                    {/* Deal Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                      paddingRight: '2.5rem'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        {deal.restaurantName}
                      </div>
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#059669',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        {discountPercent}% OFF
                      </div>
                    </div>

                    {/* Deal Content */}
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      lineHeight: '1.3'
                    }}>
                      {deal.title}
                    </h3>

                    <p style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      marginBottom: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {deal.description}
                    </p>

                    {/* Price */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: '#10b981'
                      }}>
                        {parsePrice(deal.dealPrice || '0') === 0 ? 'FREE' : `$${parsePrice(deal.dealPrice || '0').toFixed(2)}`}
                      </div>
                      {parsePrice(deal.originalPrice || '0') > 0 && (
                        <div style={{
                          fontSize: '1rem',
                          color: '#9ca3af',
                          textDecoration: 'line-through'
                        }}>
                          ${parsePrice(deal.originalPrice || '0').toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: deal.sourceUrl ? '1fr 1fr' : '1fr',
                      gap: '0.75rem'
                    }}>
                      {deal.sourceUrl && (
                        <button
                          onClick={() => window.open(deal.sourceUrl, '_blank')}
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                          }}
                        >
                          🎯 View Deal
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(deal.restaurantName + ' near me')}`
                          window.open(mapsUrl, '_blank')
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0.75rem',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        🧭 Directions
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : profile.favoriteDeals.length > 0 ? (
            <p style={{ color: '#6b7280', padding: '2rem 0' }}>
              Your favorite deals are loading...
            </p>
          ) : (
            <p style={{ color: '#6b7280', padding: '2rem 0' }}>
              No favorite deals yet. Start browsing deals to save your favorites!
            </p>
          )}

          <Link
            href="/deals"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Browse More Deals
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

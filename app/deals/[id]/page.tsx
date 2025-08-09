'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Deal {
  id: string
  restaurantName: string
  title: string
  description: string
  latitude: number
  longitude: number
  expirationDate?: string
  address: string
  fullDescription?: string
  category: string
  originalPrice?: string
  dealPrice?: string
  terms?: string[]
  hours?: string
  phone?: string
}

const sampleDeals: Deal[] = [
  {
    id: '1',
    restaurantName: 'McDonald\'s',
    title: 'Buy One Get One Free Big Mac',
    description: 'Purchase any Big Mac and get a second one absolutely free. Valid on dine-in and takeout orders.',
    fullDescription: 'This amazing offer allows you to enjoy two of our signature Big Mac burgers for the price of one! The Big Mac features two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun. Perfect for sharing or treating yourself to a hearty meal.',
    latitude: 40.7589,
    longitude: -73.9851,
    expirationDate: '2024-02-15',
    address: '123 Broadway, New York, NY',
    category: 'Fast Food',
    originalPrice: '$12.98',
    dealPrice: '$6.49',
    terms: ['Valid for dine-in and takeout only', 'Cannot be combined with other offers', 'Valid at participating locations only', 'One offer per customer per visit'],
    hours: 'Mon-Sun: 6:00 AM - 11:00 PM',
    phone: '(212) 555-0123'
  },
  {
    id: '2',
    restaurantName: 'Burger King',
    title: '2 Whoppers for $10',
    description: 'Get two flame-grilled Whopper burgers for just $10. Limited time offer.',
    fullDescription: 'Experience the flame-grilled taste with our classic Whopper burgers! Each Whopper features a ¼ lb* of flame-grilled beef topped with tomatoes, lettuce, mayo, ketchup, pickles, and onions on a sesame seed bun. This special deal gives you two Whoppers for an incredible value.',
    latitude: 40.7614,
    longitude: -73.9776,
    address: '456 5th Avenue, New York, NY',
    category: 'Fast Food',
    originalPrice: '$15.98',
    dealPrice: '$10.00',
    terms: ['*Weight before cooking', 'Available for a limited time only', 'Valid at participating restaurants', 'No substitutions'],
    hours: 'Mon-Sun: 7:00 AM - 12:00 AM',
    phone: '(212) 555-0456'
  },
  {
    id: '3',
    restaurantName: 'Taco Bell',
    title: 'Free Crunchy Taco with Purchase',
    description: 'Get a free Crunchy Taco Supreme with any purchase over $5.',
    fullDescription: 'Enjoy a free Crunchy Taco Supreme with any purchase over $5! Our Crunchy Taco Supreme features seasoned beef, lettuce, tomatoes, sour cream, and cheese in a crunchy taco shell. This offer is perfect for adding something extra to your meal.',
    latitude: 40.7505,
    longitude: -73.9934,
    expirationDate: '2024-01-31',
    address: '789 Times Square, New York, NY',
    category: 'Mexican',
    dealPrice: 'Free with $5+ purchase',
    terms: ['Valid on any purchase over $5 before tax', 'Limit one free taco per customer per visit', 'Cannot be combined with other offers'],
    hours: 'Mon-Thu: 8:00 AM - 2:00 AM, Fri-Sat: 8:00 AM - 3:00 AM, Sun: 8:00 AM - 1:00 AM',
    phone: '(212) 555-0789'
  },
  {
    id: '4',
    restaurantName: 'KFC',
    title: '$5 Fill Up Box',
    description: 'Chicken tenders, mashed potatoes, biscuit, cookie, and drink for just $5.',
    fullDescription: 'Get everything you need for a complete meal with our $5 Fill Up Box! This incredible value includes crispy chicken tenders made with our signature blend of herbs and spices, creamy mashed potatoes with gravy, a warm buttermilk biscuit, a freshly baked cookie, and your choice of drink.',
    latitude: 40.7549,
    longitude: -73.9840,
    address: '321 Park Avenue, New York, NY',
    category: 'Fast Food',
    originalPrice: '$8.99',
    dealPrice: '$5.00',
    terms: ['Includes 2-3 chicken tenders', 'Choice of regular drink', 'Available all day', 'While supplies last'],
    hours: 'Mon-Sun: 10:30 AM - 10:00 PM',
    phone: '(212) 555-0321'
  },
  {
    id: '5',
    restaurantName: 'Subway',
    title: 'Buy One Footlong, Get One 50% Off',
    description: 'Mix and match any two footlong subs. Second sub is 50% off.',
    fullDescription: 'Mix and match any two footlong subs and save! Choose from all your favorite Subway footlong sandwiches including Turkey Breast, Italian B.M.T., Meatball Marinara, and many more. The second footlong is 50% off the regular price. Perfect for sharing with a friend, family member, or saving one for later.',
    latitude: 40.7580,
    longitude: -73.9855,
    expirationDate: '2024-02-29',
    address: '654 Madison Avenue, New York, NY',
    category: 'Sandwiches',
    dealPrice: '50% off second sub',
    terms: ['Valid on footlong subs only', 'Cannot be combined with other offers', 'Second sub must be of equal or lesser value'],
    hours: 'Mon-Fri: 7:00 AM - 10:00 PM, Sat-Sun: 8:00 AM - 9:00 PM',
    phone: '(212) 555-0654'
  },
  {
    id: '6',
    restaurantName: 'Pizza Hut',
    title: 'Large 3-Topping Pizza $12.99',
    description: 'Any large pizza with up to 3 toppings for $12.99. Carry-out only.',
    fullDescription: 'Create your perfect large pizza with up to 3 toppings for just $12.99! Choose from our wide selection of fresh toppings including pepperoni, sausage, mushrooms, peppers, onions, and many more. Our hand-tossed dough is made fresh daily and topped with our signature sauce and 100% real cheese.',
    latitude: 40.7614,
    longitude: -73.9738,
    address: '987 Lexington Avenue, New York, NY',
    category: 'Pizza',
    originalPrice: '$18.99',
    dealPrice: '$12.99',
    terms: ['Carry-out only', 'Additional toppings available for extra charge', 'Hand-tossed crust only', 'Limited time offer'],
    hours: 'Mon-Thu: 11:00 AM - 11:00 PM, Fri-Sat: 11:00 AM - 12:00 AM, Sun: 11:00 AM - 10:00 PM',
    phone: '(212) 555-0987'
  }
]

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const [deal, setDeal] = useState<(Deal & { distance: number }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation')
    if (storedLocation) {
      const location = JSON.parse(storedLocation)
      setUserLocation(location)
      
      const foundDeal = sampleDeals.find(d => d.id === params.id)
      if (foundDeal) {
        const dealWithDistance = {
          ...foundDeal,
          distance: calculateDistance(location.latitude, location.longitude, foundDeal.latitude, foundDeal.longitude)
        }
        setDeal(dealWithDistance)
      }
    }
    setLoading(false)
  }, [params.id])

  const handleGetDirections = () => {
    if (deal) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(deal.address)}`
      window.open(googleMapsUrl, '_blank')
    }
  }

  const handleCall = () => {
    if (deal?.phone) {
      window.location.href = `tel:${deal.phone}`
    }
  }

  if (loading) {
    return (
      <div className="loading animate-pulse">
        <h2>Loading deal details...</h2>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="error">
        <h2 style={{ marginBottom: '1rem' }}>Deal Not Found</h2>
        <p style={{ marginBottom: '2rem' }}>The deal you're looking for doesn't exist or may have expired.</p>
        <Link href="/deals" className="primary-btn">
          Back to Deals
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          href="/deals" 
          style={{ 
            color: 'var(--primary-600)', 
            textDecoration: 'none', 
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary-700)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--primary-600)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Deals
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="form-container" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <span style={{
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '1rem',
                display: 'inline-block'
              }}>
                {deal.category}
              </span>
              <div className="restaurant-name" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
                {deal.restaurantName}
              </div>
            </div>
            
            {deal.distance && (
              <div style={{ 
                textAlign: 'right',
                padding: '1rem',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-600)' }}>
                  {deal.distance.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
                  miles away
                </div>
              </div>
            )}
          </div>
          
          <div className="deal-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>
            {deal.title}
          </div>

          {(deal.originalPrice || deal.dealPrice) && (
            <div style={{ 
              margin: '1.5rem 0',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, var(--success)/10 0%, var(--success)/5 100%)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--success)/20'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--success)', fontSize: '1.1rem' }}>Deal Price</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {deal.originalPrice && (
                  <span style={{ 
                    color: 'var(--gray-400)',
                    textDecoration: 'line-through',
                    fontSize: '1.1rem'
                  }}>
                    {deal.originalPrice}
                  </span>
                )}
                <span style={{ 
                  color: 'var(--success)',
                  fontWeight: '800',
                  fontSize: '1.5rem'
                }}>
                  {deal.dealPrice}
                </span>
                {deal.originalPrice && deal.dealPrice && (
                  <span style={{
                    background: 'var(--success)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    Save {((parseFloat(deal.originalPrice.replace('$', '')) - parseFloat(deal.dealPrice.replace('$', ''))) / parseFloat(deal.originalPrice.replace('$', '')) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          )}

          {deal.expirationDate && (
            <div style={{ 
              marginBottom: '2rem',
              padding: '1rem',
              background: 'var(--warning)/10',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--warning)/30'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="var(--warning)" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: 'var(--warning)', fontWeight: '600' }}>
                  Expires: {new Date(deal.expirationDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.25rem' }}>Deal Description</h3>
            <p style={{ color: 'var(--gray-600)', lineHeight: '1.7', fontSize: '1rem' }}>
              {deal.fullDescription || deal.description}
            </p>
          </div>

          {deal.terms && deal.terms.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.25rem' }}>Terms & Conditions</h3>
              <ul style={{ 
                color: 'var(--gray-600)', 
                lineHeight: '1.6',
                paddingLeft: '1.5rem',
                listStyleType: 'disc'
              }}>
                {deal.terms.map((term, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{term}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
            padding: '2rem',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--gray-200)'
          }}>
            <div>
              <h3 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.1rem' }}>Location</h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>{deal.address}</p>
              {deal.phone && (
                <p style={{ color: 'var(--gray-600)' }}>{deal.phone}</p>
              )}
            </div>
            {deal.hours && (
              <div>
                <h3 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.1rem' }}>Hours</h3>
                <p style={{ color: 'var(--gray-600)' }}>{deal.hours}</p>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center' }}>
            <button 
              className="primary-btn"
              onClick={handleGetDirections}
              style={{ margin: 0 }}
            >
              Get Directions
            </button>
            {deal.phone && (
              <button 
                className="secondary-btn"
                onClick={handleCall}
                style={{ 
                  margin: 0,
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Call
              </button>
            )}
            <Link 
              href="/deals"
              style={{
                padding: '1rem',
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                color: 'var(--gray-600)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--gray-200)'
                e.currentTarget.style.color = 'var(--gray-700)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--gray-100)'
                e.currentTarget.style.color = 'var(--gray-600)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h18v18H3zM9 9h6v6H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

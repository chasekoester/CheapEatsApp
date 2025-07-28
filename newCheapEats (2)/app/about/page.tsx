'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          href="/" 
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
          Back to Home
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            marginBottom: '1.5rem', 
            color: 'var(--gray-900)',
            letterSpacing: '-0.02em'
          }}>
            About CheapEats
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--gray-600)', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Connecting food lovers with authentic deals from real restaurants, 
            helping communities save money on delicious meals.
          </p>
        </div>

        <div style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
          <section style={{ marginBottom: '4rem' }}>
            <div className="form-container" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%)',
                borderRadius: 'var(--radius-2xl)',
                margin: '0 auto 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ color: 'var(--primary-600)', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '700' }}>
                Our Mission
              </h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                CheapEats democratizes access to food savings by providing a comprehensive platform 
                where anyone can discover verified restaurant deals in their immediate area.
              </p>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
                We believe great food shouldn't break the bank. By leveraging technology and community 
                collaboration, we make it effortless to find authentic savings from trusted restaurants.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ 
              color: 'var(--gray-900)', 
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
                padding: '2.5rem'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)', 
                  borderRadius: 'var(--radius-2xl)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontSize: '2rem', 
                    fontWeight: '800'
                  }}>
                    1
                  </span>
                </div>
                <div>
                  <h3 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
                    Share Your Location
                  </h3>
                  <p style={{ color: 'var(--gray-600)', margin: 0, lineHeight: '1.6' }}>
                    Enable location services with confidence. Your location data is processed locally and used exclusively 
                    to calculate distances to nearby restaurants. We never store, track, or share your location information 
                    with third parties.
                  </p>
                </div>
              </div>

              <div className="form-container" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2rem',
                padding: '2.5rem'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  background: 'linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%)', 
                  borderRadius: 'var(--radius-2xl)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontSize: '2rem', 
                    fontWeight: '800'
                  }}>
                    2
                  </span>
                </div>
                <div>
                  <h3 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
                    Browse Verified Deals
                  </h3>
                  <p style={{ color: 'var(--gray-600)', margin: 0, lineHeight: '1.6' }}>
                    Explore our curated collection of restaurant deals, automatically sorted by proximity to your location. 
                    Every deal undergoes verification to ensure accuracy, validity, and value. Filter by cuisine type, 
                    restaurant name, or deal specifics to find exactly what you're craving.
                  </p>
                </div>
              </div>

              <div className="form-container" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2rem',
                padding: '2.5rem'
              }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)', 
                  borderRadius: 'var(--radius-2xl)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontSize: '2rem', 
                    fontWeight: '800'
                  }}>
                    3
                  </span>
                </div>
                <div>
                  <h3 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
                    Navigate & Save
                  </h3>
                  <p style={{ color: 'var(--gray-600)', margin: 0, lineHeight: '1.6' }}>
                    Get turn-by-turn directions through Google Maps integration. Contact restaurants directly when needed. 
                    Present deal details to claim your savings and enjoy quality food at exceptional prices. 
                    It's that simple.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '4rem' }}>
            <div className="form-container" style={{ 
              background: 'linear-gradient(135deg, var(--success)/10 0%, var(--accent)/10 100%)',
              border: '1px solid var(--success)/20'
            }}>
              <h2 style={{ color: 'var(--success)', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '700' }}>
                Authentic Data, Real Savings
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                <div>
                  <h4 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.25rem' }}>
                    No Fake Deals
                  </h4>
                  <p style={{ color: 'var(--gray-600)', lineHeight: '1.6' }}>
                    Every deal on CheapEats is sourced from official restaurant websites, mobile applications, 
                    and verified promotional materials. We maintain rigorous standards to ensure authenticity.
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--gray-900)', marginBottom: '1rem', fontSize: '1.25rem' }}>
                    Continuous Updates
                  </h4>
                  <p style={{ color: 'var(--gray-600)', lineHeight: '1.6' }}>
                    Our automated systems continuously monitor and update deal information. Expired offers are 
                    promptly removed, and new deals are added as they become available.
                  </p>
                </div>
              </div>
              <div style={{ 
                padding: '1.5rem',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--success)/20'
              }}>
                <p style={{ color: 'var(--success)', margin: 0, fontWeight: '600', textAlign: 'center' }}>
                  Found an invalid deal? Let us know and we'll update our database immediately.
                </p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ 
              color: 'var(--gray-900)', 
              marginBottom: '2rem', 
              fontSize: '2.25rem', 
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Privacy & Security
            </h2>
            <div className="form-container">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '2rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '60px',
                    height: '60px',
                    background: 'var(--accent-100)',
                    borderRadius: 'var(--radius-xl)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--accent-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Local Processing</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                    Location calculations happen on your device, not our servers
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '60px',
                    height: '60px',
                    background: 'var(--primary-100)',
                    borderRadius: 'var(--radius-xl)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="var(--primary-600)" strokeWidth="2"/>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="var(--primary-600)" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h4 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>No Tracking</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                    We don't track your movement or store location history
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '60px',
                    height: '60px',
                    background: 'var(--secondary-100)',
                    borderRadius: 'var(--radius-xl)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="var(--secondary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>Full Control</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                    Revoke location access anytime through browser settings
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '4rem' }}>
            <div className="form-container" style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'var(--gray-900)', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '700' }}>
                Community Driven
              </h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                While our automated systems handle the majority of deal discovery and verification, 
                we rely on our community to help identify new opportunities and keep our database comprehensive.
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                <div style={{ 
                  padding: '1.5rem',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-600)', marginBottom: '0.5rem' }}>
                    5,000+
                  </div>
                  <div style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Community Submissions</div>
                </div>
                <div style={{ 
                  padding: '1.5rem',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary-600)', marginBottom: '0.5rem' }}>
                    98%
                  </div>
                  <div style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Accuracy Rate</div>
                </div>
                <div style={{ 
                  padding: '1.5rem',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-600)', marginBottom: '0.5rem' }}>
                    24h
                  </div>
                  <div style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>Review Time</div>
                </div>
              </div>
              <Link 
                href="/submit" 
                className="primary-btn"
                style={{ fontSize: '1.1rem' }}
              >
                Contribute a Deal
              </Link>
            </div>
          </section>

          <section>
            <div className="form-container" style={{ 
              background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%)',
              border: '1px solid var(--primary-200)',
              textAlign: 'center'
            }}>
              <h2 style={{ color: 'var(--primary-700)', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: '700' }}>
                Ready to Start Saving?
              </h2>
              <p style={{ 
                color: 'var(--primary-600)', 
                marginBottom: '2rem',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto 2rem'
              }}>
                Join thousands of food lovers who are already saving money with CheapEats. 
                Enable location services and discover amazing deals near you right now.
              </p>
              <Link 
                href="/" 
                className="primary-btn"
                style={{ fontSize: '1.1rem' }}
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

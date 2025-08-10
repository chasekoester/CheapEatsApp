import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { userService } from '../user/user-service'

export async function POST(request: NextRequest) {
  try {
    const { email, name, action } = await request.json()
    
    if (!email || !action) {
      return NextResponse.json({ error: 'Email and action required' }, { status: 400 })
    }
    
    let success = false
    if (action === 'subscribe') {
      success = await userService.subscribeToNewsletter(email, name)
    } else if (action === 'unsubscribe') {
      success = await userService.unsubscribeFromNewsletter(email)
    }
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update newsletter subscription' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating newsletter subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    // Only allow authenticated users to view subscribers
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const subscribers = await userService.getNewsletterSubscribers()
    
    return NextResponse.json({ 
      subscribers: subscribers.map(sub => ({
        email: sub.email,
        name: sub.name,
        subscribedAt: sub.subscribedAt
      }))
    })
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

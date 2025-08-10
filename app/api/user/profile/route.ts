import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { userService } from '../user-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const profile = await userService.getUserProfile(session.user.id!)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const profile = await userService.createOrUpdateUser({
      id: session.user.id!,
      email: session.user.email,
      name: session.user.name || '',
      image: session.user.image
    })
    
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error creating/updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

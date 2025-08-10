import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { userService } from '../user-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { dealId, action } = await request.json()
    
    if (!dealId || !action) {
      return NextResponse.json({ error: 'dealId and action required' }, { status: 400 })
    }
    
    let success = false
    if (action === 'add') {
      success = await userService.addFavoriteDeal((session.user as any).id!, dealId)
    } else if (action === 'remove') {
      success = await userService.removeFavoriteDeal((session.user as any).id!, dealId)
    }
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update favorites' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating favorites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

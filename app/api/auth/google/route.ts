import { NextResponse } from 'next/server'

export async function GET() {
  // Simple Google OAuth redirect - no complex session management
  const googleAuthUrl = `https://accounts.google.com/oauth2/authorize?${new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  })}`

  return NextResponse.redirect(googleAuthUrl)
}

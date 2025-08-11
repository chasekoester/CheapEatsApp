import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(new URL('/?error=oauth_error', url.origin))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', url.origin))
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`
      })
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      throw new Error('No access token received')
    }

    // Get user info
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`)
    const user = await userResponse.json()

    console.log('User authenticated:', user.email)

    // Redirect to success page - no complex session storage
    return NextResponse.redirect(new URL('/?auth=success', url.origin))
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/?error=callback_error', url.origin))
  }
}

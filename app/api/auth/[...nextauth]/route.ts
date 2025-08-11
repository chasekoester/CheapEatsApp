import { NextResponse } from 'next/server'

// Enhanced mock NextAuth implementation that fully complies with NextAuth expectations
export async function GET(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Add proper CORS and NextAuth headers
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
  }

  // Handle /api/auth/session
  if (pathname.includes('/session')) {
    return NextResponse.json({}, { headers })
  }

  // Handle /api/auth/providers
  if (pathname.includes('/providers')) {
    return NextResponse.json({}, { headers })
  }

  // Handle /api/auth/csrf
  if (pathname.includes('/csrf')) {
    return NextResponse.json({
      csrfToken: 'mock-csrf-token-' + Date.now()
    }, { headers })
  }

  // Handle /api/auth/callback/*
  if (pathname.includes('/callback')) {
    return NextResponse.redirect(new URL('/', url.origin))
  }

  // Handle /api/auth/signin/*
  if (pathname.includes('/signin')) {
    return NextResponse.json({
      url: url.origin + '/api/auth/signin',
      error: null
    }, { headers })
  }

  // Default response for any other NextAuth endpoint
  return NextResponse.json({
    message: 'NextAuth mock endpoint',
    url: pathname
  }, { headers })
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
  }

  // Handle POST requests (signIn, signOut, etc.)
  if (pathname.includes('/signin') || pathname.includes('/signout')) {
    return NextResponse.json({
      url: url.origin,
      ok: true
    }, { headers })
  }

  return NextResponse.json({
    message: 'NextAuth POST mock endpoint',
    ok: true
  }, { headers })
}

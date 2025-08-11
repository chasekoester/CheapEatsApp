import { NextResponse } from 'next/server'

// Mock NextAuth implementation to prevent CLIENT_FETCH_ERROR
export async function GET(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  // Handle /api/auth/session
  if (pathname.includes('/session')) {
    return NextResponse.json({}, { headers })
  }

  // Handle /api/auth/providers
  if (pathname.includes('/providers')) {
    return NextResponse.json({
      google: {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        signinUrl: `${url.origin}/api/auth/signin/google`,
        callbackUrl: `${url.origin}/api/auth/callback/google`
      }
    }, { headers })
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

  // Default response
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
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

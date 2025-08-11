import { NextResponse } from 'next/server'

// Mock NextAuth responses to prevent CLIENT_FETCH_ERROR
export async function GET(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Handle different NextAuth endpoints
  if (pathname.includes('/session')) {
    return NextResponse.json({})
  }

  if (pathname.includes('/providers')) {
    return NextResponse.json({})
  }

  if (pathname.includes('/csrf')) {
    return NextResponse.json({ csrfToken: 'mock-csrf-token' })
  }

  return NextResponse.json({ message: 'NextAuth endpoint' })
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'NextAuth POST endpoint' })
}

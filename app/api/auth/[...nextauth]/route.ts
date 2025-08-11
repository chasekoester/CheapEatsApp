import { NextResponse } from 'next/server'

// Temporarily disabled NextAuth to debug CLIENT_FETCH_ERROR
export async function GET() {
  return NextResponse.json({ message: 'NextAuth temporarily disabled' })
}

export async function POST() {
  return NextResponse.json({ message: 'NextAuth temporarily disabled' })
}

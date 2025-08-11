import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-client-secret',
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key-change-in-production',
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }

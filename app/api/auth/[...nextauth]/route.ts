import NextAuth from 'next-auth'

const handler = NextAuth({
  providers: [],
  secret: 'development-secret-key',
})

export { handler as GET, handler as POST }

import NextAuth from "next-auth"

export const runtime = 'nodejs'

const handler = NextAuth({
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || "development-secret",
  session: {
    strategy: "jwt",
  },
  pages: {
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
})

export { handler as GET, handler as POST }

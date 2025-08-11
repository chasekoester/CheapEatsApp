import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || "development-secret",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

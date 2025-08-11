import NextAuth from "next-auth"

const handler = NextAuth({
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production",
  callbacks: {
    async session({ session }) {
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
})

export { handler as GET, handler as POST }

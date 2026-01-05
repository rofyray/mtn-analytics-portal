import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Email and OTP are required")
        }

        // Find the OTP record
        const otpRecord = await prisma.oTP.findFirst({
          where: {
            email: credentials.email.toLowerCase(),
            code: credentials.otp,
          },
        })

        if (!otpRecord) {
          throw new Error("Invalid OTP")
        }

        // Check if OTP is expired (5 minutes)
        if (new Date() > otpRecord.expiresAt) {
          // Delete expired OTP
          await prisma.oTP.delete({ where: { id: otpRecord.id } })
          throw new Error("OTP has expired")
        }

        // Verify the user is an admin
        const admin = await prisma.admin.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
            active: true,
          },
        })

        if (!admin) {
          throw new Error("Not authorized")
        }

        // Delete the OTP (one-time use)
        await prisma.oTP.delete({ where: { id: otpRecord.id } })

        // Return user data
        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}

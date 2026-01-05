import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateOTP, sendOTPEmail } from "@/lib/email"
import { z } from "zod"

const requestSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = requestSchema.parse(body)

    const normalizedEmail = email.toLowerCase()

    // Verify the email belongs to an active admin
    const admin = await prisma.admin.findUnique({
      where: {
        email: normalizedEmail,
        active: true,
      },
    })

    if (!admin) {
      return NextResponse.json(
        { error: "Email not authorized" },
        { status: 403 }
      )
    }

    // Delete any existing OTPs for this email
    await prisma.oTP.deleteMany({
      where: { email: normalizedEmail },
    })

    // Generate new OTP
    const otp = generateOTP()

    // Calculate expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Store OTP in database
    await prisma.oTP.create({
      data: {
        email: normalizedEmail,
        code: otp,
        expiresAt,
      },
    })

    // Send OTP via email
    await sendOTPEmail(normalizedEmail, otp)

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error in request-otp:", error)
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    )
  }
}

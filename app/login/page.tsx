"use client"

import { Suspense, useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSelector } from "@/components/admin-selector"
import { OTPInput } from "@/components/otp-input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

// Read admins from config
import adminsData from "@/config/admins.json"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard"

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isRequestingOtp, setIsRequestingOtp] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Theme management for logo
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRequestOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsRequestingOtp(true)

    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to send OTP")
        return
      }

      toast.success("OTP sent to your email!")
      setOtpSent(true)
      setOtp("")
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.")
      console.error(error)
    } finally {
      setIsRequestingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP")
      return
    }

    setIsVerifying(true)

    try {
      const result = await signIn("otp", {
        email,
        otp,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
        setOtp("")
        return
      }

      if (result?.ok) {
        toast.success("Login successful!")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast.error("Login failed. Please try again.")
      console.error(error)
      setOtp("")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleChangeEmail = () => {
    setOtpSent(false)
    setOtp("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 via-background to-background p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Login Card */}
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/MTN-Logo.png"
                alt="MTN Logo"
                className="h-12 w-auto"
                style={{
                  filter: mounted && resolvedTheme === 'dark' ? 'invert(1)' : 'invert(0)'
                }}
              />
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin email to receive a one-time password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!otpSent ? (
              <>
                {/* Email Selection */}
                <AdminSelector
                  admins={adminsData}
                  selectedEmail={email}
                  onEmailChange={setEmail}
                  disabled={isRequestingOtp}
                />

                {/* Request OTP Button */}
                <Button
                  onClick={handleRequestOtp}
                  disabled={isRequestingOtp || !email}
                  className="w-full"
                >
                  {isRequestingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Request OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="space-y-2">
                  <div className="text-center">
                    <p className="text-sm font-medium">Enter OTP sent to</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>

                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    disabled={isVerifying}
                  />

                  <p className="text-xs text-center text-muted-foreground">
                    OTP is valid for 5 minutes
                  </p>
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                {/* Change Email */}
                <Button
                  variant="ghost"
                  onClick={handleChangeEmail}
                  disabled={isVerifying}
                  className="w-full"
                >
                  Change Email
                </Button>
              </>
            )}

            {/* Help Text */}
            <p className="text-xs text-center text-muted-foreground mt-4">
              Only authorized administrators can access this portal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 via-background to-background p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

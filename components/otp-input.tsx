"use client"

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}: OTPInputProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const otp = value.split("")

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

    // Only allow numbers
    if (digit && !/^\d$/.test(digit)) return

    const newOtp = [...otp]
    newOtp[index] = digit

    onChange(newOtp.join(""))

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus()
        setActiveIndex(index - 1)
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setActiveIndex(index - 1)
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const pastedData = e.clipboardData.getData("text/plain").slice(0, length)
    if (!/^\d+$/.test(pastedData)) return

    onChange(pastedData.padEnd(length, ""))

    // Focus last filled input or last input
    const focusIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
    setActiveIndex(focusIndex)
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          disabled={disabled}
          className={cn(
            "h-12 w-12 text-center text-lg font-semibold",
            "focus-visible:ring-2 focus-visible:ring-ring",
            disabled && "cursor-not-allowed opacity-50"
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}

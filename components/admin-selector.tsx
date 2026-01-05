"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Admin {
  id: string
  name: string
  email: string
}

interface AdminSelectorProps {
  admins: Admin[]
  selectedEmail: string
  onEmailChange: (email: string) => void
  disabled?: boolean
}

export function AdminSelector({
  admins,
  selectedEmail,
  onEmailChange,
  disabled = false,
}: AdminSelectorProps) {
  const [selectedAdminId, setSelectedAdminId] = useState<string>("")
  const [isManualEmail, setIsManualEmail] = useState(false)

  useEffect(() => {
    // Check if current email matches any admin
    const matchingAdmin = admins.find((admin) => admin.email === selectedEmail)
    if (matchingAdmin) {
      setSelectedAdminId(matchingAdmin.id)
      setIsManualEmail(false)
    } else if (selectedEmail) {
      setIsManualEmail(true)
    }
  }, [selectedEmail, admins])

  const handleAdminSelect = (adminId: string) => {
    if (adminId === "custom") {
      setIsManualEmail(true)
      setSelectedAdminId("")
      onEmailChange("")
    } else {
      const admin = admins.find((a) => a.id === adminId)
      if (admin) {
        setSelectedAdminId(adminId)
        setIsManualEmail(false)
        onEmailChange(admin.email)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Admin Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="admin-select">Select Admin</Label>
        <Select
          value={isManualEmail ? "custom" : selectedAdminId}
          onValueChange={handleAdminSelect}
          disabled={disabled}
        >
          <SelectTrigger id="admin-select">
            <SelectValue placeholder="Choose an admin or enter custom email" />
          </SelectTrigger>
          <SelectContent>
            {admins.map((admin) => (
              <SelectItem key={admin.id} value={admin.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{admin.name}</span>
                  <span className="text-xs text-muted-foreground">{admin.email}</span>
                </div>
              </SelectItem>
            ))}
            <SelectItem value="custom">
              <span className="text-muted-foreground">Custom Email...</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email-input">Email Address</Label>
        <Input
          id="email-input"
          type="email"
          placeholder="admin@mtn.com"
          value={selectedEmail}
          onChange={(e) => {
            setIsManualEmail(true)
            setSelectedAdminId("")
            onEmailChange(e.target.value)
          }}
          disabled={disabled}
          className={!isManualEmail ? "bg-muted" : ""}
        />
        {!isManualEmail && selectedEmail && (
          <p className="text-xs text-muted-foreground">
            Email auto-filled from selected admin
          </p>
        )}
      </div>
    </div>
  )
}

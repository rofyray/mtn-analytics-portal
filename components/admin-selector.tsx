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

  useEffect(() => {
    // Check if current email matches any admin
    const matchingAdmin = admins.find((admin) => admin.email === selectedEmail)
    if (matchingAdmin) {
      setSelectedAdminId(matchingAdmin.id)
    }
  }, [selectedEmail, admins])

  const handleAdminSelect = (adminId: string) => {
    const admin = admins.find((a) => a.id === adminId)
    if (admin) {
      setSelectedAdminId(adminId)
      onEmailChange(admin.email)
    }
  }

  return (
    <div className="space-y-4">
      {/* Admin Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="admin-select">Select Admin</Label>
        <Select
          value={selectedAdminId}
          onValueChange={handleAdminSelect}
          disabled={disabled}
        >
          <SelectTrigger id="admin-select">
            <SelectValue placeholder="Choose an admin" />
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
          </SelectContent>
        </Select>
      </div>

      {/* Email Display */}
      <div className="space-y-2">
        <Label htmlFor="email-input">Email Address</Label>
        <Input
          id="email-input"
          type="email"
          placeholder="Select an admin above"
          value={selectedEmail}
          readOnly
          disabled={disabled}
          className="bg-muted"
        />
      </div>
    </div>
  )
}

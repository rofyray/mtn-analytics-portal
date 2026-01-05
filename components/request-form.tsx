"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { format, parse } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"

const requestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Please select a department"),
  requestType: z.string().min(1, "Please select a request type"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.string().refine((date) => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate >= today
  }, "Due date must be today or in the future"),
})

type RequestFormData = z.infer<typeof requestSchema>

interface RequestFormProps {
  departments: string[]
  requestTypes: string[]
  onSubmit?: (data: RequestFormData) => Promise<void>
}

export function RequestForm({ departments, requestTypes, onSubmit }: RequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  })

  const selectedDepartment = watch("department")
  const selectedRequestType = watch("requestType")

  const handleFormSubmit = async (data: RequestFormData) => {
    try {
      setIsSubmitting(true)
      if (onSubmit) {
        await onSubmit(data)
      }
      toast.success("Request submitted successfully!")
      reset()
    } catch (error) {
      toast.error("Failed to submit request. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Analytics Request</CardTitle>
        <CardDescription>
          Fill out the form below to request analytics support, dashboards, or reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Geoffrey Okyere-Forson"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="geoffery.okyere-forson@mtn.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={selectedDepartment}
                onValueChange={(value) => setValue("department", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department.message}</p>
              )}
            </div>

            {/* Request Type */}
            <div className="space-y-2">
              <Label htmlFor="requestType">Request Type *</Label>
              <Select
                value={selectedRequestType}
                onValueChange={(value) => setValue("requestType", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="requestType">
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.requestType && (
                <p className="text-sm text-destructive">{errors.requestType.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dueDate">Needed By Date *</Label>
              <DatePicker
                id="dueDate"
                value={watch("dueDate") ? parse(watch("dueDate"), "yyyy-MM-dd", new Date()) : undefined}
                onChange={(date) => {
                  if (date) {
                    setValue("dueDate", format(date, "yyyy-MM-dd"))
                  }
                }}
                minDate={new Date()}
                disabled={isSubmitting}
                placeholder="Select needed by date"
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about your analytics request..."
                rows={5}
                {...register("description")}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

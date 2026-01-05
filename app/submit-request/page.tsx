"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Loader2, Send, CheckCircle } from "lucide-react"
import { format, parse } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"

// Import config data
import departments from "@/config/departments.json"
import requestTypes from "@/config/request-types.json"

// Form validation schema
const requestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Please select a department"),
  otherDepartment: z.string().optional(),
  requestType: z.string().min(1, "Please select a request type"),
  otherRequestType: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.string().min(1, "Due date is required").refine((date) => {
    const selected = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selected >= today
  }, "Due date must be today or in the future"),
}).refine((data) => {
  if (data.department === "Other" && (!data.otherDepartment || data.otherDepartment.trim() === "")) {
    return false
  }
  return true
}, {
  message: "Please specify your department",
  path: ["otherDepartment"],
}).refine((data) => {
  if (data.requestType === "Other" && (!data.otherRequestType || data.otherRequestType.trim() === "")) {
    return false
  }
  return true
}, {
  message: "Please specify the request type",
  path: ["otherRequestType"],
})

type RequestFormData = z.infer<typeof requestSchema>

export default function SubmitRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      otherDepartment: "",
      requestType: "",
      otherRequestType: "",
      description: "",
      dueDate: "",
    },
  })

  const selectedDepartment = watch("department")
  const selectedRequestType = watch("requestType")

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true)
    setIsSuccess(false)

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          department: data.department === "Other" ? data.otherDepartment : data.department,
          requestType: data.requestType === "Other" ? data.otherRequestType : data.requestType,
          dueDate: new Date(data.dueDate).toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit request")
      }

      setIsSuccess(true)
      toast.success("Request submitted successfully! Check your email for confirmation.")
      reset()

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Submit Analytics Request</h1>
        <p className="text-lg text-muted-foreground">
          Fill out the form below to request analytics support from our team
        </p>
      </div>

      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Please provide as much detail as possible to help us process your request efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            All fields are required unless marked as optional
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Analytics request form">
            {/* Name and Email Row */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Geoffrey Okyere-Forson"
                  {...register("name")}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive" role="alert">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="geoffery.okyere-forson@mtn.com"
                  {...register("email")}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive" role="alert">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Department and Request Type Row */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">
                  Department
                </Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={(value) => setValue("department", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select your department" />
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
                {selectedDepartment === "Other" && (
                  <div className="mt-2">
                    <Input
                      id="otherDepartment"
                      placeholder="Please specify your department"
                      {...register("otherDepartment")}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.otherDepartment}
                      aria-describedby={errors.otherDepartment ? "otherDepartment-error" : undefined}
                    />
                    {errors.otherDepartment && (
                      <p id="otherDepartment-error" className="text-sm text-destructive mt-1" role="alert">
                        {errors.otherDepartment.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestType">
                  Request Type
                </Label>
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
                {selectedRequestType === "Other" && (
                  <div className="mt-2">
                    <Input
                      id="otherRequestType"
                      placeholder="Please specify the request type"
                      {...register("otherRequestType")}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.otherRequestType}
                      aria-describedby={errors.otherRequestType ? "otherRequestType-error" : undefined}
                    />
                    {errors.otherRequestType && (
                      <p id="otherRequestType-error" className="text-sm text-destructive mt-1" role="alert">
                        {errors.otherRequestType.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Needed By Date
              </Label>
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
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Please describe your analytics request in detail..."
                rows={6}
                {...register("description")}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters
              </p>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your request has been submitted successfully! You will receive a confirmation email shortly.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Need help? Contact the analytics team at{" "}
          <a href="mailto:analytics@mtn.com" className="text-secondary dark:text-primary">
            analytics@mtn.com
          </a>
        </p>
      </div>
    </div>
  )
}

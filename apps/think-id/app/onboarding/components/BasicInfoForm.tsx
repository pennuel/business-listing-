"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@think-id/ui/components/ui/button"
import { Input } from "@think-id/ui/components/ui/input"
import { Label } from "@think-id/ui/components/ui/label"
import type { BusinessData } from "../page"

interface BasicInfoFormProps {
  data: BusinessData
  onUpdate: (data: Partial<BusinessData>) => void
  onNext: () => void
}

export default function BasicInfoForm({ data, onUpdate, onNext }: BasicInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.name.trim()) newErrors.name = "Business name is required"
    if (!data.phone.trim()) newErrors.phone = "Phone number is required"
    if (!data.email.trim()) newErrors.email = "Email is required"
    if (!data.email.includes("@")) newErrors.email = "Valid email is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">
          Business Name *
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
          placeholder="Enter your business name"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium">
          Phone Number *
        </Label>
        <Input
          id="phone"
          value={data.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
          placeholder="business@example.com"
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="website" className="text-sm font-medium">
          Website (Optional)
        </Label>
        <Input
          id="website"
          value={data.website}
          onChange={(e) => onUpdate({ website: e.target.value })}
          className="mt-1"
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full h-11 text-base">
          Continue
        </Button>
      </div>
    </form>
  )
}

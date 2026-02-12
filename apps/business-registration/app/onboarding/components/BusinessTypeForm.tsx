"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BusinessData } from "../page"

interface BusinessTypeFormProps {
  data: BusinessData
  onUpdate: (data: Partial<BusinessData>) => void
  onNext: () => void
  onPrevious: () => void
}

const businessCategories = {
  goods: [
    "Electronics & Technology",
    "Clothing & Fashion",
    "Food & Beverages",
    "Home & Garden",
    "Sports & Recreation",
    "Books & Media",
    "Health & Beauty",
    "Automotive",
    "Arts & Crafts",
    "Jewelry & Accessories",
  ],
  services: [
    "Professional Services",
    "Health & Medical",
    "Education & Training",
    "Home Services",
    "Business Services",
    "Personal Services",
    "Financial Services",
    "Technology Services",
    "Legal Services",
    "Consulting",
  ],
}

export default function BusinessTypeForm({ data, onUpdate, onNext, onPrevious }: BusinessTypeFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.offeringType) newErrors.offeringType = "Please select what you offer"
    if (!data.category) newErrors.category = "Please select a category"
    if (!data.description.trim()) newErrors.description = "Description is required"
    if (data.description.trim().length < 20) newErrors.description = "Description should be at least 20 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const availableCategories = data.offeringType ? businessCategories[data.offeringType] : []

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>What do you offer? *</Label>
        <Select
          value={data.offeringType}
          onValueChange={(value: "goods" | "services") => {
            onUpdate({ offeringType: value, category: "" })
          }}
        >
          <SelectTrigger className={errors.offeringType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select what you offer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="goods">Physical Goods</SelectItem>
            <SelectItem value="services">Services</SelectItem>
          </SelectContent>
        </Select>
        {errors.offeringType && <p className="text-sm text-red-500 mt-1">{errors.offeringType}</p>}
      </div>

      {data.offeringType && (
        <div>
          <Label>Business Category *</Label>
          <Select value={data.category} onValueChange={(value) => onUpdate({ category: value })}>
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="description">Business Description *</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe what your business offers, what makes you unique, and why customers should choose you..."
          rows={4}
          className={errors.description ? "border-red-500" : ""}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          <p className="text-sm text-gray-500 ml-auto">{data.description.length}/500</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onPrevious} className="flex-1 bg-transparent">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  )
}

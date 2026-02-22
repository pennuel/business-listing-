"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@think-id/ui/components/ui/button"
import { Label } from "@think-id/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@think-id/ui/components/ui/select"
import { Textarea } from "@think-id/ui/components/ui/textarea"
import type { BusinessData } from "../page"
import { getCategories } from "../actions"

interface Category {
  categoryName?: string;
  categoryId?: number;
}

interface BusinessTypeFormProps {
  data: BusinessData
  onUpdate: (data: Partial<BusinessData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function BusinessTypeForm({ data, onUpdate, onNext, onPrevious }: BusinessTypeFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

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

  // Filter categories based on offering type if the API supports it, 
  // or just show all for now if their structure doesn't distinguish yet.
  // The old static list had "goods" and "services" groupings.
  const availableCategories = categories;

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
          <Select 
            value={data.category} 
            onValueChange={(value) => {
              const selectedCat = categories.find(c => c.categoryName === value)
              onUpdate({ 
                category: value, 
                categoryId: selectedCat?.categoryId 
              })
            }}
            disabled={isLoading}
          >
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder={isLoading ? "Loading categories..." : "Select a category"} />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((cat) => (
                <SelectItem key={cat.categoryId} value={cat.categoryName || ""}>
                  {cat.categoryName}
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

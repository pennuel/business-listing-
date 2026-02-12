"use client"

import { useState } from "react"
import { Button } from "@think-id/ui/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@think-id/ui/components/ui/card"
import { CheckCircle, CreditCard, Shield, Zap, AlertCircle } from "lucide-react"

interface PaymentInfoFormProps {
  onSubmit: () => Promise<void>
  onPrevious: () => void
  isSubmitting: boolean
}

export default function PaymentInfoForm({ onSubmit, onPrevious, isSubmitting }: PaymentInfoFormProps) {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setError(null)
      await onSubmit()
    } catch (err) {
      console.error("Payment form error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 text-sm font-medium">Submission Error</p>
            <p className="text-red-700 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" />
            Business Listing
          </CardTitle>
          <CardDescription className="text-xs">Professional listing package</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-3">
            <span className="text-2xl font-bold">$29</span>
            <span className="text-gray-600 text-sm">/month</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs">Business listing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs">Customer inquiries</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs">Analytics dashboard</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <Shield className="h-6 w-6 text-blue-500 mx-auto mb-1" />
          <p className="text-xs font-medium">Secure</p>
        </div>
        <div className="text-center">
          <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-xs font-medium">Instant</p>
        </div>
        <div className="text-center">
          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
          <p className="text-xs font-medium">Guaranteed</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          Your information is saved. Complete payment later from your dashboard if needed.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1 bg-transparent h-11"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 text-base"
        >
          {isSubmitting ? "Saving..." : "Complete Registration"}
        </Button>
      </div>
    </div>
  )
}

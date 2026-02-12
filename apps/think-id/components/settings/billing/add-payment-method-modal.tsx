"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@think-id/ui/components/ui/dialog"
import { Button } from "@think-id/ui/components/ui/button"
import { Input } from "@think-id/ui/components/ui/input"
import { Label } from "@think-id/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@think-id/ui/components/ui/select"
import { Card, CardContent } from "@think-id/ui/components/ui/card"
import { CreditCard, Smartphone, Building, CheckCircle } from "lucide-react"

interface AddPaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentMethodAdded: (method: any) => void
}

export function AddPaymentMethodModal({ isOpen, onClose, onPaymentMethodAdded }: AddPaymentMethodModalProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    phoneNumber: "",
    bankName: "",
    accountNumber: "",
  })

  const paymentTypes = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: Smartphone,
      description: "Mobile money payment",
    },
    {
      id: "bank",
      name: "Bank Account",
      icon: Building,
      description: "Direct bank transfer",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let newPaymentMethod

    switch (selectedType) {
      case "card":
        newPaymentMethod = {
          id: Date.now().toString(),
          type: "Card",
          last4: formData.cardNumber.slice(-4),
          expiry: `${formData.expiryMonth}/${formData.expiryYear}`,
          cardholderName: formData.cardholderName,
          isDefault: false,
        }
        break
      case "mpesa":
        newPaymentMethod = {
          id: Date.now().toString(),
          type: "M-Pesa",
          phoneNumber: formData.phoneNumber,
          last4: formData.phoneNumber.slice(-4),
          isDefault: false,
        }
        break
      case "bank":
        newPaymentMethod = {
          id: Date.now().toString(),
          type: "Bank",
          bankName: formData.bankName,
          last4: formData.accountNumber.slice(-4),
          isDefault: false,
        }
        break
      default:
        return
    }

    onPaymentMethodAdded(newPaymentMethod)
    onClose()

    // Reset form
    setSelectedType("")
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: "",
      phoneNumber: "",
      bankName: "",
      accountNumber: "",
    })
  }

  const renderPaymentForm = () => {
    switch (selectedType) {
      case "card":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Select
                  value={formData.expiryMonth}
                  onValueChange={(value) => setFormData({ ...formData, expiryMonth: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Select
                  value={formData.expiryYear}
                  onValueChange={(value) => setFormData({ ...formData, expiryYear: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                        {String(new Date().getFullYear() + i).slice(-2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              />
            </div>
          </div>
        )

      case "mpesa":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">M-Pesa Payment</span>
              </div>
              <p className="text-sm text-green-700">You'll receive an STK push notification to complete payments</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="+254 700 000 000"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Enter the phone number registered with M-Pesa</p>
            </div>
          </div>
        )

      case "bank":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Select
                value={formData.bankName}
                onValueChange={(value) => setFormData({ ...formData, bankName: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kcb">KCB Bank</SelectItem>
                  <SelectItem value="equity">Equity Bank</SelectItem>
                  <SelectItem value="coop">Co-operative Bank</SelectItem>
                  <SelectItem value="absa">Absa Bank</SelectItem>
                  <SelectItem value="standard">Standard Chartered</SelectItem>
                  <SelectItem value="dtb">Diamond Trust Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="1234567890"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>Choose a payment method to add to your account</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedType ? (
            <div className="space-y-3">
              {paymentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card
                    key={type.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{type.name}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b">
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedType("")}>
                  ← Back
                </Button>
                <span className="font-medium">{paymentTypes.find((t) => t.id === selectedType)?.name}</span>
              </div>

              {renderPaymentForm()}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

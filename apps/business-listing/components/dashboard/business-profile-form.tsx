"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Field,
  FieldTitle,
  FieldError,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Store, Phone, Mail, Globe, Tag, Image as ImageIcon, Wifi, ParkingCircle, CreditCard, Clock, Trash2 } from "lucide-react"
import { useUpdateBusiness } from '@/lib/hooks/useBusinesses'

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: z.string().max(100, "Tagline must be under 100 characters").optional(),
  description: z.string().min(10, "Description should be a bit longer to attract customers").optional(),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  website: z.string().url("Valid URL required").or(z.literal("")).optional(),
  category: z.string().min(2, "Category is required"),
  coverImage: z.string().url("Valid image URL required").or(z.literal("")).optional(),
  amenities: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
})

interface BusinessProfileFormProps {
  business: any
}

export function BusinessProfileForm({ business }: BusinessProfileFormProps) {
  const updateMutation = useUpdateBusiness()
  const [isLoading, setIsLoading] = useState(false)
  const [amenityInput, setAmenityInput] = useState("")
  const [galleryInput, setGalleryInput] = useState("")

  const form = useForm<z.infer<typeof profileSchema>>({
    // @ts-ignore
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: business.name || "",
      tagline: business.tagline || "",
      description: business.description || "",
      phone: business.phone || "",
      email: business.email || "",
      website: business.website || "",
      category: typeof business.category === 'object' ? business.category?.categoryName || "" : business.category || "",
      coverImage: business.coverImage || "",
      amenities: Array.isArray(business.amenities) ? business.amenities : [],
      gallery: Array.isArray(business.gallery) ? business.gallery : [],
    },
  })

  const addAmenity = () => {
    if (amenityInput.trim()) {
      const current = form.getValues("amenities")
      if (!current.includes(amenityInput.trim())) {
        form.setValue("amenities", [...current, amenityInput.trim()])
      }
      setAmenityInput("")
    }
  }

  const removeAmenity = (index: number) => {
    const current = form.getValues("amenities")
    form.setValue("amenities", current.filter((_, i) => i !== index))
  }

  const addGalleryImage = () => {
    if (galleryInput.trim()) {
      const current = form.getValues("gallery")
      form.setValue("gallery", [...current, galleryInput.trim()])
      setGalleryInput("")
    }
  }

  const removeGalleryImage = (index: number) => {
    const current = form.getValues("gallery")
    form.setValue("gallery", current.filter((_, i) => i !== index))
  }

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true)
    try {
      await updateMutation.mutateAsync({ id: business.id, data: values })
      toast.success("Window display updated successfully!")
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const { control, handleSubmit, watch, setValue, getValues, formState: { errors } } = form

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Core Branding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" /> Core Branding
                </CardTitle>
                <CardDescription>How your business identifies itself in the mall.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldTitle>Business Name</FieldTitle>
                    <Controller control={control} name="name" render={({ field }) => <Input placeholder="The Coffee Nook" {...field} />} />
                    <FieldError errors={[errors.name]} />
                  </Field>
                  <Field>
                    <FieldTitle>Tagline / Catchphrase</FieldTitle>
                    <Controller control={control} name="tagline" render={({ field }) => <Input placeholder="Brewing happiness, one cup at a time." {...field} />} />
                    <FieldDescription>A short phrase that appears under your name.</FieldDescription>
                    <FieldError errors={[errors.tagline]} />
                  </Field>
                  <Field>
                    <FieldTitle>Story & Description</FieldTitle>
                    <Controller control={control} name="description" render={({ field }) => <Textarea placeholder="Tell your customers about what makes your business special..." className="min-h-[150px]" {...field} />} />
                    <FieldError errors={[errors.description]} />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            {/* Visuals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" /> Visuals
                </CardTitle>
                <CardDescription>The "Mannequin" — visual appeal of your storefront.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldTitle>Cover Image URL</FieldTitle>
                  <Controller control={control} name="coverImage" render={({ field }) => <Input placeholder="https://example.com/storefront.jpg" {...field} />} />
                  <FieldDescription>The main hero image for your window display.</FieldDescription>
                  <FieldError errors={[errors.coverImage]} />
                </Field>
                {watch("coverImage") && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <img 
                      src={watch("coverImage")} 
                      alt="Preview" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" /> Gallery
                </CardTitle>
                <CardDescription>Showcase your work, products, or store interior.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://example.com/image.jpg" 
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addGalleryImage()
                      }
                    }}
                  />
                  <Button type="button" onClick={addGalleryImage} variant="secondary">Add Image</Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {watch("gallery").map((url, index) => (
                    <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border">
                      <img src={url} alt={`Gallery ${index}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {watch("gallery").length === 0 && (
                    <div className="col-span-full py-8 text-center border-2 border-dashed rounded-lg text-muted-foreground bg-muted/30">
                      No gallery images added yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" /> Amenities
                </CardTitle>
                <CardDescription>What additional perks do you offer?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. Free Wi-Fi, Parking, AC" 
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addAmenity()
                      }
                    }}
                  />
                  <Button type="button" onClick={addAmenity}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {watch("amenities").map((amenity, index) => (
                    <div 
                      key={index} 
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {amenity}
                      <button 
                        type="button" 
                        onClick={() => removeAmenity(index)}
                        className="hover:text-destructive font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {watch("amenities").length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No amenities added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" /> The Lease Details
                </CardTitle>
                <CardDescription>Essential contact info.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldTitle>Phone Number</FieldTitle>
                    <Controller control={control} name="phone" render={({ field }) => <Input {...field} />} />
                    <FieldError errors={[errors.phone]} />
                  </Field>
                  <Field>
                    <FieldTitle>Public Email</FieldTitle>
                    <Controller control={control} name="email" render={({ field }) => <Input {...field} />} />
                    <FieldError errors={[errors.email]} />
                  </Field>
                  <Field>
                    <FieldTitle>Website</FieldTitle>
                    <Controller control={control} name="website" render={({ field }) => <Input placeholder="https://..." {...field} />} />
                    <FieldError errors={[errors.website]} />
                  </Field>
                  <Field>
                    <FieldTitle>Business Category</FieldTitle>
                    <Controller control={control} name="category" render={({ field }) => <Input {...field} />} />
                    <FieldError errors={[errors.category]} />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            {/* Submit Action */}
            <Card className="bg-primary/5 border-primary/20 sticky top-6">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Changes will be updated across the Mall Directory and your public Window Display instantly.
                </p>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save All Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
  )
}

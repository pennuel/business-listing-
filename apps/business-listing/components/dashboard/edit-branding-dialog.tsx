"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateBusinessProfile } from "@/app/actions/business"
import { toast } from "sonner"
import { Loader2, Edit } from "lucide-react"

const brandingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: z.string().max(100, "Tagline must be under 100 characters").optional(),
  description: z.string().min(10, "Description should be a bit longer to attract customers").optional(),
  category: z.string().min(2, "Category is required"),
  coverImage: z.string().url("Valid image URL required").or(z.literal("")).optional(),
})

interface EditBrandingDialogProps {
  business: any
  trigger?: React.ReactNode
}

export function EditBrandingDialog({ business, trigger }: EditBrandingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof brandingSchema>>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      name: business.name || "",
      tagline: business.tagline || "",
      description: business.description || "",
      category: business.category || "",
      coverImage: business.coverImage || "",
    },
  })

  async function onSubmit(values: z.infer<typeof brandingSchema>) {
    setIsLoading(true)
    try {
      const result = await updateBusinessProfile(business.id, {
        ...values,
        phone: business.phone,
        email: business.email,
        website: business.website,
        amenities: business.amenities,
        gallery: business.gallery,
      })
      if (result.success) {
        toast.success("Branding updated!")
        setOpen(false)
      } else {
        toast.error(result.error || "Failed to update branding")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 text-white">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Brand Identity</DialogTitle>
          <DialogDescription>Change how your storefront looks to people in the mall.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Us Story</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Branding
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

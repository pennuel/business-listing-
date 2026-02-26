"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
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
  Field,
  FieldTitle,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Edit, Phone, Mail, Globe } from "lucide-react"
import { useUpdateBusiness } from '@/lib/hooks/useBusinesses'

const contactSchema = z.object({
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  website: z.string().url("Valid URL required").or(z.literal("")).optional(),
})

interface EditContactDialogProps {
  business: any
  trigger?: React.ReactNode
}

export function EditContactDialog({ business, trigger }: EditContactDialogProps) {
  const updateMutation = useUpdateBusiness()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: business.phone || "",
      email: business.email || "",
      website: business.website || "",
    },
  })

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsLoading(true)
    try {
      await updateMutation.mutateAsync({ id: business.id, data: values })
      toast.success("Contact info updated!")
      setOpen(false)
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const { control, handleSubmit, formState: { errors } } = form

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 text-white">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Contact Details</DialogTitle>
          <DialogDescription>Let customers know how to reach you.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldTitle className="flex items-center gap-2">
                <Phone className="h-3 w-3" /> Phone Number
              </FieldTitle>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => <Input {...field} />}
              />
              <FieldError errors={[errors.phone]} />
            </Field>

            <Field>
              <FieldTitle className="flex items-center gap-2">
                <Mail className="h-3 w-3" /> Public Email
              </FieldTitle>
              <Controller
                control={control}
                name="email"
                render={({ field }) => <Input {...field} />}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldTitle className="flex items-center gap-2">
                <Globe className="h-3 w-3" /> Website
              </FieldTitle>
              <Controller
                control={control}
                name="website"
                render={({ field }) => <Input placeholder="https://..." {...field} />}
              />
              <FieldError errors={[errors.website]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Contact Info
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

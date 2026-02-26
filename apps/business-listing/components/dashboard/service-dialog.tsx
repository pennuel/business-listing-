"use client"

import { useEffect } from "react"
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
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAddService, useUpdateService } from "@/lib/hooks/useBusinesses"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

// ─── Schema ──────────────────────────────────────────────────────────────────
// Use z.coerce so number inputs bind as numbers instead of strings
const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.coerce.number({ error: "Price must be a number" }).min(0, "Price can't be negative"),
  duration: z.coerce.number({ error: "Duration must be a number" }).min(1, "Duration must be at least 1 minute"),
  currency: z.string().default("KSH"),
})

// Input = what the form fields hold (coerce accepts `unknown`)
// Output = what zod produces after parsing (numbers, etc.)
type ServiceFormInput = z.input<typeof serviceSchema>
type ServiceFormValues = z.output<typeof serviceSchema>

// ─── Props ────────────────────────────────────────────────────────────────────
interface ServiceDialogProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: any
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ServiceDialog({ businessId, open, onOpenChange, service }: ServiceDialogProps) {
  const isEditing = !!service

  const addMutation = useAddService()
  const updateMutation = useUpdateService(businessId)
  const isPending = addMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ServiceFormInput, unknown, ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      currency: "KSH",
    },
  })

  // Sync form values whenever the dialog opens or the service being edited changes
  useEffect(() => {
    if (open) {
      reset(
        service
          ? {
              name: service.name ?? "",
              description: service.description ?? "",
              price: Number(service.price) || 0,
              duration: Number(service.duration) || 30,
              currency: service.currency ?? "KSH",
            }
          : { name: "", description: "", price: 0, duration: 30, currency: "KSH" }
      )
    }
  }, [open, service, reset])

  const currency = watch("currency")

  async function onSubmit(values: ServiceFormValues): Promise<void> {
    if (isEditing) {
      updateMutation.mutate(
        { id: service.id, data: values },
        {
          onSuccess: () => {
            toast.success("Service updated")
            onOpenChange(false)
          },
          onError: (err) => toast.error(err.message ?? "Failed to update service"),
        }
      )
    } else {
      addMutation.mutate(
        { ...values, businessId },
        {
          onSuccess: () => {
            toast.success("Service added to shelves")
            onOpenChange(false)
            reset()
          },
          onError: (err) => toast.error(err.message ?? "Failed to add service"),
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Restock Service" : "Stock the Shelf"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your service on the shelf."
              : "Add a new service to your business shelves for customers to see."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Service name */}
          <Field>
            <FieldLabel htmlFor="svc-name">Service Name</FieldLabel>
            <Input
              id="svc-name"
              placeholder="e.g. Consulting Session"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel htmlFor="svc-description">Description <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
            <Textarea
              id="svc-description"
              placeholder="What does this service include?"
              className="resize-none"
              rows={2}
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            <FieldError errors={[errors.description]} />
          </Field>

          {/* Price + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="svc-price">Price ({currency})</FieldLabel>
              <Input
                id="svc-price"
                type="number"
                min={0}
                step="any"
                aria-invalid={!!errors.price}
                {...register("price")}
              />
              <FieldError errors={[errors.price]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="svc-duration">Duration (mins)</FieldLabel>
              <Input
                id="svc-duration"
                type="number"
                min={1}
                aria-invalid={!!errors.duration}
                {...register("duration")}
              />
              <FieldError errors={[errors.duration]} />
            </Field>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Service" : "Add to Shelves"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addService, updateService } from "@/app/actions/services"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Price must be a valid number"),
  duration: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Duration must be at least 1 minute"),
  currency: z.string().default("RWF"),
})

interface ServiceDialogProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: any // Optional for editing
}

export function ServiceDialog({ businessId, open, onOpenChange, service }: ServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0",
      duration: "30",
      currency: "RWF",
    },
  })

  // Reset form when service changes (for editing)
  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description || "",
        price: service.price.toString(),
        duration: service.duration.toString(),
        currency: service.currency || "RWF",
      })
    } else {
      form.reset({
        name: "",
        description: "",
        price: "0",
        duration: "30",
        currency: "RWF",
      })
    }
  }, [service, form, open])

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    setIsLoading(true)
    try {
      const data = {
        ...values,
        price: Number(values.price),
        duration: Number(values.duration),
      }

      let result
      if (service) {
        result = await updateService(service.id, data)
      } else {
        result = await addService({ ...data, businessId })
      }

      if (result.success) {
        toast.success(service ? "Service updated" : "Service added to shelves")
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (error) {
      toast.error("Failed to save service")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{service ? "Restock Service" : "Stock the Shelf"}</DialogTitle>
          <DialogDescription>
            {service 
              ? "Update the details of your service on the shelf." 
              : "Add a new service to your business shelves for customers to see."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Consulting Session" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What does this service include?" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ({form.watch("currency")})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (mins)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {service ? "Update Service" : "Add to Shelves"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

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
import { Loader2, Edit, Upload, Link, Grid } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const brandingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: z.string().max(100, "Tagline must be under 100 characters").optional(),
  description: z.string().min(10, "Description should be a bit longer to attract customers").optional(),
  category: z.string().min(2, "Category is required"),
  coverImage: z.string().optional(),
})

interface EditBrandingDialogProps {
  business: any
  trigger?: React.ReactNode
}

export function EditBrandingDialog({ business, trigger }: EditBrandingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      form.setValue("coverImage", reader.result as string)
      setUploading(false)
      toast.success("Image uploaded (locally)")
    }
    reader.readAsDataURL(file)
  }

  const galleryImages = Array.isArray(business.gallery) ? (business.gallery as string[]) : []

  async function onSubmit(values: z.infer<typeof brandingSchema>) {
    setIsLoading(true)
    try {
      const result = await updateBusinessProfile(business.id, values)
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Brand Identity</DialogTitle>
          <DialogDescription>Change how your storefront looks to people in the mall.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Short catchy phrase" />
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
                  <FormLabel>About Us / Story</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" placeholder="Tell the mall about your shop..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Storefront Hero Image</FormLabel>
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed bg-muted mb-4 group">
                 {form.watch("coverImage") ? (
                   <img src={form.getValues("coverImage")} className="w-full h-full object-cover" alt="Cover" />
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                      <Upload className="h-8 w-8 opacity-20" />
                      <span className="text-xs">No image selected</span>
                   </div>
                 )}
                 {uploading && (
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                   </div>
                 )}
              </div>

              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload" className="gap-2 text-xs">
                    <Upload className="h-3 w-3" /> Upload
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="gap-2 text-xs">
                    <Grid className="h-3 w-3" /> Gallery
                  </TabsTrigger>
                  <TabsTrigger value="url" className="gap-2 text-xs">
                    <Link className="h-3 w-3" /> URL
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="pt-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-xs text-gray-500"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-[10px] text-gray-400">PNG, JPG or WEBP</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="pt-4">
                   {galleryImages.length > 0 ? (
                     <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto pr-1">
                        {galleryImages.map((url, i) => (
                          <div 
                            key={i} 
                            onClick={() => form.setValue("coverImage", url)}
                            className={cn(
                              "aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                              form.watch("coverImage") === url ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/20"
                            )}
                          >
                            <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="text-center py-8 text-[10px] text-muted-foreground bg-muted/30 rounded-lg">
                        Go to "Visual Showcase" to add gallery images first.
                     </div>
                   )}
                </TabsContent>

                <TabsContent value="url" className="pt-4">
                   <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/hero.jpg" />
                        </FormControl>
                        <FormDescription className="text-[10px]">
                          Enter a direct path to an image file.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </div>
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

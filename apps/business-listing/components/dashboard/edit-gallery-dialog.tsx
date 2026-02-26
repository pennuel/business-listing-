"use client"

import { useState } from "react"
import { ImageIcon, Loader2, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAddBrandingImage, useDeleteBrandingImage } from "@/lib/hooks/useBusinesses"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface EditGalleryDialogProps {
  business: any
  trigger?: React.ReactNode
}

export function EditGalleryDialog({ business, trigger }: EditGalleryDialogProps) {
  const [open, setOpen] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")

  const businessId = business.id?.toString() ?? ""
  const addMutation    = useAddBrandingImage(businessId)
  const deleteMutation = useDeleteBrandingImage(businessId)

  // branding[] has the authoritative per-image records (with brandId for deletion)
  // gallery[]  is the merged display array — we use branding[] here for management
  const brandingItems: Array<{ brandId: any; mediaUrl: string | null }> =
    Array.isArray(business.branding) ? business.branding : []

  const handleAdd = () => {
    const url = newImageUrl.trim()
    if (!url) return
    addMutation.mutate(
      { mediaUrl: url },
      {
        onSuccess: () => {
          toast.success("Image added to gallery")
          setNewImageUrl("")
        },
        onError: () => toast.error("Failed to add image"),
      }
    )
  }

  const handleRemove = (brandId: any) => {
    if (!confirm("Remove this image from the gallery?")) return
    deleteMutation.mutate(
      String(brandId),
      {
        onSuccess: () => toast.success("Image removed"),
        onError: () => toast.error("Failed to remove image"),
      }
    )
  }

  const isPending = addMutation.isPending || deleteMutation.isPending

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ImageIcon className="h-4 w-4" /> Edit Gallery
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Storefront Gallery</DialogTitle>
          <DialogDescription>
            Add images showcasing your products, services, or interior. Each image is saved individually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add new image */}
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              disabled={isPending}
            />
            <Button onClick={handleAdd} variant="secondary" disabled={isPending || !newImageUrl.trim()}>
              {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {brandingItems.map((item) => (
              <div key={item.brandId} className="relative aspect-square group rounded-lg overflow-hidden border bg-muted">
                {item.mediaUrl ? (
                  <img src={item.mediaUrl} className="w-full h-full object-cover" alt="Gallery image" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
                <button
                  onClick={() => handleRemove(item.brandId)}
                  disabled={deleteMutation.isPending}
                  className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash className="h-3 w-3" />
                </button>
              </div>
            ))}
            {brandingItems.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg text-muted-foreground italic">
                No gallery images yet. Add your first image above.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Plus, Package, Edit, Trash2, Clock, ImageIcon, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { useUpdateBusiness } from '@/lib/hooks/useBusinesses'
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
  const updateMutation = useUpdateBusiness()
  const [open, setOpen] = useState(false)
  const [gallery, setGallery] = useState<string[]>(Array.isArray(business.gallery) ? (business.gallery as string[]) : [])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = () => {
    if (newImageUrl.trim()) {
      setGallery([...gallery, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const handleRemove = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateMutation.mutateAsync({ id: business.id, data: { gallery } })
      toast.success("Gallery updated!")
      setOpen(false)
    } catch (error) {
      toast.error("Error saving gallery")
    } finally {
      setIsLoading(false)
    }
  }

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
          <DialogDescription>Add images showing off your products, services, or interior.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
           <div className="flex gap-2">
              <Input 
                placeholder="https://example.com/image.jpg" 
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button onClick={handleAdd} variant="secondary">Add</Button>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((url, index) => (
                <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border bg-muted">
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => handleRemove(index)}
                        className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash className="h-3 w-3" />
                    </button>
                </div>
              ))}
              {gallery.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg text-muted-foreground italic">
                   No gallery images yet.
                </div>
              )}
           </div>
        </div>

        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && "Saving..."}
              Save Changes
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

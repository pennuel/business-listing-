"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Edit, Wifi, X } from "lucide-react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { updateBusiness } from "@/lib/redux/slices/businessSlice"

interface EditAmenitiesDialogProps {
  business: any
  trigger?: React.ReactNode
}

export function EditAmenitiesDialog({ business, trigger }: EditAmenitiesDialogProps) {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [amenities, setAmenities] = useState<string[]>(Array.isArray(business.amenities) ? (business.amenities as string[]) : [])
  const [newAmenity, setNewAmenity] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const handleRemove = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const resultAction = await dispatch(updateBusiness({ 
        id: business.id, 
        data: { amenities: amenities } 
      }))
      
      if (updateBusiness.fulfilled.match(resultAction)) {
        toast.success("Amenities updated!")
        setOpen(false)
      } else {
        toast.error("Failed to update amenities")
      }
    } catch (error) {
       toast.error("Error saving amenities")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Wifi className="h-4 w-4" /> Edit Perks
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Business Amenities</DialogTitle>
          <DialogDescription>What perks do you offer to customers? (e.g. Free Wi-Fi, AC, Parking)</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
           <div className="flex gap-2">
              <Input 
                placeholder="e.g. Wheelchair Access" 
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button onClick={handleAdd} variant="secondary">Add</Button>
           </div>

           <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100">
                    {amenity}
                    <button onClick={() => handleRemove(index)} className="hover:text-red-500">
                        <X className="h-3 w-3" />
                    </button>
                </div>
              ))}
              {amenities.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No perks listed yet.</p>
              )}
           </div>
        </div>

        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

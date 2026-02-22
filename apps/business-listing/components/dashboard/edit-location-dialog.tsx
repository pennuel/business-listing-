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
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, MapPin } from "lucide-react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { updateBusiness } from "@/lib/redux/slices/businessSlice"

interface EditLocationDialogProps {
  business: any
  trigger?: React.ReactNode
}

export function EditLocationDialog({ business, trigger }: EditLocationDialogProps) {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    country: business.country || "Kenya",
    county: business.county || "",
    subCounty: business.subCounty || "",
    address: business.address || "",
    pin: business.pin || "",
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {Action = await dispatch(updateBusiness({ id: business.id, data: formData }))
      
      if (updateBusiness.fulfilled.match(resultAction)it updateBusinessProfile(business.id, formData)
      if (result.success) {
        toast.success("Location updated!")
        setOpen(false)
      } else {
        toast.error("Failed to update location")
      }
    } catch (error) {
       toast.error("Error saving location")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <MapPin className="h-4 w-4" /> Edit Address
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Store Location</DialogTitle>
          <DialogDescription>Where can customers find you in the mall/city?</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">Country</Label>
            <Input
              id="country"
              className="col-span-3"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="county" className="text-right">County</Label>
            <Input
              id="county"
              className="col-span-3"
              value={formData.county}
              onChange={(e) => setFormData({ ...formData, county: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subCounty" className="text-right">Area/Sub-County</Label>
            <Input
              id="subCounty"
              className="col-span-3"
              value={formData.subCounty}
              onChange={(e) => setFormData({ ...formData, subCounty: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Street/Exact Loc</Label>
            <Input
              id="address"
              className="col-span-3"
              value={formData.address}
              placeholder="e.g. Ground Floor, Right Wing, Next to H&M"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Location
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
import { updateBusinessProfile } from "@/app/actions/business"
import { toast } from "sonner"
import { Loader2, Clock } from "lucide-react"

interface EditHoursDialogProps {
  business: any
  trigger?: React.ReactNode
}

export function EditHoursDialog({ business, trigger }: EditHoursDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Simple extraction for editing
  const [weekday, setWeekday] = useState(typeof business.weekdaySchedule === 'string' ? business.weekdaySchedule : "9:00 AM - 6:00 PM")
  const [weekend, setWeekend] = useState(typeof business.weekendSchedule === 'string' ? business.weekendSchedule : "10:00 AM - 4:00 PM")

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const result = await updateBusinessProfile(business.id, {
        weekdaySchedule: weekday,
        weekendSchedule: weekend,
      })
      if (result.success) {
        toast.success("Business hours updated!")
        setOpen(false)
      } else {
        toast.error("Failed to update hours")
      }
    } catch (error) {
       toast.error("Error saving hours")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Clock className="h-4 w-4" /> Edit Hours
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Operating Hours</DialogTitle>
          <DialogDescription>Let customers know when your shop is open.</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="weekday">Weekdays (Mon - Fri)</Label>
            <Input
              id="weekday"
              value={weekday}
              placeholder="e.g. 8:30 AM - 7:00 PM"
              onChange={(e) => setWeekday(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekend">Weekends (Sat - Sun)</Label>
            <Input
              id="weekend"
              value={weekend}
              placeholder="e.g. 10:00 AM - 2:00 PM or Closed"
              onChange={(e) => setWeekend(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Hours
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

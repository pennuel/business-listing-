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
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Clock } from "lucide-react"
import { useUpdateBusiness } from "@/lib/hooks/useBusinesses"

const DAYS = [
  { key: "monday",    label: "Monday",    group: "weekday" as const },
  { key: "tuesday",   label: "Tuesday",   group: "weekday" as const },
  { key: "wednesday", label: "Wednesday", group: "weekday" as const },
  { key: "thursday",  label: "Thursday",  group: "weekday" as const },
  { key: "friday",    label: "Friday",    group: "weekday" as const },
  { key: "saturday",  label: "Saturday",  group: "weekend" as const },
  { key: "sunday",    label: "Sunday",    group: "weekend" as const },
]

const DAY_KEY_TO_INDEX: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
}

type DaySchedule = { isOpen: boolean; hours: string }
type ScheduleState = Record<string, DaySchedule>

function parseInitialSchedule(business: any): ScheduleState {
  const weekdaySchedule = business.weekdaySchedule ?? business.schedule?.weekday
  const weekendSchedule = business.weekendSchedule ?? business.schedule?.weekend

  return Object.fromEntries(
    DAYS.map((day) => {
      let schedStr: string | null = null
      // DB may store keys as "Thursday" (capitalized) or "thursday" (lowercase)
      const capitalKey = day.key.charAt(0).toUpperCase() + day.key.slice(1)

      if (typeof weekdaySchedule === "object" && weekdaySchedule !== null) {
        schedStr = weekdaySchedule[day.key] ?? weekdaySchedule[capitalKey] ?? null
      }
      if (schedStr === null && typeof weekendSchedule === "object" && weekendSchedule !== null) {
        schedStr = weekendSchedule[day.key] ?? weekendSchedule[capitalKey] ?? null
      }
      if (schedStr === null) {
        if (day.group === "weekend" && typeof weekendSchedule === "string") schedStr = weekendSchedule
        else if (day.group === "weekday" && typeof weekdaySchedule === "string") schedStr = weekdaySchedule
      }

      if (!schedStr || schedStr.toLowerCase() === "closed") {
        return [day.key, { isOpen: false, hours: "9:00 AM - 5:00 PM" }]
      }
      return [day.key, { isOpen: true, hours: schedStr }]
    })
  )
}

interface EditHoursDialogProps {
  business: any
  trigger?: React.ReactNode
}

export function EditHoursDialog({ business, trigger }: EditHoursDialogProps) {
  const updateMutation = useUpdateBusiness()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [schedule, setSchedule] = useState<ScheduleState>(() => parseInitialSchedule(business))

  const setDay = (key: string, updates: Partial<DaySchedule>) =>
    setSchedule((prev) => ({ ...prev, [key]: { ...prev[key], ...updates } }))

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const weekdayObj: Record<string, string> = {}
      const weekendObj: Record<string, string> = {}

      for (const day of DAYS) {
        const val = schedule[day.key].isOpen ? schedule[day.key].hours : "Closed"
        if (day.group === "weekday") weekdayObj[day.key] = val
        else weekendObj[day.key] = val
      }

      await updateMutation.mutateAsync({
        id: business.id ?? business.bizId?.toString(),
        data: { weekdaySchedule: weekdayObj, weekendSchedule: weekendObj },
      })

      toast.success("Business hours updated!")
      setOpen(false)
    } catch {
      toast.error("Error saving hours")
    } finally {
      setIsLoading(false)
    }
  }

  const todayIndex = new Date().getDay()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Clock className="h-4 w-4" /> Edit Hours
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Operating Hours</DialogTitle>
          <DialogDescription>
            Set individual opening hours for each day of the week.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 py-2">
          {DAYS.map((day) => {
            const dayData = schedule[day.key]
            const isToday = DAY_KEY_TO_INDEX[day.key] === todayIndex

            return (
              <div
                key={day.key}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isToday ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-28 shrink-0">
                  <span className={`text-sm font-medium ${isToday ? "text-blue-700" : "text-gray-700"}`}>
                    {day.label}
                    {isToday && <span className="ml-1.5 text-xs font-normal text-blue-400">today</span>}
                  </span>
                </div>

                <Switch
                  checked={dayData.isOpen}
                  onCheckedChange={(checked) => setDay(day.key, { isOpen: checked })}
                  className="shrink-0"
                />

                {dayData.isOpen ? (
                  <Input
                    value={dayData.hours}
                    onChange={(e) => setDay(day.key, { hours: e.target.value })}
                    placeholder="e.g. 9:00 AM - 6:00 PM"
                    className="h-8 text-sm flex-1"
                  />
                ) : (
                  <span className="text-sm text-red-400 font-medium">Closed</span>
                )}
              </div>
            )
          })}
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

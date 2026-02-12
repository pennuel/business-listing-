"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@think-id/ui/components/ui/button"
import { Input } from "@think-id/ui/components/ui/input"
import { Label } from "@think-id/ui/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@think-id/ui/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@think-id/ui/components/ui/select"
import { Switch } from "@think-id/ui/components/ui/switch"
import type { BusinessData } from "../page"

interface ScheduleFormProps {
  data: BusinessData
  onUpdate: (data: Partial<BusinessData>) => void
  onNext: () => void
  onPrevious: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

const weekdays = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
] as const

const weekends = [
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const

export default function ScheduleForm({ 
  data, 
  onUpdate, 
  onNext, 
  onPrevious,
  submitLabel = "Continue",
  isSubmitting = false
}: ScheduleFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [scheduleMode, setScheduleMode] = useState<"same" | "individual">("same")
  const [weekendMode, setWeekendMode] = useState<"same" | "individual">("same")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

    // Validate weekdays
    Object.entries(data.weekdaySchedule).forEach(([day, schedule]) => {
      if (schedule.isOpen) {
        if (!timeRegex.test(schedule.open)) {
          newErrors[`${day}Open`] = "Valid time required"
        }
        if (!timeRegex.test(schedule.close)) {
          newErrors[`${day}Close`] = "Valid time required"
        }
      }
    })

    // Validate weekends
    Object.entries(data.weekendSchedule).forEach(([day, schedule]) => {
      if (schedule.isOpen) {
        if (!timeRegex.test(schedule.open)) {
          newErrors[`${day}Open`] = "Valid time required"
        }
        if (!timeRegex.test(schedule.close)) {
          newErrors[`${day}Close`] = "Valid time required"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const updateWeekdaySchedule = (
    day: keyof BusinessData["weekdaySchedule"],
    field: "open" | "close" | "isOpen",
    value: string | boolean,
  ) => {
    onUpdate({
      weekdaySchedule: {
        ...data.weekdaySchedule,
        [day]: {
          ...data.weekdaySchedule[day],
          [field]: value,
        },
      },
    })
  }

  const updateWeekendSchedule = (
    day: keyof BusinessData["weekendSchedule"],
    field: "open" | "close" | "isOpen",
    value: string | boolean,
  ) => {
    onUpdate({
      weekendSchedule: {
        ...data.weekendSchedule,
        [day]: {
          ...data.weekendSchedule[day],
          [field]: value,
        },
      },
    })
  }

  const applyToAllWeekdays = (open: string, close: string) => {
    const updatedSchedule = { ...data.weekdaySchedule }
    weekdays.forEach(({ key }) => {
      updatedSchedule[key] = { ...updatedSchedule[key], open, close }
    })
    onUpdate({ weekdaySchedule: updatedSchedule })
  }

  const applyToAllWeekends = (open: string, close: string) => {
    const updatedSchedule = { ...data.weekendSchedule }
    weekends.forEach(({ key }) => {
      updatedSchedule[key] = { ...updatedSchedule[key], open, close }
    })
    onUpdate({ weekendSchedule: updatedSchedule })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Weekdays Section */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-blue-900">Weekdays</CardTitle>
                <p className="text-xs text-blue-700">Monday - Friday</p>
              </div>
              <Select value={scheduleMode} onValueChange={(value: "same" | "individual") => setScheduleMode(value)}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same">Same hours</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduleMode === "same" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Open</Label>
                  <Input
                    type="time"
                    value={data.weekdaySchedule.monday.open}
                    onChange={(e) => applyToAllWeekdays(e.target.value, data.weekdaySchedule.monday.close)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Close</Label>
                  <Input
                    type="time"
                    value={data.weekdaySchedule.monday.close}
                    onChange={(e) => applyToAllWeekdays(data.weekdaySchedule.monday.open, e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {weekdays.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex items-center space-x-2 min-w-[80px]">
                      <Switch
                        checked={data.weekdaySchedule[key].isOpen}
                        onCheckedChange={(checked) => updateWeekdaySchedule(key, "isOpen", checked)}
                        className="scale-75"
                      />
                      <Label className="text-xs font-medium">{label}</Label>
                    </div>
                    {data.weekdaySchedule[key].isOpen && (
                      <div className="flex gap-2 flex-1">
                        <Input
                          type="time"
                          value={data.weekdaySchedule[key].open}
                          onChange={(e) => updateWeekdaySchedule(key, "open", e.target.value)}
                          className={`text-sm ${errors[`${key}Open`] ? "border-red-500" : ""}`}
                        />
                        <Input
                          type="time"
                          value={data.weekdaySchedule[key].close}
                          onChange={(e) => updateWeekdaySchedule(key, "close", e.target.value)}
                          className={`text-sm ${errors[`${key}Close`] ? "border-red-500" : ""}`}
                        />
                      </div>
                    )}
                    {!data.weekdaySchedule[key].isOpen && (
                      <div className="flex-1 text-xs text-gray-500 italic">Closed</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekends Section */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-green-900">Weekends</CardTitle>
                <p className="text-xs text-green-700">Saturday - Sunday</p>
              </div>
              <Select value={weekendMode} onValueChange={(value: "same" | "individual") => setWeekendMode(value)}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same">Same hours</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {weekendMode === "same" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Open</Label>
                  <Input
                    type="time"
                    value={data.weekendSchedule.saturday.open}
                    onChange={(e) => applyToAllWeekends(e.target.value, data.weekendSchedule.saturday.close)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Close</Label>
                  <Input
                    type="time"
                    value={data.weekendSchedule.saturday.close}
                    onChange={(e) => applyToAllWeekends(data.weekendSchedule.saturday.open, e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {weekends.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex items-center space-x-2 min-w-[80px]">
                      <Switch
                        checked={data.weekendSchedule[key].isOpen}
                        onCheckedChange={(checked) => updateWeekendSchedule(key, "isOpen", checked)}
                        className="scale-75"
                      />
                      <Label className="text-xs font-medium">{label}</Label>
                    </div>
                    {data.weekendSchedule[key].isOpen && (
                      <div className="flex gap-2 flex-1">
                        <Input
                          type="time"
                          value={data.weekendSchedule[key].open}
                          onChange={(e) => updateWeekendSchedule(key, "open", e.target.value)}
                          className={`text-sm ${errors[`${key}Open`] ? "border-red-500" : ""}`}
                        />
                        <Input
                          type="time"
                          value={data.weekendSchedule[key].close}
                          onChange={(e) => updateWeekendSchedule(key, "close", e.target.value)}
                          className={`text-sm ${errors[`${key}Close`] ? "border-red-500" : ""}`}
                        />
                      </div>
                    )}
                    {!data.weekendSchedule[key].isOpen && (
                      <div className="flex-1 text-xs text-gray-500 italic">Closed</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Holidays Section */}
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-900">Holidays</CardTitle>
            <p className="text-xs text-purple-700">Special occasions & public holidays</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2 min-w-[80px]">
                <Switch
                  checked={data.holidayHours.isOpen}
                  onCheckedChange={(checked) =>
                    onUpdate({
                      holidayHours: { ...data.holidayHours, isOpen: checked },
                    })
                  }
                  className="scale-75"
                />
                <Label className="text-xs font-medium">Open</Label>
              </div>
              {data.holidayHours.isOpen && (
                <div className="flex gap-2 flex-1">
                  <Input
                    type="time"
                    value={data.holidayHours.open}
                    onChange={(e) =>
                      onUpdate({
                        holidayHours: { ...data.holidayHours, open: e.target.value },
                      })
                    }
                    className="text-sm"
                  />
                  <Input
                    type="time"
                    value={data.holidayHours.close}
                    onChange={(e) =>
                      onUpdate({
                        holidayHours: { ...data.holidayHours, close: e.target.value },
                      })
                    }
                    className="text-sm"
                  />
                </div>
              )}
              {!data.holidayHours.isOpen && (
                <div className="flex-1 text-xs text-gray-500 italic">Closed on holidays</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onPrevious} className="flex-1 bg-transparent">
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}

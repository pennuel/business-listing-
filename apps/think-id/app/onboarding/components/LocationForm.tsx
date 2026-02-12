"use client"

import type React from "react"
import { useEffect, useState } from "react"
import MapLocationForm from "./MapLocationForm"
import { Button } from "@think-id/ui/components/ui/button"
import { Input } from "@think-id/ui/components/ui/input"
import { Label } from "@think-id/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@think-id/ui/components/ui/select"
import { Textarea } from "@think-id/ui/components/ui/textarea"
import type { BusinessData } from "../page"

interface LocationFormProps {
  data: BusinessData
  onUpdate: (data: Partial<BusinessData>) => void
  onNext: () => void
  onPrevious: () => void
}

// Fallback options if JSON fails to load
const fallbackCountries = ["Kenya", "Uganda", "Tanzania"]

type LocationData = {
  countries: Array<{
    name: string
    counties: Array<{ name: string; subCounties: string[] }>
  }>
}

export default function LocationForm({ data, onUpdate, onNext, onPrevious }: LocationFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showMap, setShowMap] = useState(false)
  const [locations, setLocations] = useState<LocationData | null>(null)
  const [countryOptions, setCountryOptions] = useState<string[]>(fallbackCountries)
  const [countyOptions, setCountyOptions] = useState<string[]>([])
  const [subCountyOptions, setSubCountyOptions] = useState<string[]>([])

  // Load location JSON from public folder
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/data/locations.json")
        if (!res.ok) throw new Error("Failed to load locations")
        const json = (await res.json()) as LocationData
        if (!mounted) return
        setLocations(json)
        setCountryOptions(json.countries.map((c) => c.name))

        // If a country is already selected, populate counties
        if (data.country) {
          const c = json.countries.find((x) => x.name === data.country)
          if (c) setCountyOptions(c.counties.map((ct) => ct.name))
        }

        // If county is selected, populate subCounties
        if (data.county) {
          const c = json.countries
            .flatMap((x) => x.counties)
            .find((ct) => ct.name === data.county)
          if (c) setSubCountyOptions(c.subCounties)
        }
      } catch (err) {
        console.error("Failed to load locations.json", err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  // Keep county options in sync when country prop changes (e.g., prefilled data)
  useEffect(() => {
    if (!locations) return
    if (!data.country) {
      setCountyOptions([])
      setSubCountyOptions([])
      return
    }

    const found = locations.countries.find((c) => c.name === data.country)
    if (found) {
      setCountyOptions(found.counties.map((ct) => ct.name))
    } else {
      setCountyOptions([])
    }
  }, [data.country, locations])

  // Keep sub-county options in sync when county prop changes
  useEffect(() => {
    if (!locations) return
    if (!data.county) {
      setSubCountyOptions([])
      return
    }

    const found = locations.countries
      .flatMap((c) => c.counties)
      .find((ct) => ct.name === data.county)
    if (found) {
      setSubCountyOptions(found.subCounties)
    } else {
      setSubCountyOptions([])
    }
  }, [data.county, locations])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.country) newErrors.country = "Country is required"
    if (!data.county) newErrors.county = "County is required"
    if (!data.subCounty) newErrors.subCounty = "Sub County is required"
    if (!data.address.trim()) newErrors.address = "Address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Country *</Label>
        <Select
          value={data.country}
          onValueChange={(value) => {
            // when country changes, reset county and subCounty
            onUpdate({ country: value, county: "", subCounty: "" })
            // populate counties for this country
            const found = locations?.countries.find((c) => c.name === value)
            setCountyOptions(found ? found.counties.map((ct) => ct.name) : [])
            setSubCountyOptions([])
          }}
        >
          <SelectTrigger className={errors.country ? "border-red-500" : ""}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countryOptions.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>County *</Label>
          <Select
            value={data.county}
            onValueChange={(value) => {
              onUpdate({ county: value, subCounty: "" })
              // populate subcounties
              const found = locations?.countries
                .flatMap((c) => c.counties)
                .find((ct) => ct.name === value)
              setSubCountyOptions(found ? found.subCounties : [])
            }}
          >
            <SelectTrigger className={errors.county ? "border-red-500" : ""}>
              <SelectValue placeholder="County" />
            </SelectTrigger>
            <SelectContent>
              {countyOptions.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.county && <p className="text-sm text-red-500 mt-1">{errors.county}</p>}
        </div>

        <div>
          <Label>Sub County *</Label>
          <Select value={data.subCounty} onValueChange={(value) => onUpdate({ subCounty: value })}>
            <SelectTrigger className={errors.subCounty ? "border-red-500" : ""}>
              <SelectValue placeholder="Sub County" />
            </SelectTrigger>
            <SelectContent>
              {subCountyOptions.map((subCounty) => (
                <SelectItem key={subCounty} value={subCounty}>
                  {subCounty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subCounty && <p className="text-sm text-red-500 mt-1">{errors.subCounty}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="address">Street Address *</Label>
        <Textarea
          id="address"
          value={data.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
          placeholder="Building name, street name, landmarks..."
          rows={3}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
      </div>

      {/* <div className="pt-2">
        <Label className="text-sm font-medium">Set Location on Map</Label>
        <p className="text-sm text-gray-500 mb-2">Use the map to pin your precise location (recommended).</p>
        <div className="flex gap-2">
          <Button type="button" variant={showMap ? "destructive" : "outline"} onClick={() => setShowMap((s) => !s)}>
            {showMap ? "Hide Map" : "Open Map"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setShowMap(true)}>
            Center Map
          </Button>
        </div>
      </div>

      {showMap && (
        <div className="mt-4">
          <MapLocationForm data={data} onUpdate={onUpdate} onNext={onNext} onPrevious={onPrevious} />
        </div>
      )} */}

      <div>
        <Label htmlFor="pin">PIN/Postal Code</Label>
        <Input id="pin" value={data.pin} onChange={(e) => onUpdate({ pin: e.target.value })} placeholder="Optional" />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onPrevious} className="flex-1 bg-transparent">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  )
}

"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, Navigation } from "lucide-react"
import type { BusinessData } from "../page"

interface MapLocationFormProps {
  data: BusinessData
  onUpdate: (data: Partial<BusinessData>) => void
  onNext: () => void
  onPrevious: () => void
}

// We'll use Leaflet + OpenStreetMap (no API key required) and Nominatim for search/reverse geocoding
export default function MapLocationForm({ data, onUpdate, onNext, onPrevious }: MapLocationFormProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletRef = useRef<any | null>(null)
  const markerRef = useRef<any | null>(null)

  // Load Leaflet CSS and script
  useEffect(() => {
    if ((window as any).L) {
      initMap()
      return
    }

    const css = document.createElement("link")
    css.rel = "stylesheet"
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(css)

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => initMap()
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
      if (css.parentNode) css.parentNode.removeChild(css)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initMap = () => {
    const L = (window as any).L
    if (!L || !mapRef.current) return

    const defaultCenter = data.coordinates || { lat: -1.286389, lng: 36.817223 }

    // create map
    leafletRef.current = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], 14)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletRef.current)

    // marker
    markerRef.current = L.marker([defaultCenter.lat, defaultCenter.lng], { draggable: true }).addTo(leafletRef.current)

    markerRef.current.on("dragend", async () => {
      const pos = markerRef.current.getLatLng()
      await handlePlaceSelected(pos.lat, pos.lng)
    })

    leafletRef.current.on("click", async (e: any) => {
      const { lat, lng } = e.latlng
      markerRef.current.setLatLng([lat, lng])
      await handlePlaceSelected(lat, lng)
    })
  }

  const handlePlaceSelected = async (lat: number, lng: number) => {
    try {
      setLoading(true)
      // Use Nominatim reverse geocoding
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      if (!res.ok) throw new Error("Reverse geocode failed")
      const json = await res.json()

      onUpdate({
        coordinates: { lat, lng },
        formattedAddress: json.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        placeId: json.place_id ? String(json.place_id) : undefined,
      })
    } catch (err) {
      console.error("Reverse geocode error:", err)
      onUpdate({
        coordinates: { lat, lng },
        formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        placeId: undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    try {
      setLoading(true)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=5`)
      if (!res.ok) throw new Error("Search failed")
      const results = await res.json()
      if (results && results.length > 0) {
        const place = results[0]
        const lat = parseFloat(place.lat)
        const lon = parseFloat(place.lon)
        if (leafletRef.current) {
          leafletRef.current.setView([lat, lon], 16)
          markerRef.current.setLatLng([lat, lon])
        }
        await handlePlaceSelected(lat, lon)
      }
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      if (leafletRef.current) {
        leafletRef.current.setView([lat, lng], 16)
        markerRef.current.setLatLng([lat, lng])
      }
      await handlePlaceSelected(lat, lng)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Search for your business location</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter address or place name"
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button type="button" onClick={handleSearch} size="sm">
            Search
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button type="button" variant="outline" onClick={useCurrentLocation} className="flex items-center gap-2 bg-transparent" size="sm">
          <Navigation className="h-4 w-4" />
          Use My Current Location
        </Button>
      </div>

      <Card className="border-2 border-gray-200">
        <CardContent className="p-0">
          <div className="relative">
            <div ref={mapRef} className="w-full h-64 rounded-lg" />
            {loading && (
              <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Updating location...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {data.coordinates && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900 text-sm">Selected Location:</p>
              <p className="text-green-700 text-xs">{data.formattedAddress || `${data.coordinates.lat.toFixed(6)}, ${data.coordinates.lng.toFixed(6)}`}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-medium text-blue-900 text-sm mb-1">How to set your location:</h4>
        <ul className="text-blue-700 text-xs space-y-1">
          <li>• Search for your business or address above</li>
          <li>• Click anywhere on the map to place marker</li>
          <li>• Drag the marker to fine-tune position</li>
          <li>• Use "Current Location" if you're at your business</li>
        </ul>
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

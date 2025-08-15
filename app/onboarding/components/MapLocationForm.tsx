"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
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

// Google Maps types
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function MapLocationForm({ data, onUpdate, onNext, onPrevious }: MapLocationFormProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isMapReady, setIsMapReady] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerInstance = useRef<any>(null)
  const searchBoxInstance = useRef<any>(null)

  // Initialize Google Maps
  const initializeMap = useCallback(() => {
    if (!window.google || !mapRef.current) return

    const defaultCenter = data.coordinates || currentPosition || { lat: -1.286389, lng: 36.817223 } // Nairobi, Kenya

    // Create map
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    // Create marker
    markerInstance.current = new window.google.maps.Marker({
      position: defaultCenter,
      map: mapInstance.current,
      draggable: true,
      title: "Drag to set your business location",
    })

    // Handle marker drag
    markerInstance.current.addListener("dragend", () => {
      const position = markerInstance.current.getPosition()
      const lat = position.lat()
      const lng = position.lng()

      // Reverse geocoding to get address
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
        if (status === "OK" && results[0]) {
          onUpdate({
            coordinates: { lat, lng },
            formattedAddress: results[0].formatted_address,
            placeId: results[0].place_id,
          })
        } else {
          onUpdate({
            coordinates: { lat, lng },
            formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            placeId: "",
          })
        }
      })
    })

    // Handle map click
    mapInstance.current.addListener("click", (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()

      markerInstance.current.setPosition({ lat, lng })

      // Reverse geocoding
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
        if (status === "OK" && results[0]) {
          onUpdate({
            coordinates: { lat, lng },
            formattedAddress: results[0].formatted_address,
            placeId: results[0].place_id,
          })
        }
      })
    })

    setIsMapReady(true)
    setIsLoading(false)
  }, [data.coordinates, currentPosition, onUpdate])

  // Load Google Maps script
  useEffect(() => {
    if (window.google) {
      initializeMap()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`
    script.async = true
    script.defer = true

    window.initMap = initializeMap

    script.onload = () => {
      if (window.google) {
        initializeMap()
      }
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script)
      }
    }
  }, [initializeMap])

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Geolocation error:", error)
        },
      )
    }
  }, [])

  // Search functionality
  const handleSearch = () => {
    if (!window.google || !mapInstance.current || !searchQuery.trim()) return

    const service = new window.google.maps.places.PlacesService(mapInstance.current)
    const request = {
      query: searchQuery,
      fields: ["name", "geometry", "formatted_address", "place_id"],
    }

    service.textSearch(request, (results: any[], status: string) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const place = results[0]
        const location = place.geometry.location

        mapInstance.current.setCenter(location)
        mapInstance.current.setZoom(17)
        markerInstance.current.setPosition(location)

        onUpdate({
          coordinates: { lat: location.lat(), lng: location.lng() },
          formattedAddress: place.formatted_address,
          placeId: place.place_id,
        })
      }
    })
  }

  // Use current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          if (mapInstance.current && markerInstance.current) {
            mapInstance.current.setCenter({ lat, lng })
            mapInstance.current.setZoom(17)
            markerInstance.current.setPosition({ lat, lng })

            // Reverse geocoding
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
              if (status === "OK" && results[0]) {
                onUpdate({
                  coordinates: { lat, lng },
                  formattedAddress: results[0].formatted_address,
                  placeId: results[0].place_id,
                })
              }
            })
          }
        },
        (error) => {
          console.error("Error getting current location:", error)
        },
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.coordinates) {
      onNext()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Search Box */}
      <div className="space-y-2">
        <Label>Search for your business location</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your business name or address..."
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button type="button" onClick={handleSearch} size="sm">
            Search
          </Button>
        </div>
      </div>

      {/* Current Location Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={useCurrentLocation}
          className="flex items-center gap-2 bg-transparent"
          size="sm"
        >
          <Navigation className="h-4 w-4" />
          Use My Current Location
        </Button>
      </div>

      {/* Map Container */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-0">
          <div className="relative">
            <div ref={mapRef} className="w-full h-64 rounded-lg" />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Location Display */}
      {data.coordinates && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900 text-sm">Selected Location:</p>
              <p className="text-green-700 text-xs">
                {data.formattedAddress || `${data.coordinates.lat.toFixed(6)}, ${data.coordinates.lng.toFixed(6)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-medium text-blue-900 text-sm mb-1">How to set your location:</h4>
        <ul className="text-blue-700 text-xs space-y-1">
          <li>• Search for your business or address above</li>
          <li>• Click anywhere on the map to place marker</li>
          <li>• Drag the red marker to fine-tune position</li>
          <li>• Use "Current Location" if you're at your business</li>
        </ul>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onPrevious} className="flex-1 bg-transparent">
          Back
        </Button>
        <Button type="submit" disabled={!data.coordinates} className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  )
}

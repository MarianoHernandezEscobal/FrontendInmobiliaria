import type React from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import type { LatLngTuple } from "leaflet"


const customIcon = L.divIcon({
  html: `    <svg
      width="48" height="48"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#056241"
      />
      <circle cx="12" cy="9" r="2.5" fill="#fff"/>
    </svg>`,
  className: "",
  iconSize: [36, 54],
  iconAnchor: [18, 54],
})

interface MapProps {
  position: [number, number] // This is a LatLngTuple
  onLocationChange?: (lat: number, lng: number) => void
}

const Map: React.FC<MapProps> = ({ position, onLocationChange }) => {
  // Ensure position is a valid LatLngTuple
  const mapPosition: LatLngTuple = position

  return (
    <MapContainer
      center={mapPosition}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="z-10"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={mapPosition} icon={customIcon}>
        <Popup>Selected location</Popup>
      </Marker>
      {onLocationChange && <MapClickHandler onLocationChange={onLocationChange} />}
    </MapContainer>
  )
}

// Component to handle map clicks if onLocationChange is provided
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default Map

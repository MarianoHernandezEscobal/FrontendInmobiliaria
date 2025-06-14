"use client"

import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { PropertyStatus, type Property } from "@/types/property"

interface MapComponentProps {
  properties: Property[]
  height: string
  center: [number, number]
  zoom: number
}

export default function MapComponent({ properties, height, center, zoom }: MapComponentProps) {
  // Arreglar el problema de los iconos de Leaflet
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [])

  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: "100%" }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {properties.map((property) => (
        <Marker key={property.id} position={[property.geoCoordinates.lat, property.geoCoordinates.lng]}>
          <Popup>
            <div className="p-1">
              <h3 className="font-medium text-sm">{property.title}</h3>
              <p className="text-primary font-bold text-sm mt-1">${property.price.toString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {property.type === "house" ? "Casa" : "Terreno"} •{" "}
                {property.status.includes(PropertyStatus.ForRent) ? "Alquiler" : "Venta"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}


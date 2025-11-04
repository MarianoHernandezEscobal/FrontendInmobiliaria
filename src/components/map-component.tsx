"use client"

import { useEffect } from "react"
import L from "leaflet"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet"
import { PropertyStatus, type Property } from "@/types/property"
import { useRouter } from "next/navigation"

const { BaseLayer } = LayersControl

interface MapComponentProps {
  properties: Property[]
  height: string
  center: [number, number]
  zoom: number
}

const officeIcon = L.divIcon({
  className: "",
  html: `
    <svg
      width="48" height="48"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#056241"
      />
      <circle cx="12" cy="9" r="2.5" fill="#fff"/>
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
})

const houseIcon = L.divIcon({
  className: "",
  html: `
    <svg
      width="48" height="48"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#02A0E6"
      />
      <circle cx="12" cy="9" r="2.5" fill="#fff"/>
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
})

export default function MapComponent({
  properties,
  height,
  center,
  zoom,
}: MapComponentProps) {
  const router = useRouter()

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconUrl: "/icons/house.png",
      iconAnchor: [19, 38],
      iconSize: [38, 38],
      shadowUrl: "",
    })
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%" }}
      scrollWheelZoom={true}
    >
      <LayersControl position="topright">
        {/* 🌍 Capa normal (OpenStreetMap) */}
        <BaseLayer checked name="Mapa">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        {/* 🛰️ Capa satelital (Esri) */}
        <BaseLayer name="Satelital">
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
      </LayersControl>

      {/* 📍 Oficina principal */}
      <Marker
        key="office"
        position={[-34.634527586625445, -54.161089900973295]}
        icon={officeIcon}
      >
        <Popup>
          <div className="p-4 min-w-[280px]">
            <h3 className="font-bold text-green-800 text-lg mb-2">
              Nuestra Inmobiliaria
            </h3>
            <img
              src="/logoColor.png"
              alt="logo inmobiliaria"
              className="h-24 w-full object-cover rounded-md mb-3"
            />
            <p className="text-sm text-gray-600 mb-2">Oficina Principal</p>
            <button
              onClick={() =>
                window.open(
                  "https://www.google.com/maps?q=-34.634527586625445,-54.161089900973295",
                  "_blank"
                )
              }
              className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
            >
              Visitar Oficina
            </button>
          </div>
        </Popup>
      </Marker>

      {/* 🏠 Propiedades */}
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.geoCoordinates.lat, property.geoCoordinates.lng]}
          icon={houseIcon}
        >
          <Popup>
            <div className="p-4 bg-white rounded-lg min-w-[200px] max-w-[220px]">
              <img
                src={property.imageSrc[0] || "/placeholder.svg"}
                alt={property.title}
                className="h-28 w-full object-cover rounded-md mb-2"
              />
              <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">
                {property.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {property.shortDescription}
              </p>
              <p className="text-primary font-bold text-xl mb-2">
                ${property.price.toLocaleString()}
              </p>
              <button
                onClick={() => router.push(`/propiedades/${property.id}`)}
                className="w-full bg-nav hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
              >
                Ver Detalles
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

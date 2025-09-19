"use client"

import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { PropertyStatus, type Property } from "@/types/property"
import { useRouter } from "next/navigation";

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
  iconSize: [32, 32],      // tamaño del SVG
  iconAnchor: [16, 32],    // punto que ‘pincha’ en el mapa
  popupAnchor: [0, -28],   // posición del popup relativo al icono
});
const houseIcon = L.divIcon({
  className: "", // quitamos estilos por defecto
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
  iconSize: [32, 32],      // tamaño del SVG
  iconAnchor: [16, 32],    // punto que ‘pincha’ en el mapa
  popupAnchor: [0, -28],   // posición del popup relativo al icono
});


export default function MapComponent({ properties, height, center, zoom }: MapComponentProps) {
  const router = useRouter();

  useEffect(() => {
    L.Icon.Default.mergeOptions({ 
      iconUrl: "/icons/house.png",
      iconAnchor: [19, 38],
      iconSize: [38, 38],
      shadowUrl: "",
    })
  }, [])

  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: "100%" }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker key={properties.length + 1} position={[-34.634527586625445, -54.161089900973295]} icon={officeIcon}>
        <Popup>
          <div className="p-4 min-w-[280px]">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-bold text-green-800 text-lg">Nuestra Inmobiliaria</h3>
            </div>

            <div className="relative overflow-hidden rounded-lg mb-4 ">
              <img src="/logoColor.png" alt="logo inmobiliaria" className="h-24 w-full object-cover" />
              <div className="absolute inset-0"></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Oficina Principal</span>
              </div>

              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm">Contáctanos aquí</span>
              </div>
            </div>

          <button
            onClick={() =>
              window.open(
                "https://www.google.com/maps?q=-34.634527586625445,-54.161089900973295",
                "_blank"
              )
            }
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Visitar Oficina
          </button>
          </div>
        </Popup>
      </Marker>

      {properties.map((property) => (
        <Marker key={property.id} position={[property.geoCoordinates.lat, property.geoCoordinates.lng]} icon={houseIcon}>
          <Popup>
            <div className="p-4 bg-white rounded-lg min-w-[200px] max-w-[220px]">
              <div className="relative overflow-hidden mb-1">
                <img
                  src={property.imageSrc[0] || "/placeholder.svg?height=200&width=300"}
                  alt={`${property.title} - Image 1`}
                  className="h-30 w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      property.status.includes(PropertyStatus.ForRent)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {property.status.includes(PropertyStatus.ForRent) ? "Alquiler" : "Venta"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{property.title}</h3>

                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{property.type === "house" ? "Casa" : "Terreno"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-primary">${property.price.toLocaleString()}</p>
                  {property.type === "house" && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 011 1h2a1 1 0 011-1v-2a1 1 0 001-1h2a1 1 0 001 1v2a1 1 0 011 1h2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span>{property.rooms || 3}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{property.bathrooms || 2}</span>
                      </div>
                    </div>
                  )}
                </div>

                {property.shortDescription && (
                  <p className="text-sm text-gray-600 line-clamp-2">{property.shortDescription}</p>
                )}
              </div>

              <button
                onClick={() => {
                  router.push(`/propiedades/${property.id}`);
                }}
                className="w-full mt-4 bg-nav hover:bg-primary/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Ver Detalles
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

"use client";

import { FC } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import { PropertyStatus } from "@/types/property";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";

const { BaseLayer } = LayersControl;

interface PropertyMapProps {
  property: Property;
}

// Icono SVG personalizado
const svgIcon = L.divIcon({
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
});

const PropertyMap: FC<PropertyMapProps> = ({ property }) => {
  const router = useRouter();

  return (
    <MapContainer
      center={[property.geoCoordinates.lat, property.geoCoordinates.lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
      className="z-0 rounded-xl overflow-hidden"
    >
      <LayersControl position="topright">
        {/* Capa base normal (OpenStreetMap) */}
        <BaseLayer checked name="Mapa estándar">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        {/* Capa base satelital (Esri World Imagery) */}
        <BaseLayer name="Vista satelital">
          <TileLayer
            attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
      </LayersControl>

      <Marker
        position={[property.geoCoordinates.lat, property.geoCoordinates.lng]}
        icon={svgIcon}
      >
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
                  {property.status.includes(PropertyStatus.ForRent)
                    ? "Alquiler"
                    : "Venta"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-900 leading-tight">
                {property.title}
              </h3>

              <div className="flex items-center text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">
                  {property.type === "house" ? "Casa" : "Terreno"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">
                  ${property.price.toLocaleString()}
                </p>
                {property.type === "house" && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 011 1h2a1 1 0 011-1v-2a1 1 0 001-1h2a1 1 0 001 1v2a1 1 0 011 1h2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span>{property.rooms || 3}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
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
                <p className="text-sm text-gray-600 line-clamp-2">
                  {property.shortDescription}
                </p>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default PropertyMap;

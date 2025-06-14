"use client";

import { FC } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  lat: number;
  lng: number;
  address: string;
}

// Definimos un icono SVG inline
const svgIcon = L.divIcon({
  className: "", // quitamos estilos por defecto
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

const PropertyMap: FC<PropertyMapProps> = ({ lat, lng, address }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={svgIcon}>
        <Popup>
          <div className="p-1">
            <p className="font-semibold">{address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default PropertyMap;

"use client";

import type React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import L, { LatLngTuple } from "leaflet";

const { BaseLayer } = LayersControl;

const customIcon = L.divIcon({
  html: `
    <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#056241"
      />
      <circle cx="12" cy="9" r="2.5" fill="#fff"/>
    </svg>`,
  className: "",
  iconSize: [36, 54],
  iconAnchor: [18, 54],
});

interface MapProps {
  position?: [number, number] | null;
  onLocationChange?: (lat: number, lng: number) => void;
}

const Map: React.FC<MapProps> = ({ position, onLocationChange }) => {
  // Si no hay posición o es inválida
  if (
    !position ||
    isNaN(position[0]) ||
    isNaN(position[1]) ||
    (position[0] === 0 && position[1] === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full border rounded-md text-gray-500">
        Ubicación no disponible
      </div>
    );
  }

  const mapPosition: LatLngTuple = position;

  return (
    <MapContainer
      center={mapPosition}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="z-10 rounded-md overflow-hidden"
      scrollWheelZoom={true}
    >
      {/* Control para cambiar entre vista estándar y satelital */}
      <LayersControl position="topright">
        <BaseLayer checked name="Mapa estándar">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        <BaseLayer name="Vista satelital">
          <TileLayer
            attribution='Imagery © <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>
      </LayersControl>

      {/* Marcador principal */}
      <Marker position={mapPosition} icon={customIcon}>
        <Popup>Ubicación seleccionada</Popup>
      </Marker>

      {/* Si el usuario puede seleccionar nueva ubicación */}
      {onLocationChange && (
        <MapClickHandler onLocationChange={onLocationChange} />
      )}
    </MapContainer>
  );
};

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default Map;

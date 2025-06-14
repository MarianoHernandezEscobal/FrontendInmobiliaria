"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Property } from "@/types/property";

const MapLoading = () => (
  <div className="w-full h-[500px] bg-muted/30 flex items-center justify-center rounded-lg">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const MapWithNoSSR = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: MapLoading,
});
interface SimplePropertyMapProps {
  properties: Property[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export default function SimplePropertyMap({
  properties,
  height = "600px",
  center = [-34.65, -54.16],
  zoom = 13,
}: SimplePropertyMapProps) {
  return (
    <div className="relative z-0 overflow-hidden shadow-lg border border-border">
      <MapWithNoSSR
        properties={properties}
        height={height}
        center={center}
        zoom={zoom}
      />
    </div>
  );
}

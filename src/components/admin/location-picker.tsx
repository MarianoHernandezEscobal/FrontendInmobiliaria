"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface LocationPickerProps {
  value: { lat: number; lng: number };
  onChange: (value: { lat: number; lng: number }) => void;
}

const DynamicMap = dynamic(() => import("./map"), { ssr: false });

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([
    value.lat,
    value.lng,
  ]);

  useEffect(() => {
    setPosition([value.lat, value.lng]);
  }, [value]);

  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onChange({ lat, lng });
  };

  return (
    <div className="relative h-[400px] w-full rounded-md border">
      <DynamicMap position={position} onLocationChange={handleLocationChange} />
    </div>
  );
}

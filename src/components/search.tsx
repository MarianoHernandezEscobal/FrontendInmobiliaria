"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PropertyTypeLabels } from "@/utils/type-label";
import { useFilters } from "@/context/filters-context";
import { useRouter } from "next/navigation";
import { Neighborhoods } from "@/types/property";
import { NeighborhoodLabels } from "@/utils/neighborhoods-labels";

export function SearchFilters() {
  const router = useRouter();
  const { filters, setFilters } = useFilters();
  const [expanded, setExpanded] = useState(false);

  const handleSearch = () => {
    router.push("/ventas");
  };

  return (
    <div className="bg-card shadow-md p-4 mb-4 rounded-none">
      {/* Sección principal: Ubicación y Tipo arriba del acordeón */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ubicación</label>
            <Select
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, location: value }))
              }
            >
              <SelectTrigger className="w-full p-4 rounded-none">
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquiera</SelectItem>
                {Object.values(Neighborhoods).map((type) => (
                  <SelectItem key={type} value={type}>
                    {NeighborhoodLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de propiedad</label>
            <Select
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="w-full p-4 rounded-none">
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquiera</SelectItem>
                {Object.entries(PropertyTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={handleSearch}
          className="mt-6 md:w-40 w-full bg-nav text-white text-base hover:bg-accent"
        >
          {<Search />}
          Buscar
        </Button>
      </div>

      {/* Filtros avanzados en acordeón */}
      <Accordion
        type="single"
        collapsible
        value={expanded ? "filters" : ""}
        onValueChange={(value) => setExpanded(value === "filters")}
      >
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="py-2 text-sm font-medium">
            Filtros avanzados
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dormitorios mín.</label>
                <Input
                  type="number"
                  className="rounded-none"
                  placeholder="Dormitorios mínimos"
                  value={filters.dormitoriosMin ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dormitoriosMin: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dormitorios máx.</label>
                <Input
                  type="number"
                  className="rounded-none"
                  placeholder="Dormitorios máximo"
                  value={filters.dormitoriosMax ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dormitoriosMax: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Baños mín.</label>
                <Input
                  type="number"
                  className="rounded-none"
                  placeholder="Baños mínimos"
                  value={filters.bathsMin ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bathsMin: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm rounded-none font-medium">
                  Baños máx.
                </label>
                <Input
                  type="number"
                  className="rounded-none"
                  placeholder="Baños máximos"
                  value={filters.bathsMax ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bathsMax: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Garaje</label>
                <Select
                  onValueChange={(value) =>{
                    setFilters((prev) => ({
                      ...prev,
                      garage: value === "any" ? undefined : value === "yes",
                    }))
                  }

                  }
                >
                  <SelectTrigger className="w-full p-4 rounded-none">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    <SelectItem value="yes">Con garaje</SelectItem>
                    <SelectItem value="no">Sin garaje</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Piscina</label>
                <Select
                  onValueChange={(value) =>{
                    setFilters((prev) => ({
                      ...prev,
                      pool: value === "any" ? undefined : value === "yes",
                    }))
                  }
                  }

                >
                  <SelectTrigger className="w-full p-4 rounded-none">
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    <SelectItem value="yes">Con piscina</SelectItem>
                    <SelectItem value="no">Sin piscina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Rango de precio</label>
                  <span className="text-sm text-muted-foreground">
                    ${filters.precioMin} - ${filters.precioMax}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={500000}
                  step={1000}
                  value={[
                    filters.precioMin,
                    filters.precioMax === Infinity
                      ? 1000000
                      : filters.precioMax,
                  ]}
                  onValueChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      precioMin: min,
                      precioMax: max,
                    }))
                  }
                  className="py-4"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">
                    Área construida (m²)
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {filters.areaMin} -{" "}
                    {filters.areaMax === Infinity ? "∞" : filters.areaMax} m²
                  </span>
                </div>
                <Slider
                  min={0}
                  max={2000}
                  step={100}
                  value={[
                    filters.areaMin,
                    filters.areaMax === Infinity ? 1000 : filters.areaMax,
                  ]}
                  onValueChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      areaMin: min,
                      areaMax: max,
                    }))
                  }
                  className="py-4"
                />
              </div>
            </div>
            <div className="relative w-full mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar una propiedad..."
                className="pl-10 w-full"
                value={filters.searchText}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchText: e.target.value,
                  }))
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

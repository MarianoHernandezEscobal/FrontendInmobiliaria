import React, { useState } from "react";
import { useFilters } from "@/context/filters-context";
import { Neighborhoods, PropertyTypes } from "@/types/property";
import { PropertyTypeLabels } from "@/utils/type-label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Filters } from "@/types/filters";
import { NeighborhoodLabels } from "@/utils/neighborhoods-labels";

const AsideSearch = () => {
  const { filters, setFilters } = useFilters();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const update = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="lg:block w-full lg:w-64">
      {/* Mobile button */}
      <div className="block lg:hidden mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="p-2">
              <FilterPanel
                expanded={expanded}
                setExpanded={setExpanded}
                update={update}
                filters={filters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop filters */}
      <aside className="hidden lg:block p-4 text-sm space-y-4">
        <FilterPanel
          expanded={expanded}
          setExpanded={setExpanded}
          update={update}
          filters={filters}
        />
      </aside>
    </div>
  );
};

interface FilterPanelProps {
  expanded: string[];
  setExpanded: (value: string[]) => void;
  update: (field: string, value: any) => void;
  filters: Filters;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  expanded,
  setExpanded,
  update,
  filters,
}) => (
  <Accordion
    type="multiple"
    value={expanded}
    onValueChange={setExpanded}
    className="space-y-2"
  >
    <AccordionItem value="ubicacion" className="border-none">
      <AccordionTrigger className="text-sm font-medium">
        Ubicación
      </AccordionTrigger>
      <AccordionContent>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => update("location", "")}
              className={`hover:underline ${
                !filters.location ? "text-green-500" : ""
              }`}
            >
              Cualquiera
            </button>
          </li>

            {Object.values(Neighborhoods).map((type) => (
            <li key={type}>
              <button
              onClick={() => update("location", type.toLowerCase())}
              className={`hover:underline ${
                filters.location === type.toLowerCase() ? "text-green-500" : ""
              }`}
              >
              {NeighborhoodLabels[type]}
              </button>
            </li>
            ))}
        </ul>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="tipo" className="border-none">
      <AccordionTrigger className="text-sm font-medium">
        Tipo de propiedad
      </AccordionTrigger>
      <AccordionContent>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => update("type", "")}
              className={`hover:underline ${
                !filters.type ? "text-green-500" : ""
              }`}
            >
              Cualquiera
            </button>
          </li>
          {Object.values(PropertyTypes).map((type) => (
            <li key={type}>
              <button
                onClick={() => update("type", type)}
                className={`hover:underline ${
                  filters.type === type ? "text-green-500" : ""
                }`}
              >
                {PropertyTypeLabels[type]}
              </button>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
    {filters.type !== "land" && (
      <div className="mt-4">
        <p className="font-semibold mb-2">Dormitorios</p>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Mínimo"
            className="p-2 border rounded w-1/2"
            value={filters.dormitoriosMin || ""}
            onChange={(e) =>
              update("dormitoriosMin", parseInt(e.target.value) || 0)
            }
          />
          <input
            type="number"
            placeholder="Máximo"
            className="p-2 border rounded w-1/2"
            value={
              filters.dormitoriosMax !== Infinity ? filters.dormitoriosMax : ""
            }
            onChange={(e) =>
              update("dormitoriosMax", parseInt(e.target.value) || Infinity)
            }
          />
        </div>
      </div>
    )}
    {filters.type !== "land" && (
      <div className="mt-4">
        <p className="font-semibold mb-2">Baños</p>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Mínimo"
            className="p-2 border rounded w-1/2"
            value={filters.bathsMin || ""}
            onChange={(e) => update("bathsMin", parseInt(e.target.value) || 0)}
          />
          <input
            type="number"
            placeholder="Máximo"
            className="p-2 border rounded w-1/2"
            value={filters.bathsMax !== Infinity ? filters.bathsMax : ""}
            onChange={(e) =>
              update("bathsMax", parseInt(e.target.value) || Infinity)
            }
          />
        </div>
      </div>
    )}

    {filters.type !== "land" && (
      <div className="mt-4">
        <p className="font-semibold mb-2">Área construida (m²)</p>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Mínimo"
            className="p-2 border rounded w-1/2"
            value={filters.areaMin || ""}
            onChange={(e) => update("areaMin", parseInt(e.target.value) || 0)}
          />
          <input
            type="number"
            placeholder="Máximo"
            className="p-2 border rounded w-1/2"
            value={filters.areaMax !== Infinity ? filters.areaMax : ""}
            onChange={(e) =>
              update("areaMax", parseInt(e.target.value) || Infinity)
            }
          />
        </div>
      </div>
    )}

    {/* Area Terreno */}
    <div className="mt-4">
      <p className="font-semibold mb-2">Área terreno (m²)</p>
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Mínimo"
          className="p-2 border rounded w-1/2"
          value={filters.areaLandMin || ""}
          onChange={(e) => update("areaLandMin", parseInt(e.target.value) || 0)}
        />
        <input
          type="number"
          placeholder="Máximo"
          className="p-2 border rounded w-1/2"
          value={filters.areaLandMax !== Infinity ? filters.areaLandMax : ""}
          onChange={(e) =>
            update("areaLandMax", parseInt(e.target.value) || Infinity)
          }
        />
      </div>
    </div>

    {/* Precio */}

    <div className="mt-4">
      <p className="font-semibold mb-2">Precio</p>
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Mínimo"
          className="p-2 border rounded w-1/2"
          value={filters.precioMin || ""}
          onChange={(e) => update("precioMin", parseInt(e.target.value) || 0)}
        />
        <input
          type="number"
          placeholder="Máximo"
          className="p-2 border rounded w-1/2"
          value={filters.precioMax !== Infinity ? filters.precioMax : ""}
          onChange={(e) =>
            update("precioMax", parseInt(e.target.value) || Infinity)
          }
        />
      </div>
    </div>
    {filters.type !== "land" && (
      <AccordionItem value="extras" className="border-none">
        <AccordionTrigger className="text-sm font-medium">
          Extras
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => update("garage", !filters.garage)}
                className={`hover:underline ${
                  filters.garage ? "text-green-500" : ""
                }`}
              >
                Garaje
              </button>
            </li>
            <li>
              <button
                onClick={() => update("pool", !filters.pool)}
                className={`hover:underline ${
                  filters.pool ? "text-green-500" : ""
                }`}
              >
                Piscina
              </button>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    )}
  </Accordion>
);

export default AsideSearch;

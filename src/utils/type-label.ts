import { PropertyTypes } from "@/types/property";

export const PropertyTypeLabels: Record<PropertyTypes, string> = {
    [PropertyTypes.HOUSE]: 'Casa',
    [PropertyTypes.APARTMENT]: 'Apartamento',
    [PropertyTypes.LAND]: 'Terreno',
    [PropertyTypes.OFFICE]: 'Oficina',
    [PropertyTypes.STORE]: 'Local comercial',
    [PropertyTypes.OTHER]: 'Otro',
  };
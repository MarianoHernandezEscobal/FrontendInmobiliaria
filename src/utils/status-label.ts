import { PropertyStatus } from "@/types/property";

export const PropertyStatusLabels: Record<PropertyStatus, string> = {
    [PropertyStatus.ForSale]: 'En venta',
    [PropertyStatus.ForRent]: 'En alquiler',
    [PropertyStatus.Sold]: 'Vendida',
    [PropertyStatus.Rented]: 'Alquilada',
    [PropertyStatus.UnderConstruction]: 'En construcción',
    [PropertyStatus.Reserved]: 'Reservada',
  };
  
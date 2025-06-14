import { Property, PropertyStatus } from "@/types/property";

export function extractFeatures(property: Property): string[] {
  const features: string[] = [];
  
  // Add property type
  features.push(property.type === "house" ? "Casa" : "Terreno");
  
  if (property.pool) {
    features.push("Piscina");
  }
  
  if (property.garage) {
    features.push("Garage");
  }
  
  // Add year built if available
  if (property.yearBuilt) {
    features.push(`Construido: ${property.yearBuilt}`);
  }
  
  // Add neighborhood
  if (property.neighborhood) {
    const formattedNeighborhood = property.neighborhood
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    features.push(formattedNeighborhood);
  }
  
  return features;
}

export function formatPrice(price: number, status: string[]): string {
  if (status.includes(PropertyStatus.ForRent)) {
    return `$${price}/día`;
  } else {
    return `${price.toString()}`;
  }
}

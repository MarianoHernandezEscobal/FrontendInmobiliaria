import { useState } from "react";
import Link from "next/link";
import {
  Bath,
  Bed,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property, PropertyStatus } from "@/types/property";
import { extractFeatures, formatPrice } from "@/utils/property-utils";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProperty } from "@/service/properties";
import { useProperties } from "@/context/property-context";
import { toast } from "sonner";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const features = extractFeatures(property);
  const formattedPrice = formatPrice(property.price, property.status);
  const { user, token } = useUser();
  const router = useRouter();
  const { reloadProperties } = useProperties();

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < property.imageSrc.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(property.imageSrc.length - 1);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/propiedades/actualizar/${property.id}`)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (!token) {
      router.push('/');
      return;
    }
  
    try {
      await deleteProperty(property.id, token);
      localStorage.removeItem('AllProperties')
      localStorage.removeItem('Home')
      reloadProperties()
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      toast.error('Error al eliminar propiedad');
    }
  }
  

  return (
    <Link href={`/propiedades/${property.id}`} className="block">
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
        <div className="relative">
          <div className="relative h-[270px] w-full overflow-hidden">
            <img
              src={
                property.imageSrc[currentImageIndex] ||
                "/placeholder.svg?height=300&width=500"
              }
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
            />

            {property.imageSrc.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {property.imageSrc.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <Badge
            className="absolute left-3 top-3"
            variant={
              property.status.includes(PropertyStatus.ForRent)
                ? "secondary"
                : "default"
            }
          >
            {property.status.includes(PropertyStatus.ForRent)
              ? "Alquiler"
              : "Venta"}
          </Badge>

          {property.pinned && (
            <Badge className="absolute right-3 top-3" variant="destructive">
              Destacado
            </Badge>
          )}
          {user && user.admin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={
                    `absolute right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-gray-100 z-20 ${property.pinned ? "top-10" : "top-2"}`
                  }
                  aria-label="Opciones de propiedad"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Eliminar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <CardContent className="p-4">
          <div className="mb-2 flex items-center capitalize text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{property.address}</span>
          </div>

          <h3 className="mb-2 line-clamp-1 text-xl font-semibold">
            {property.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {property.shortDescription}
          </p>

          <div className="mb-3 text-xl font-bold text-primary">
            USD {formattedPrice}
          </div>

          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {features.map((feature, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-primary/5 whitespace-nowrap text-xs"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4">
          <div className="flex items-center gap-4">
            {property.type === "house" && property.rooms !== undefined && (
              <div className="flex items-center text-sm">
                <Bed className="mr-1 h-4 w-4" />
                <span>
                  {property.rooms} {property.rooms === 1 ? "Dorm" : "Dorms"}
                </span>
              </div>
            )}

            {property.type === "house" && property.bathrooms !== undefined && (
              <div className="flex items-center text-sm">
                <Bath className="mr-1 h-4 w-4" />
                <span>
                  {property.bathrooms}{" "}
                  {property.bathrooms === 1 ? "Baño" : "Baños"}
                </span>
              </div>
            )}

            {property.type === "house" && property.area && (
              <div className="flex items-center text-sm">
                <Maximize2 className="mr-1 h-4 w-4" />
                <span>{property.area} m²</span>
              </div>
            )}
            {property.lotSize && (
              <div className="flex items-center text-sm">
                <Maximize2 className="mr-1 h-4 w-4" />
                <span>{property.lotSize} m²</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

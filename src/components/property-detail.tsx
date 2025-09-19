"use client";

import { useEffect, useState } from "react";
import {
  Bath,
  Bed,
  Building,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Expand,
  Home,
  MapPin,
  Maximize2,
  WavesLadder,
  Ruler,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type Property,
  PropertyStatus,
  type PropertyTypes,
} from "@/types/property";
import { formatPrice } from "@/utils/property-utils";
import PropertyMap from "@/components/property-map";
import ContactForm from "@/components/contact-form";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { NeighborhoodLabels } from "@/utils/neighborhoods-labels";

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [features, setFeatures] = useState<
    { title: string; values: [{ title: string; value: string }] }[]
  >([]);

  const formattedPrice = formatPrice(property.price, property.status);

  useEffect(() => {
    if (property.features.length > 0) {
      const parsedFeatures = JSON.parse(property.features);
      setFeatures(parsedFeatures);
    }
  }, []);

  const nextImage = () => {
    if (currentImageIndex < property.imageSrc.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(property.imageSrc.length - 1);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const getPropertyTypeLabel = (type: PropertyTypes) => {
    const types = {
      house: "Casa",
      apartment: "Apartamento",
      land: "Terreno",
      office: "Oficina",
      store: "Local Comercial",
      other: "Otro",
    };
    return types[type] || "Propiedad";
  };

  const getStatusLabel = (status: PropertyStatus[]) => {
    if (status.includes(PropertyStatus.ForRent)) return "En Alquiler";
    if (status.includes(PropertyStatus.ForSale)) return "En Venta";
    if (status.includes(PropertyStatus.Sold)) return "Vendido";
    if (status.includes(PropertyStatus.Rented)) return "Alquilado";
    if (status.includes(PropertyStatus.UnderConstruction))
      return "En Construcción";
    if (status.includes(PropertyStatus.Reserved)) return "Reservado";
    return "Disponible";
  };

  return (
    <div className="container nav_padding mx-auto px-4 py-8">
      {/* Título y ubicación */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <div className="mt-2 flex items-center text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>
            {property.address}, {NeighborhoodLabels[property.neighborhood]}
          </span>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-lg">
          {/* Imagen principal */}
          <div className="relative h-[400px] md:h-[500px] w-full">
            <img
              src={property.imageSrc[currentImageIndex] || "/placeholder.svg"}
              alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
            />

            {/* Controles de navegación */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Botón para ver todas las imágenes */}
            <button
              onClick={() => setShowAllImages(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md bg-black/70 px-3 py-2 text-sm text-white hover:bg-black/90"
            >
              <Expand className="h-4 w-4" />
              Ver todas las fotos
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-4 flex gap-1.5">
              {property.imageSrc.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-row gap-2">
              <Badge
                variant={
                  property.status.includes(PropertyStatus.ForRent)
                    ? "secondary"
                    : "default"
                }
                className="text-sm"
              >
                {getStatusLabel(property.status)}
              </Badge>
              
              {property.pinned && (
                <Badge variant="destructive" className="text-sm">
                  Destacado
                </Badge>
              )}
            </div>
          </div>
        </div>

        {showAllImages && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <button
              onClick={() => setShowAllImages(false)}
              className="absolute top-4 right-4 z-50 text-white hover:text-red-400 text-3xl font-bold"
            >
              &times;
            </button>

            <div className="relative max-w-5xl w-full px-4">
              <button
                onClick={prevImage}
                className="absolute left-0 top-1/2 z-50 -translate-y-1/2 text-white hover:text-primary"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <img
                src={property.imageSrc[currentImageIndex]}
                alt={`Imagen ampliada ${currentImageIndex + 1}`}
                className="mx-auto max-h-[80vh] w-full object-contain rounded"
              />
              <button
                onClick={nextImage}
                className="absolute right-0 top-1/2 z-50 -translate-y-1/2 text-white hover:text-primary"
              >
                <ChevronRight className="h-10 w-10" />
              </button>

              {/* Miniaturas abajo en el modal */}
              <div className="mt-6 flex justify-center gap-2 overflow-x-auto">
                {property.imageSrc.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`h-16 w-24 overflow-hidden rounded-md border ${
                      index === currentImageIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Miniatura ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Miniaturas */}
        <div className="mt-4 relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="p-2">
              {property.imageSrc.map((src, index) => (
                <CarouselItem key={index} className="basis-1/5">
                  <button
                    onClick={() => selectImage(index)}
                    className={`h-20 w-full overflow-hidden rounded-md ${
                      index === currentImageIndex
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                  >
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`${property.title} - Miniatura ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Columna izquierda y central (2/3) */}
        <div className="md:col-span-2 space-y-8">
          {/* Información básica */}
          <Card className="border-none shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">USD {formattedPrice}</h2>
                </div>

                <div className="flex flex-wrap gap-6">
                  {typeof property.rooms === "number" && property.rooms > 1 && (
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Bed className="h-5 w-5 text-primary" />
                      </div>
                      <span className="mt-1 text-sm font-medium">
                        {property.rooms}{" "}
                        {property.rooms === 1 ? "Dormitorio" : "Dormitorios"}
                      </span>
                    </div>
                  )}
                  {typeof property.bathrooms === "number" &&
                    property.bathrooms > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Bath className="h-5 w-5 text-primary" />
                        </div>
                        <span className="mt-1 text-sm font-medium">
                          {property.bathrooms}{" "}
                          {property.bathrooms === 1 ? "Baño" : "Baños"}
                        </span>
                      </div>
                    )}
                  {typeof property.area === "number" && property.area > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Maximize2 className="h-5 w-5 text-primary" />
                      </div>
                      <span className="mt-1 text-sm font-medium">
                        {property.area} m²
                      </span>
                    </div>
                  )}

                  {typeof property.lotSize === "number" &&
                    property.lotSize > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Ruler className="h-5 w-5 text-primary" />
                        </div>
                        <span className="mt-1 text-sm font-medium">
                          {property.lotSize} m² terreno
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de información */}
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="features">Características</TabsTrigger>
              <TabsTrigger value="location">Ubicación</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle>Descripción de la propiedad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>{property.longDescription}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
            <CardHeader className="mb-4">
                  <CardTitle>Características y comodidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      <span>Tipo: {getPropertyTypeLabel(property.type)}</span>
                    </div>

                    {typeof property.yearBuilt === "number" &&
                      property.yearBuilt > 0 && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>Año de construcción: {property.yearBuilt}</span>
                        </div>
                      )}

                    {property.garage && (
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        <span>Garage</span>
                      </div>
                    )}

                    {property.pool && (
                      <div className="flex items-center gap-2">
                        <WavesLadder className="h-5 w-5 text-primary" />
                        <span>Piscina</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      <span>Estado: {getStatusLabel(property.status)}</span>
                    </div>

                    {typeof property.area === "number" && property.area > 0 && (
                      <div className="flex items-center gap-2">
                        <Maximize2 className="h-5 w-5 text-primary" />
                        <span>Área construida: {property.area} m²</span>
                      </div>
                    )}

                    {typeof property.lotSize === "number" &&
                      property.lotSize > 0 && (
                        <div className="flex items-center gap-2">
                          <Ruler className="h-5 w-5 text-primary" />
                          <span>Tamaño del terreno: {property.lotSize} m²</span>
                        </div>
                      )}
                  </div>
                </CardContent>
              <Card className="border-none shadow-none mt-6">
                {property.features &&
                  property.features.length > 0 &&
                  features.map((feature, index) => (
                    <div key={index} className="mb-4">
                      <CardHeader className="mb-4">
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {feature.values.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="font-bold">{item.title}:</span>{" "}
                              {item.value}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  ))}
              </Card>
            </TabsContent>

            <TabsContent value="location" className="mt-6">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle>Ubicación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-primary" />
                      {property.address}, {NeighborhoodLabels[property.neighborhood]}
                    </p>
                  </div>
                  <div className="h-[400px] w-full overflow-hidden rounded-lg">
                    <PropertyMap
                      property={property}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Columna derecha (1/3) */}
        <div className="space-y-6">
          {/* Formulario de contacto */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle>¿Te interesa esta propiedad?</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

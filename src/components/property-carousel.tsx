"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import PropertyCard from "./property-card"
import { Property } from "@/types/property"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertyCarouselProps {
  properties: Property[]
}

export function PropertyCarousel({ properties }: PropertyCarouselProps) {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {properties.map((property) => (
            <CarouselItem key={property.id} className="pl-1 basis-full md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <PropertyCard property={property} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious icon={<ChevronLeft className="w-10 h-10 text-nav" />}  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:bg-background/80 sm:backdrop-blur-sm sm:border-2 border-none sm:border sm:border-primary/20 hover:bg-accent hover:border-primary/50  sm:flex" />
        <CarouselNext icon={<ChevronRight className="w-10 h-10 text-nav" />} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:bg-background/80 sm:backdrop-blur-sm sm:border-2 border-none sm:border sm:border-primary/20 hover:bg-accent hover:border-primary/50 sm:flex" />
      </Carousel>
    </div>
  )
}


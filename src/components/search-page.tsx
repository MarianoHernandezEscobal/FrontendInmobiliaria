'use client'

import { useProperties } from '@/context/property-context'
import PropertyCard from '@/components/property-card'
import AsideSearch from '@/components/aside'
import { SimpleTitle } from '@/components/simple-title'
import { useFilters } from '@/context/filters-context'
import { OrderSelect } from './order-filter'
import { useMemo } from "react"

export default function SearchPageContent() {
  const { allProperties } = useProperties()
  const { filters } = useFilters()

  const filteredProperties = useMemo(() => {
    const filtered = allProperties.filter((property) => {
      let matchesText = true
      if(filters.searchText !== ''){
        matchesText =
        property.title.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        property.shortDescription?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        property.longDescription?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        property.neighborhood.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        property.type.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        property.status.some((status) =>
          status.toLowerCase().includes(filters.searchText.toLowerCase())
        ) ||
        property.id.toString().includes(filters.searchText)
      }


      const matchesLocation =
        filters.location === 'cualquiera' ||
        filters.location === '' ||
        property.neighborhood.toLowerCase() === filters.location.toLowerCase()

      const matchesType = !filters.type || filters.type === 'any' || property.type === filters.type
      const matchesDormitorios =
        (property.rooms ?? 0) >= filters.dormitoriosMin && (property.rooms ?? 0) <= filters.dormitoriosMax
      const matchesBaths =
        (property.bathrooms ?? 0) >= filters.bathsMin && (property.bathrooms ?? 0) <= filters.bathsMax
        const matchesGarage = filters.garage === undefined || property.garage === filters.garage
        const matchesPool = filters.pool === undefined || property.pool === filters.pool
      const matchesPrice = property.price >= filters.precioMin && property.price <= filters.precioMax
      const matchesArea = (property.area ?? 0) >= filters.areaMin && (property.area ?? 0) <= filters.areaMax

      return (
        matchesText &&
        matchesLocation &&
        matchesType &&
        matchesDormitorios &&
        matchesBaths &&
        matchesGarage &&
        matchesPool &&
        matchesPrice &&
        matchesArea
      )
    })

    // Ordenamiento
    switch (filters.orderBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price)
      case 'date-asc':
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'date-desc':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'area-desc':
        return filtered.sort((a, b) => (b.area ?? 0) - (a.area ?? 0))
      case 'area-asc':
        return filtered.sort((a, b) => (a.area ?? 0) - (b.area ?? 0))
      default:
        return filtered
    }
  }, [allProperties, filters])

  

  return (
    <div className="container mx-auto p-4 nav_padding">
      <SimpleTitle title="Ventas" />
      <div className="w-full flex justify-end mb-4">
        <OrderSelect />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">

        <AsideSearch />
        
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron propiedades que coincidan con tu búsqueda</p>
          </div>          )}
        </section>
      </div>
    </div>
  )
}

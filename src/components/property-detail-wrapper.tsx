'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import PropertyDetail from '@/components/property-detail'
import { useProperties } from '@/context/property-context'
import { Property } from '@/types/property'
import Loading from '@/app/propiedades/[id]/loading'
import { GetPropertyById } from '@/service/properties'

export default function PropertyDetailWrapper() {
  const params = useParams()
  const id = Number(params?.id)
  const { allProperties, reloadProperties } = useProperties()
  const [isLoading, setIsLoading] = useState(true)
  const [property, setProperty] = useState<Property | null>(null)

  useEffect(() => {
    const loadProperty = async () => {
      let found = allProperties.find((p) => p.id === id) || null

      if (!found) {
        if (allProperties.length === 0) {
          await reloadProperties()
          found = allProperties.find((p) => p.id === id) || null
        }

        if (!found) {
          try {
            found = await GetPropertyById(id)
            if (!found) {
              notFound()
              return
            }
          } catch (error) {
            console.error('Error cargando propiedad por ID:', error)
            notFound()
            return
          }
        }
      }

      setProperty(found)
      setIsLoading(false)
    }

    loadProperty()
  }, [id])

  if (isLoading || !property) {
    return (
      <div className="flex w-full items-center justify-center text-muted-foreground">
        <Loading />
      </div>
    )
  }

  return <PropertyDetail property={property} />
}

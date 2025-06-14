'use client'

import { GetAllProperties, GetHomeProperties } from '@/service/properties'
import { Home } from '@/types/home'
import { Property } from '@/types/property'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type PropertyContextType = {
  allProperties: Property[]
  homeProperties: Home
  loading: boolean
  reloadProperties: () => Promise<void>
  setAllProperties: (properties: Property[]) => void
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [homeProperties, setHomeProperties] = useState<Home>({
    properties: [],
    land: [],
    pinned: [],
  })
  const [loading, setLoading] = useState(true)

  const fetchProperties = async () => {
    try {
      setLoading(true)

      const storedProperties = localStorage.getItem('AllProperties')
      const storedHome = localStorage.getItem('Home')

      if (storedProperties) {
        setAllProperties(JSON.parse(storedProperties))
      }
      if (storedHome) {
        setHomeProperties(JSON.parse(storedHome))
      }

      if (!storedProperties) {
        const allRes = await GetAllProperties()
        setAllProperties(allRes)
        localStorage.setItem('AllProperties', JSON.stringify(allRes))
      }

      if (!storedHome) {
        const homeRes = await GetHomeProperties()
        setHomeProperties(homeRes)
        localStorage.setItem('Home', JSON.stringify(homeRes))
      }

    } catch (error) {
      console.error('Error al obtener propiedades:', error)
      setAllProperties([])
      setHomeProperties({
        properties: [],
        land: [],
        pinned: [],
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return (
    <PropertyContext.Provider value={{ allProperties, homeProperties, loading, reloadProperties: fetchProperties, setAllProperties }}>
      {children}
    </PropertyContext.Provider>
  )
}

export const useProperties = () => {
  const context = useContext(PropertyContext)
  if (!context) {
    throw new Error('useProperties debe usarse dentro de PropertyProvider')
  }
  return context
}

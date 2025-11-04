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

const CACHE_EXPIRATION_HOURS = 1
const CACHE_KEYS = {
  ALL: 'AllProperties',
  HOME: 'Home',
}

type CachedData<T> = {
  timestamp: number
  data: T
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

  const isCacheValid = (timestamp: number) => {
    const now = Date.now()
    const diffHours = (now - timestamp) / (1000 * 60 * 60)
    return diffHours < CACHE_EXPIRATION_HOURS
  }

  const getStoredData = <T,>(key: string): T | null => {
    const stored = localStorage.getItem(key)
    if (!stored) return null
    try {
      const parsed: CachedData<T> = JSON.parse(stored)
      if (isCacheValid(parsed.timestamp)) return parsed.data
      localStorage.removeItem(key)
      return null
    } catch {
      localStorage.removeItem(key)
      return null
    }
  }

  const setStoredData = <T,>(key: string, data: T) => {
    const cached: CachedData<T> = { timestamp: Date.now(), data }
    localStorage.setItem(key, JSON.stringify(cached))
  }

  const fetchProperties = async () => {
    try {
      setLoading(true)

      const storedAll = getStoredData<Property[]>(CACHE_KEYS.ALL)
      const storedHome = getStoredData<Home>(CACHE_KEYS.HOME)

      if (storedAll) setAllProperties(storedAll)
      if (storedHome) setHomeProperties(storedHome)

      if (!storedAll) {
        const allRes = await GetAllProperties()
        setAllProperties(allRes)
        setStoredData(CACHE_KEYS.ALL, allRes)
      }

      if (!storedHome) {
        const homeRes = await GetHomeProperties()
        setHomeProperties(homeRes)
        setStoredData(CACHE_KEYS.HOME, homeRes)
      }

    } catch (error) {
      console.error('Error al obtener propiedades:', error)
      setAllProperties([])
      setHomeProperties({ properties: [], land: [], pinned: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()

    const interval = setInterval(fetchProperties, 120 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PropertyContext.Provider
      value={{
        allProperties,
        homeProperties,
        loading,
        reloadProperties: fetchProperties,
        setAllProperties,
      }}
    >
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

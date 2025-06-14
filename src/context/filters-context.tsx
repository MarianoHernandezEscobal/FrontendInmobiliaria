// context/FiltersContext.tsx
'use client'

import { Filters } from '@/types/filters'
import React, { createContext, useContext, useState } from 'react'

const defaultFilters: Filters = {
  searchText: '',
  location: '',
  type: '',
  dormitoriosMin: 0,
  dormitoriosMax: Infinity,
  bathsMin: 0,
  bathsMax: Infinity,
  garage: undefined,
  pool: undefined,
  precioMin: 0,
  precioMax: Infinity,
  areaMin: 0,
  areaMax: Infinity,
  areaLandMin: 0,
  areaLandMax: Infinity,
  orderBy: 'date-desc',
}

const FiltersContext = createContext<{
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}>({
  filters: defaultFilters,
  setFilters: () => {},
})

export const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

export const useFilters = () => useContext(FiltersContext)

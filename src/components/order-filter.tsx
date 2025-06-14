'use client'

import { useFilters } from '@/context/filters-context'

export const OrderSelect = () => {
  const { filters, setFilters } = useFilters()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      orderBy: e.target.value,
    }))
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <label htmlFor="orderBy" className="font-bold">
        Ordenar por:
      </label>
      <select
        id="orderBy"
        value={filters.orderBy || ''}
        onChange={handleChange}
        className="border rounded px-2 py-1"
      >
        <option value="date-desc">Más recientes</option>
        <option value="date-asc">Menos recientes</option>
        <option value="price-asc">Precio: Menor a mayor</option>
        <option value="price-desc">Precio: Mayor a menor</option>
        <option value="area-desc">Mayor tamaño</option>
        <option value="area-asc">Menor tamaño</option>
      </select>
    </div>
  )
}

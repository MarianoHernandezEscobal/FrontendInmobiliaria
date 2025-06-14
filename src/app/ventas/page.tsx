// app/buscar/page.tsx
'use client'

import SearchPageContent from '@/components/search-page'
import { useProperties } from '@/context/property-context'

export default function SalePage() {
  const { allProperties, reloadProperties, loading } = useProperties()
  if(!allProperties || allProperties.length === 0) {
    reloadProperties()
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    )
  }
  return (
      <SearchPageContent />
  )
}

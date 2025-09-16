// app/buscar/page.tsx
'use client'

import SearchPageContent from '@/components/search-page'
import { useProperties } from '@/context/property-context'
import { useEffect, useState } from 'react'

export default function SalePage() {
  const { allProperties, reloadProperties, loading } = useProperties()
  const [hasTriedReload, setHasTriedReload] = useState(false)

  useEffect(() => {
    if (!hasTriedReload && (!allProperties || allProperties.length === 0) && !loading) {
      setHasTriedReload(true)
      reloadProperties().catch((error) => {
        console.error("Failed to reload properties:", error)
      })
    }
  }, [allProperties, loading, hasTriedReload, reloadProperties])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    )
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

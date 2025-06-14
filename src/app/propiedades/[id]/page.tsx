'use client'
import dynamic from 'next/dynamic'

const PropertyDetailClient = dynamic(
  () => import('@/components/property-detail-wrapper'),
  { ssr: false }
)

export default function ClientPropertyDetail() {
  return <PropertyDetailClient />
}

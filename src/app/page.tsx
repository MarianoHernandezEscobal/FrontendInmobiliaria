'use client'

import HomeVideo from '@/components/home-video'
import HomeCarousel from '@/components/HomeCarousel'
import VideoCarousel from '@/components/video-carousel'
import SimplePropertyMap from '@/components/map-home'
import AgentHome from '@/components/nosotros'
import { SearchFilters } from '@/components/search'
import { useProperties } from '@/context/property-context'
import { useFilters } from '@/context/filters-context'
import { useEffect } from 'react'

export default function Home() {
  const { homeProperties, allProperties, loading } = useProperties()
  const { setFilters } = useFilters()

  useEffect(() => {
    setFilters({
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
    })
  }, [])

  return (
    <div>
      <HomeVideo />
      <div className="container mx-auto py-10 px-4">
        <SearchFilters />

        {!loading && (
          <>
            <HomeCarousel properties={homeProperties.properties} title="Propiedades" />
            <HomeCarousel
              properties={homeProperties.land}
              title="Terrenos"
            />

            <VideoCarousel
              videos={[
                {
                  id: '1',
                  title: 'Ven a conocer nuestra fauna',
                  url: 'https://images-inmo.s3.us-east-2.amazonaws.com/videos/pajaros.mp4',
                  thumbnail: '/fotosInmo.jpg',
                },
                {
                  id: '2',
                  title: 'Lo simplemente hermoso de nuestro país',
                  url: 'https://images-inmo.s3.us-east-2.amazonaws.com/videos/barcofaro.mp4',
                  thumbnail: '/fotosInmo.jpg',
                },
                {
                  id: '3',
                  title: 'Conoce nuestros deportes',
                  url: 'https://images-inmo.s3.us-east-2.amazonaws.com/videos/surf.mp4',
                  thumbnail: '/fotosInmo.jpg',
                },
                {
                  id: '4',
                  title: 'Ven a conocer nuestra fauna',
                  url: 'https://images-inmo.s3.us-east-2.amazonaws.com/videos/volando.mp4',
                  thumbnail: '/fotosInmo.jpg',
                },
              ]}
            />
            
            <HomeCarousel
              properties={homeProperties.pinned}
              title="Nuestras destacadas"
            />

            <SimplePropertyMap properties={allProperties} />
          </>
        )}
        {loading && (
          <div className="flex justify-center items-center h-50">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
            )}
            
        <AgentHome />
      </div>
    </div>
  )
}

import { ImageList } from "./image"

export enum PropertyStatus{
  ForSale = 'for_sale',
  ForRent = 'for_rent',
  Sold = 'sold',
  Rented = 'rented',
  UnderConstruction = 'under_construction',
  Reserved = 'reserved'
}

export enum PropertyTypes {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  LAND = 'land',
  OFFICE = 'office',
  STORE = 'store',
  FARM = 'farm',
  CHAKRAS = 'chakras',
  OTHER = 'other',
}

export enum Neighborhoods {
  Anaconda = "anaconda",
  Antoniopolis = "antoniopolis",
  Arachania = "arachania",
  Atlantica = "atlantica",
  BarrioCountry = "barrio-country",
  BarrioParque = "barrio-parque",
  CerroAsperoGarzon = "cerro-aspero-garzon",
  CostaAzul = "costa-azul",
  LaAguada = "la-aguada",
  LaPaloma = "la-paloma",
  LaPedrera = "la-pedrera",
  OceaniaDelPolonio = "oceania-del-polonio",
  PlayaSerena = "playa-serena",
  PuebloNuevo = "pueblo-nuevo",
  PuntaRubia = "punta-rubia",
  Rocha = "rocha",
  SanAntonio = "san-antonio",
  SanSebastianDeLaPedrera = "san-sebastian-de-la-pedrera",
  SantaIsabel = "santa-isabel",
  SierraDeRocha = "sierra-de-rocha",
}

export interface Property {
  id: number
  title: string
  shortDescription: string
  price: number
  type: PropertyTypes | string
  status: PropertyStatus[]
  lotSize: number
  area?: number
  pool: boolean
  rooms?: number
  bathrooms?: number
  address: string
  geoCoordinates: {
    lat: number
    lng: number
  }
  neighborhood: Neighborhoods
  yearBuilt?: number
  imageSrc: string[]
  contribution?: number
  longDescription: string
  garage: boolean
  pinned: boolean
  approved: boolean
  createdAt: string
  createdBy?: any
  rents?: any[]
  features: string
}


export interface UpdateProperty{
  id: number
  title: string
  shortDescription: string
  price: number
  type: PropertyTypes | string
  status: PropertyStatus[]
  lotSize: number
  area?: number
  pool: boolean
  rooms?: number
  bathrooms?: number
  address: string
  geoCoordinates: {
    lat: number
    lng: number
  }
  neighborhood: Neighborhoods
  yearBuilt?: number
  imageSrc: ImageList
  contribution?: number
  longDescription: string
  garage: boolean
  pinned: boolean
  approved: boolean
  createdAt: string
  createdBy?: any
  rents?: any[]
  features: string
}
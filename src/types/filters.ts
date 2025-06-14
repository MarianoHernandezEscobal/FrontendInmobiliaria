export type Filters = {
    searchText: string
    location: string
    type: string
    dormitoriosMin: number
    dormitoriosMax: number
    bathsMin: number
    bathsMax: number
    garage: boolean | undefined
    pool: boolean | undefined
    precioMin: number
    precioMax: number
    areaMin: number
    areaMax: number
    areaLandMin: number,
    areaLandMax: number,
    orderBy: string
  }
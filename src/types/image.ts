export interface ImageItem {
  url: string
  file?: File
  isNew: boolean
  deleted: boolean
}

export type ImageList = ImageItem[]

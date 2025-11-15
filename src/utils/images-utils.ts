import { ImageList } from "@/types/image";

export function buildImageList(images: string[] = []): ImageList {
  return images.map((url) => ({
    url,
    file: undefined,
    isNew: false,
    deleted: false,
  }));
}
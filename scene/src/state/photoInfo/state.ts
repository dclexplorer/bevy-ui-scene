import type { PhotoMetadataResponse } from 'src/ui-classes/photos/Photos.types'
import { EMPTY_PHOTO_METADATA } from 'src/utils/constants'

export type PhotoState = {
  photoInfo: PhotoMetadataResponse
}

export const photoInitialState: PhotoState = {
  photoInfo: EMPTY_PHOTO_METADATA
}

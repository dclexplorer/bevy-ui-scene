import type {
  PhotoMetadataResponse,
  WearableData
} from 'src/ui-classes/photos/Photos.types'
import { EMPTY_PHOTO_METADATA, EMPTY_WEARABLE_DATA } from 'src/utils/constants'

export type PhotoState = {
  photoInfo: PhotoMetadataResponse
  wearablesInfo: WearableData[]
}

export const photoInitialState: PhotoState = {
  photoInfo: EMPTY_PHOTO_METADATA,
  wearablesInfo: [EMPTY_WEARABLE_DATA]
}

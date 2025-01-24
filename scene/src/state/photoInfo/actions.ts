import type {
  PhotoMetadataResponse,
  WearableData
} from 'src/ui-classes/photos/Photos.types'

type PhotoActionId = { __reducer: 'photo' }

export type GetPhotoInfo = PhotoActionId & {
  type: 'GET_PHOTO_FROM_API'
  payload: PhotoMetadataResponse
}

export type GetWearablesInfo = PhotoActionId & {
  type: 'GET_WEARABLES_FROM_API'
  payload: WearableData[]
}

export type PhotoActions = GetPhotoInfo | GetWearablesInfo

export const loadPhotoInfoFromApi = (
  photoInfo: PhotoMetadataResponse
): PhotoActions => ({
  __reducer: 'photo',
  type: 'GET_PHOTO_FROM_API',
  payload: photoInfo
})
export const loadWearablesFromPhoto = (
  wearablesInfo: WearableData[]
): PhotoActions => ({
  __reducer: 'photo',
  type: 'GET_WEARABLES_FROM_API',
  payload: wearablesInfo
})

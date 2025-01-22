import type { PhotoMetadataResponse } from 'src/ui-classes/photos/Photos.types'

type PhotoActionId = { __reducer: 'photo' }

export type GetPhotoInfo = PhotoActionId & {
  type: 'GET_PHOTO_FROM_API'
  payload: PhotoMetadataResponse
}

export type PhotoActions = GetPhotoInfo

export const loadPhotoInfoFromApi = (
  photoInfo: PhotoMetadataResponse
): PhotoActions => ({
  __reducer: 'photo',
  type: 'GET_PHOTO_FROM_API',
  payload: photoInfo
})

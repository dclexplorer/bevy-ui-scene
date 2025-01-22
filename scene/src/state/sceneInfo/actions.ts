import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  PlaceFromApi,
  EventFromApi
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'

type SceneActionId = { __reducer: 'scene' }

export type GetEvents = SceneActionId & {
  type: 'GET_EVENTS_FROM_API'
  payload: EventFromApi[]
}
export type GetPhotos = SceneActionId & {
  type: 'GET_PHOTOS_FROM_API'
  payload: PhotoFromApi[]
}
export type GetPlace = SceneActionId & {
  type: 'GET_PLACE_FROM_API'
  payload: PlaceFromApi
}

export type SceneActions = GetEvents | GetPlace | GetPhotos

export const loadEventsFromApi = (events: EventFromApi[]): GetEvents => ({
  __reducer: 'scene',
  type: 'GET_EVENTS_FROM_API',
  payload: events
})

export const loadPlaceFromApi = (place: PlaceFromApi): GetPlace => ({
  __reducer: 'scene',
  type: 'GET_PLACE_FROM_API',
  payload: place
})

export const loadPhotosFromApi = (photos: PhotoFromApi[]): GetPhotos => ({
  __reducer: 'scene',
  type: 'GET_PHOTOS_FROM_API',
  payload: photos
})

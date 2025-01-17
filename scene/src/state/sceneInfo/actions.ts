import { type EventFromApi } from 'src/ui-classes/scene-info-card/SceneInfoCard.types'

type SceneActionId = { __reducer: 'scene' }

export type GetEvents = SceneActionId & {
  type: 'GET_EVENTS_FROM_API'
  payload: EventFromApi[]
}
export type GetPhotos = SceneActionId & {
  type: 'GET_PHOTO_FROM_API'
  payload: EventFromApi[]
}
export type GetPlace = SceneActionId & {
  type: 'GET_PLACE_FROM_API'
  payload: EventFromApi[]
}

export type SceneActions = GetEvents | GetPlace | GetPhotos

export const loadEventsFromApi = (events: EventFromApi[]): GetEvents => ({
  __reducer: 'scene',
  type: 'GET_EVENTS_FROM_API',
  payload: events
})

export const loadPlaceFromApi = (events: EventFromApi[]): GetEvents => ({
  __reducer: 'scene',
  type: 'GET_PLACE_FROM_API',
  payload: events
})

export const loadPhotosFromApi = (events: EventFromApi[]): GetEvents => ({
  __reducer: 'scene',
  type: 'GET_PHOTOS_FROM_API',
  payload: events
})

import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  PlaceFromApi,
  EventFromApi
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
import { SCENE_INFO_STORE_ID } from 'src/state/sceneInfo/state'
import type { Vector3 } from '@dcl/sdk/math'

type SceneActionId = { __reducer: typeof SCENE_INFO_STORE_ID }

export enum SCENE_INFO_ACTION {
  GET_EVENTS_FROM_API,
  GET_PHOTOS_FROM_API,
  GET_PLACE_FROM_API,
  SAVE_PLAYER_POSITION
}

export type GetEvents = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_EVENTS_FROM_API
  payload: EventFromApi[]
}
export type GetPhotos = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_PHOTOS_FROM_API
  payload: PhotoFromApi[]
}
export type GetPlace = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_PLACE_FROM_API
  payload: PlaceFromApi
}
export type SavePlayerPosition = SceneActionId & {
  type: SCENE_INFO_ACTION.SAVE_PLAYER_POSITION
  payload: Vector3
}

export type SceneActions = GetEvents | GetPlace | GetPhotos | SavePlayerPosition

export const loadEventsFromApi = (events: EventFromApi[]): GetEvents => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_EVENTS_FROM_API,
  payload: events
})

export const loadPlaceFromApi = (place: PlaceFromApi): GetPlace => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_PLACE_FROM_API,
  payload: place
})

export const loadPhotosFromApi = (photos: PhotoFromApi[]): GetPhotos => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_PHOTOS_FROM_API,
  payload: photos
})

export const savePlayerPosition = (position: Vector3): SavePlayerPosition => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.SAVE_PLAYER_POSITION,
  payload: position
})

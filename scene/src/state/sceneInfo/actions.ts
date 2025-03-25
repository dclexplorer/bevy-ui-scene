import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  PlaceFromApi,
  EventFromApi,
  FavPayload,
  LikePayload
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
import { SCENE_INFO_STORE_ID } from 'src/state/sceneInfo/state'
import type { Vector3 } from '@dcl/sdk/math'

type SceneActionId = { __reducer: typeof SCENE_INFO_STORE_ID }

export enum SCENE_INFO_ACTION {
  GET_EVENTS_FROM_API,
  GET_PHOTOS_FROM_API,
  GET_PLACE_FROM_API,
  SET_FAV_TO_SEND,
  SET_LIKE_TO_SEND,
  CLEAN_FAV_TO_SEND,
  CLEAN_LIKE_TO_SEND,
  SAVE_PLAYER_POSITION,
  GET_FAVS_FROM_API,
  GET_LIKES_FROM_API,
  GET_SCENE_INFO_CARD_PLACE_FROM_API
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
export type SetFav = SceneActionId & {
  type: SCENE_INFO_ACTION.SET_FAV_TO_SEND
  payload: FavPayload
}
export type SetLike = SceneActionId & {
  type: SCENE_INFO_ACTION.SET_LIKE_TO_SEND
  payload: LikePayload
}
export type CleanFav = SceneActionId & {
  type: SCENE_INFO_ACTION.CLEAN_FAV_TO_SEND
  payload: undefined
}
export type CleanLike = SceneActionId & {
  type: SCENE_INFO_ACTION.CLEAN_LIKE_TO_SEND
  payload: undefined
}
export type GetSceneInfoPlace = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_SCENE_INFO_CARD_PLACE_FROM_API
  payload: PlaceFromApi
}
export type SavePlayerPosition = SceneActionId & {
  type: SCENE_INFO_ACTION.SAVE_PLAYER_POSITION
  payload: Vector3
}
export type GetFavorites = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_FAVS_FROM_API
  payload: PlaceFromApi[]
}

export type SceneActions =
  | GetEvents
  | GetPlace
  | GetSceneInfoPlace
  | GetPhotos
  | SavePlayerPosition
  | GetFavorites
  | SetFav
  | SetLike
  | CleanFav
  | CleanLike

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

export const setFavToSend = (payload: FavPayload): SetFav => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.SET_FAV_TO_SEND,
  payload
})

export const setLikeToSend = (payload: LikePayload): SetLike => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.SET_LIKE_TO_SEND,
  payload
})

export const cleanFavToSend = (payload: undefined): CleanFav => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.CLEAN_FAV_TO_SEND,
  payload
})

export const cleanLikeToSend = (payload: undefined): CleanLike => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.CLEAN_LIKE_TO_SEND,
  payload
})

export const loadSceneInfoPlaceFromApi = (
  place: PlaceFromApi
): GetSceneInfoPlace => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_SCENE_INFO_CARD_PLACE_FROM_API,
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

export const loadFavoritesFromApi = (
  favorites: PlaceFromApi[]
): GetFavorites => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_FAVS_FROM_API,
  payload: favorites
})

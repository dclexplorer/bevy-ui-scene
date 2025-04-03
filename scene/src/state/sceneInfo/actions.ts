import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  PlaceFromApi,
  EventFromApi,
  FavPayload,
  LikePayload
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
import { SCENE_INFO_STORE_ID } from 'src/state/sceneInfo/state'
import type { Vector3 } from '@dcl/sdk/math'
import type { HomeScene, LiveSceneInfo } from 'src/bevy-api/interface'

type SceneActionId = { __reducer: typeof SCENE_INFO_STORE_ID }

export enum SCENE_INFO_ACTION {
  GET_EVENTS_FROM_API,
  GET_EVENTS_TO_ATTEND,
  GET_PHOTOS_FROM_API,
  GET_PLACE_FROM_API,
  GET_SCENE_FROM_BEVY_API,
  SET_FAV_TO_SEND,
  SET_LIKE_TO_SEND,
  CLEAN_FAV_TO_SEND,
  CLEAN_LIKE_TO_SEND,
  SAVE_PLAYER_PARCEL_ACTION,
  GET_FAVS_FROM_API,
  GET_LIKES_FROM_API,
  GET_SCENE_INFO_CARD_PLACE_FROM_API,
  SET_HOME
}

export type GetEvents = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_EVENTS_FROM_API
  payload: EventFromApi[]
}
export type GetEventsToAttend = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_EVENTS_TO_ATTEND
  payload: EventFromApi[]
}
export type GetPhotos = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_PHOTOS_FROM_API
  payload: PhotoFromApi[]
}
export type GetPlace = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_PLACE_FROM_API
  payload: PlaceFromApi | undefined
}
export type GetScene = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_SCENE_FROM_BEVY_API
  payload: LiveSceneInfo | undefined
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
  type: SCENE_INFO_ACTION.SAVE_PLAYER_PARCEL_ACTION
  payload: Vector3
}
export type GetFavorites = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_FAVS_FROM_API
  payload: PlaceFromApi[]
}
export type SetHome = SceneActionId & {
  type: SCENE_INFO_ACTION.SET_HOME
  payload: HomeScene | undefined
}

export type SceneActions =
  | GetEvents
  | GetEventsToAttend
  | GetPlace
  | GetScene
  | GetSceneInfoPlace
  | GetPhotos
  | SavePlayerPosition
  | GetFavorites
  | SetFav
  | SetLike
  | CleanFav
  | CleanLike
  | SetHome

export const loadEventsFromApi = (events: EventFromApi[]): GetEvents => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_EVENTS_FROM_API,
  payload: events
})

export const loadEventsToAttendFromApi = (
  events: EventFromApi[]
): GetEventsToAttend => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_EVENTS_TO_ATTEND,
  payload: events
})

export const loadPlaceFromApi = (place: PlaceFromApi | undefined): GetPlace => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_PLACE_FROM_API,
  payload: place
})

export const loadSceneFromBevyApi = (scene: LiveSceneInfo | undefined): GetScene => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_SCENE_FROM_BEVY_API,
  payload: scene
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

export const savePlayerParcelAction = (
  position: Vector3
): SavePlayerPosition => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.SAVE_PLAYER_PARCEL_ACTION,
  payload: position
})

export const loadFavoritesFromApi = (
  favorites: PlaceFromApi[]
): GetFavorites => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_FAVS_FROM_API,
  payload: favorites
})

export const setHome = (home: HomeScene | undefined): SetHome => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.SET_HOME,
  payload: home
})

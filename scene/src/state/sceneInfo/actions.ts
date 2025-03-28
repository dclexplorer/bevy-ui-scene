import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  PlaceFromApi,
  EventFromApi,
  FavPayload,
  LikePayload
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
import { SCENE_INFO_STORE_ID } from 'src/state/sceneInfo/state'
import type { Vector3 } from '@dcl/sdk/math'
import type { LiveSceneInfo } from 'src/bevy-api/interface'

type SceneActionId = { __reducer: typeof SCENE_INFO_STORE_ID }

export enum SCENE_INFO_ACTION {
  GET_EVENTS_FROM_API,
  GET_EVENTS_TO_ATTEND,
  GET_PHOTOS_FROM_API,
  GET_PLACE_FROM_API,
  GET_SCENE_FROM_BEVY_API,
  SET_FAV_TO_SEND,
  SET_LIKE_TO_SEND,
  // SET_EVENTS_ID_TO_CREATE_ATTENDEE,
  // SET_EVENTS_ID_TO_REMOVE_ATTENDEE,
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
  payload: PlaceFromApi
}
export type GetScene = SceneActionId & {
  type: SCENE_INFO_ACTION.GET_SCENE_FROM_BEVY_API
  payload: LiveSceneInfo
}
export type SetFav = SceneActionId & {
  type: SCENE_INFO_ACTION.SET_FAV_TO_SEND
  payload: FavPayload
}
export type SetLike = SceneActionId & {
  type: SCENE_INFO_ACTION.SET_LIKE_TO_SEND
  payload: LikePayload
}
// export type CreateAttend = SceneActionId & {
//   type: SCENE_INFO_ACTION.SET_EVENTS_ID_TO_CREATE_ATTENDEE
//   payload: string[]
// }
// export type RemoveAttend = SceneActionId & {
//   type: SCENE_INFO_ACTION.SET_EVENTS_ID_TO_REMOVE_ATTENDEE
//   payload: string[]
// }
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
  // | CreateAttend
  // | RemoveAttend

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

export const loadPlaceFromApi = (place: PlaceFromApi): GetPlace => ({
  __reducer: SCENE_INFO_STORE_ID,
  type: SCENE_INFO_ACTION.GET_PLACE_FROM_API,
  payload: place
})

export const loadSceneFromBevyApi = (scene: LiveSceneInfo): GetScene => ({
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

// export const setCreateAttendToSend = (
//   EventsToAddIntentionToAttend: string[]
// ): CreateAttend => ({
//   __reducer: SCENE_INFO_STORE_ID,
//   type: SCENE_INFO_ACTION.SET_EVENTS_ID_TO_CREATE_ATTENDEE,
//   payload: EventsToAddIntentionToAttend
// })

// export const setRemoveAttendToSend = (
//   EventsToRemoveIntentionToAttend: string[]
// ): RemoveAttend => ({
//   __reducer: SCENE_INFO_STORE_ID,
//   type: SCENE_INFO_ACTION.SET_EVENTS_ID_TO_REMOVE_ATTENDEE,
//   payload: EventsToRemoveIntentionToAttend
// })

import type { Vector3 } from '@dcl/sdk/math'
import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  PlaceFromApi,
  EventFromApi,
  LikePayload,
  FavPayload
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'

export const SCENE_INFO_STORE_ID: 'scene' = 'scene'

export type SceneState = {
  explorerEvents: EventFromApi[]
  explorerEventsToAttend: EventFromApi[]
  explorerPlace: PlaceFromApi | undefined
  sceneInfoCardPlace: PlaceFromApi | undefined
  sceneInfoCardFavToSend: FavPayload | undefined
  sceneInfoCardLikeToSend: LikePayload | undefined
  EventsAttendeeToCreate: string[]
  EventsAttendeeToRemove: string[]
  explorerPhotos: PhotoFromApi[]
  explorerPlayerPosition: Vector3 | undefined
  explorerFavorites: PlaceFromApi[] | undefined
}

export const sceneInitialState: SceneState = {
  explorerEvents: [],
  explorerEventsToAttend: [],
  explorerPlace: undefined,
  sceneInfoCardPlace: undefined,
  sceneInfoCardFavToSend: undefined,
  sceneInfoCardLikeToSend: undefined,
  EventsAttendeeToCreate: [],
  EventsAttendeeToRemove: [],
  explorerPhotos: [],
  explorerPlayerPosition: undefined,
  explorerFavorites: undefined
}

import type { Vector3 } from '@dcl/sdk/math'
import type { HomeScene, LiveSceneInfo } from 'src/bevy-api/interface'
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
  explorerScene: LiveSceneInfo | undefined
  sceneInfoCardPlace: PlaceFromApi | undefined
  sceneInfoCardFavToSend: FavPayload | undefined
  sceneInfoCardLikeToSend: LikePayload | undefined
  explorerPhotos: PhotoFromApi[]
  explorerPlayerParcelAction: Vector3 | undefined
  explorerFavorites: PlaceFromApi[] | undefined
  home: HomeScene | undefined
}

export const sceneInitialState: SceneState = {
  explorerEvents: [],
  explorerEventsToAttend: [],
  explorerPlace: undefined,
  explorerScene: undefined,
  sceneInfoCardPlace: undefined,
  sceneInfoCardFavToSend: undefined,
  sceneInfoCardLikeToSend: undefined,
  explorerPhotos: [],
  explorerPlayerParcelAction: undefined,
  explorerFavorites: undefined,
  home: undefined
}

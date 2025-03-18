import type { Vector3 } from '@dcl/sdk/math'
import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  PlaceFromApi,
  EventFromApi
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'

export const SCENE_INFO_STORE_ID: 'scene' = 'scene'

export type SceneState = {
  explorerEvents: EventFromApi[]
  explorerPlace: PlaceFromApi | undefined
  sceneInfoCardPlace: PlaceFromApi | undefined
  explorerPhotos: PhotoFromApi[]
  explorerPlayerPosition: Vector3 | undefined
  explorerFavorites: PlaceFromApi[] | undefined
}

export const sceneInitialState: SceneState = {
  explorerEvents: [],
  explorerPlace: undefined,
  sceneInfoCardPlace: undefined,
  explorerPhotos: [],
  explorerPlayerPosition: undefined,
  explorerFavorites: undefined
}

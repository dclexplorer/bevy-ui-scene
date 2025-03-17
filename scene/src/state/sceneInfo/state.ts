import type { Vector3 } from '@dcl/sdk/math'
import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  PlaceFromApi,
  EventFromApi
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
import { EMPTY_PLACE } from 'src/utils/constants'

export const SCENE_INFO_STORE_ID: 'scene' = 'scene'

export type SceneState = {
  explorerEvents: EventFromApi[]
  explorerPlace: PlaceFromApi
  explorerPhotos: PhotoFromApi[]
  explorerPlayerPosition: Vector3 | undefined
  explorerFavorites: PlaceFromApi[] | undefined
}

export const sceneInitialState: SceneState = {
  explorerEvents: [],
  explorerPlace: EMPTY_PLACE,
  explorerPhotos: [],
  explorerPlayerPosition: undefined,
  explorerFavorites: undefined
}

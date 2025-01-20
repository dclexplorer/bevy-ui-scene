import type {
  PhotoFromApi,
  PlaceFromApi,
  EventFromApi
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
import { EMPTY_PLACE } from 'src/utils/constants'

export type SceneState = {
  explorerEvents: EventFromApi[]
  explorerPlace: PlaceFromApi
  explorerPhotos: PhotoFromApi[]
}

export const sceneInitialState: SceneState = {
  explorerEvents: [],
  explorerPlace: EMPTY_PLACE,
  explorerPhotos: []
}

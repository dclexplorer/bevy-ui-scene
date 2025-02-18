import type { SceneActions } from './actions'
import { sceneInitialState, type SceneState } from './state'

export function reducer(
  state: SceneState = sceneInitialState,
  action: SceneActions
): SceneState {
  switch (action.type) {
    case 'GET_EVENTS_FROM_API':
      return { ...state, explorerEvents: action.payload }
    case 'GET_PLACE_FROM_API':
      return { ...state, explorerPlace: action.payload }
    case 'GET_PHOTOS_FROM_API':
      return { ...state, explorerPhotos: action.payload }

    default:
      return state
  }
}

import { SCENE_INFO_ACTION, type SceneActions } from './actions'
import { sceneInitialState, type SceneState } from './state'

export function reducer(
  state: SceneState = sceneInitialState,
  action: SceneActions
): SceneState {
  switch (action.type) {
    case SCENE_INFO_ACTION.GET_EVENTS_FROM_API:
      return { ...state, explorerEvents: action.payload }
    case SCENE_INFO_ACTION.GET_PLACE_FROM_API:
      return { ...state, explorerPlace: action.payload }
    case SCENE_INFO_ACTION.GET_PHOTOS_FROM_API:
      return { ...state, explorerPhotos: action.payload }
    case SCENE_INFO_ACTION.SAVE_PLAYER_POSITION:
      return { ...state, explorerPlayerPosition: action.payload }
    case SCENE_INFO_ACTION.GET_FAVS_FROM_API:
      return { ...state, explorerFavorites: action.payload }

    default:
      return state
  }
}

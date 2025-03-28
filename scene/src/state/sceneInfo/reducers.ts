import { SCENE_INFO_ACTION, type SceneActions } from './actions'
import { sceneInitialState, type SceneState } from './state'

export function reducer(
  state: SceneState = sceneInitialState,
  action: SceneActions
): SceneState {
  switch (action.type) {
    case SCENE_INFO_ACTION.GET_EVENTS_FROM_API:
      return { ...state, explorerEvents: action.payload }
    case SCENE_INFO_ACTION.GET_EVENTS_TO_ATTEND:
      return { ...state, explorerEventsToAttend: action.payload }
    case SCENE_INFO_ACTION.GET_PLACE_FROM_API:
      return { ...state, explorerPlace: action.payload }
    case SCENE_INFO_ACTION.GET_SCENE_FROM_BEVY_API:
      return { ...state, explorerScene: action.payload }
    case SCENE_INFO_ACTION.GET_SCENE_INFO_CARD_PLACE_FROM_API:
      return { ...state, sceneInfoCardPlace: action.payload }
    case SCENE_INFO_ACTION.SET_FAV_TO_SEND:
      return { ...state, sceneInfoCardFavToSend: action.payload }
    case SCENE_INFO_ACTION.SET_LIKE_TO_SEND:
      return { ...state, sceneInfoCardLikeToSend: action.payload }
    // case SCENE_INFO_ACTION.SET_EVENTS_ID_TO_CREATE_ATTENDEE:
    //   return { ...state, EventsAttendeeToCreate: action.payload }
    // case SCENE_INFO_ACTION.SET_EVENTS_ID_TO_REMOVE_ATTENDEE:
    //   return { ...state, EventsAttendeeToRemove: action.payload }
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

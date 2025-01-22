import type { PhotoActions } from './actions'
import { photoInitialState, type PhotoState } from './state'

export function reducer(
  state: PhotoState = photoInitialState,
  action: PhotoActions
): PhotoState {
  switch (action.type) {
    case 'GET_PHOTO_FROM_API':
      return { ...state, photoInfo: action.payload }
    default:
      return state
  }
}

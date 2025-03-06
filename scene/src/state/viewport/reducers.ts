import { type ViewportState } from './state'
import { VIEWPORT_ACTION, type ViewportActions } from './actions'

export function reducer(
  state: ViewportState,
  action: ViewportActions
): ViewportState {
  switch (action.type) {
    case VIEWPORT_ACTION.UPDATE_VIEWPORT:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

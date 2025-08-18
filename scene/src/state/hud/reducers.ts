import { type HudState } from './state'
import { HUD_ACTION, type HudActions } from './actions'

export function reducer(state: HudState, action: HudActions): HudState {
  switch (action.type) {
    case HUD_ACTION.UPDATE_HUD_STATE:
      return { ...state, ...action.payload }
    case HUD_ACTION.PUSH_POPUP:
      return { ...state, shownPopups: [...state.shownPopups, action.payload] }
    case HUD_ACTION.UNSHIFT_POPUP:
      return { ...state, shownPopups: [action.payload, ...state.shownPopups] }
    case HUD_ACTION.CLOSE_LAST_POPUP:
      return {
        ...state,
        shownPopups: [
          ...state.shownPopups.slice(0, state.shownPopups.length - 1)
        ]
      }
    default:
      return state
  }
}

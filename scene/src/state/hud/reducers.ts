import { type HudState } from './state'
import { HUD_ACTION, type HudActions } from './actions'

export function reducer(state: HudState, action: HudActions): HudState {
  switch (action.type) {
    case HUD_ACTION.UPDATE_HUD_STATE:
      console.log(' HUD_ACTION.UPDATE_HUD_STATE', action.payload)
      return { ...state, ...action.payload }
    default:
      return state
  }
}

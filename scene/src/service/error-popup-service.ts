import { store } from '../state/store'
import { pushPopupAction } from '../state/hud/actions'
import { HUD_POPUP_TYPE } from '../state/hud/state'

export function showErrorPopup(error: any, source?: string): void {
  store.dispatch(
    pushPopupAction({ type: HUD_POPUP_TYPE.ERROR, data: { error, source } })
  )
}

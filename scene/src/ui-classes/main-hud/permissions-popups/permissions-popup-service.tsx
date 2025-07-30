import { BevyApi } from '../../../bevy-api'
import type { PermissionRequest } from '../../../bevy-api/permission-definitions'
import { store } from '../../../state/store'
import { pushPopupAction } from '../../../state/hud/actions'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'

export const listenPermissionRequests = async (): Promise<void> => {
  const awaitChatStream = async (
    stream: PermissionRequest[]
  ): Promise<void> => {
    for await (const permissionRequest of stream) {
      console.log('permissionRequest', permissionRequest)
      store.dispatch(
        pushPopupAction({
          data: permissionRequest,
          type: HUD_POPUP_TYPE.PERMISSION_REQUEST
        })
      )
    }
  }

  await awaitChatStream(await BevyApi.getPermissionRequestStream())
}

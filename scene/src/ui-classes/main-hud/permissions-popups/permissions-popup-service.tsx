import { BevyApi } from '../../../bevy-api'
import type { PermissionRequest } from '../../../bevy-api/permission-definitions'

export const listenPermissionRequests = async (): Promise<void> => {
  const awaitChatStream = async (
    stream: PermissionRequest[]
  ): Promise<void> => {
    for await (const permissionRequest of stream) {
      console.log('permissionRequest', permissionRequest)
      // TODO store.dispatch(pushPopupAction())
    }
  }

  await awaitChatStream(await BevyApi.getPermissionRequestStream())
}

import { type PBPlayerIdentityData } from '@dcl/ecs/dist/components'
import {
  type DeepReadonlyObject,
  engine,
  executeTask,
  PlayerIdentityData
} from '@dcl/sdk/ecs'
import { sleep } from '../utils/dcl-utils'
import { fetchProfileData } from '../utils/passport-promise-utils'
import { getPlayer } from '@dcl/sdk/players'
import { namedUsersData } from '../ui-classes/main-hud/chat-and-logs/named-users-data-service'
import { getNameWithHashPostfix } from '../ui-classes/main-hud/chat-and-logs/ChatsAndLogs'
import { setIfNot } from '../utils/function-utils'

const state: {
  players: Array<DeepReadonlyObject<PBPlayerIdentityData>>
} = {
  players: []
}

export function getChatMembers(): Array<
  DeepReadonlyObject<PBPlayerIdentityData>
> {
  return state.players
}

export async function initChatMembersCount(): Promise<void> {
  while (true) {
    state.players = []

    for (const [, data] of engine.getEntitiesWith(PlayerIdentityData)) {
      // TODO review if there is better method... when chat channel is not scene? deprecated getConnectedPlayers ?
      state.players.push(data)

      executeTask(async () => {
        const playerData = getPlayer({ userId: data.address })
        const foundUserData = setIfNot(namedUsersData).get(
          getNameWithHashPostfix(
            playerData?.name ?? '',
            playerData?.userId ?? ''
          ).toLowerCase()
        )

        const profileData = await fetchProfileData({
          userId: data.address,
          useCache: true
        })

        foundUserData.playerData = playerData
        foundUserData.profileData = profileData
      })
    }

    await sleep(1000)
  }
}

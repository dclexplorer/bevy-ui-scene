import { type PBPlayerIdentityData } from '@dcl/ecs/dist/components'
import {
  type DeepReadonlyObject,
  engine,
  PlayerIdentityData
} from '@dcl/sdk/ecs'
import { sleep } from '../utils/dcl-utils'
import { getPlayer } from '@dcl/sdk/players'

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

export const nameAddressMap = new Map<string, string>()

export async function initChatMembersCount(): Promise<void> {
  while (true) {
    state.players = []
    for (const [, data] of engine.getEntitiesWith(PlayerIdentityData)) {
      // TODO review if there is better method... when chat channel is not scene? deprecated getConnectedPlayers?
      state.players.push(data)
      if (!data.isGuest) {
        const player = getPlayer({ userId: data.address })
        if (!player) continue
        nameAddressMap.set(player.name, data.address)
      }
    }

    await sleep(1000)
  }
}

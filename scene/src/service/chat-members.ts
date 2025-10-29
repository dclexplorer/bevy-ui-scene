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

const nameAddressMap = new Map<string, string>() // name,address
export const nameAddressMapHas = (name: string) =>
  nameAddressMap.has(name.toLowerCase())

export const nameAddressMapGet = (name: string) =>
  nameAddressMap.get(name.toLowerCase())

export const nameAddressMapSet = (name: string, address: string) => {
  nameAddressMap.set(name.toLowerCase(), address)
}

export async function initChatMembersCount(): Promise<void> {
  while (true) {
    state.players = []

    for (const [, data] of engine.getEntitiesWith(PlayerIdentityData)) {
      // TODO review if there is better method... when chat channel is not scene? deprecated getConnectedPlayers?
      state.players.push(data)

      const player = getPlayer({ userId: data.address })
      if (!player) continue

      if (!nameAddressMapHas(player.name)) {
        nameAddressMapSet(player.name, data.address)
      }
    }

    await sleep(1000)
  }
}

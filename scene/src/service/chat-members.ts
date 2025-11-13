import { type PBPlayerIdentityData } from '@dcl/ecs/dist/components'
import {
  type DeepReadonlyObject,
  engine,
  executeTask,
  PlayerIdentityData
} from '@dcl/sdk/ecs'
import { sleep, waitFor } from '../utils/dcl-utils'
import { fetchProfileData } from '../utils/passport-promise-utils'
import { getPlayer } from '@dcl/sdk/players'
import {
  type ComposedPlayerData,
  composedUsersData,
  namedUsersData
} from '../ui-classes/main-hud/chat-and-logs/named-users-data-service'
import { getNameWithHashPostfix } from '../ui-classes/main-hud/chat-and-logs/ChatsAndLogs'
import { setIfNot } from '../utils/function-utils'
import { GetPlayerDataRes } from '../utils/definitions'

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
    const players = []

    for (const [, data] of engine.getEntitiesWith(PlayerIdentityData)) {
      // TODO review if there is better method... when chat channel is not scene? deprecated getConnectedPlayers ?
      players.push(data)

      await requestAndSetPlayerComposedData({ userId: data.address })
    }
    state.players = players
    await sleep(5000)
  }
}
const loadingUserSet = new Set<string>()

export function requestPlayer({
  userId
}: {
  userId: string
}): GetPlayerDataRes | null {
  const playerData = (setIfNot(composedUsersData).get(userId).playerData =
    getPlayer({ userId }))

  executeTask(async () => {
    requestAndSetPlayerComposedData({ userId }).catch(console.error)
  })

  return playerData
}

export async function requestAndSetPlayerComposedData({
  userId
}: {
  userId: string
}): Promise<ComposedPlayerData> {
  await waitFor(() => !loadingUserSet.has(userId))
  loadingUserSet.add(userId)
  const playerData =
    setIfNot(composedUsersData).get(userId).playerData ?? getPlayer({ userId })
  const foundUserData = setIfNot(namedUsersData).get(
    getNameWithHashPostfix(
      playerData?.name ?? '',
      playerData?.userId ?? ''
    )?.toLowerCase()
  )

  const profileData = await fetchProfileData({
    userId,
    useCache: true
  })

  setIfNot(composedUsersData).get(userId).profileData = profileData
  setIfNot(composedUsersData).get(userId).playerData = playerData
  foundUserData.playerData = playerData
  foundUserData.profileData = profileData
  loadingUserSet.delete(userId)
  return foundUserData
}

import { type PBPlayerIdentityData } from '@dcl/ecs/dist/components'
import {
  type DeepReadonlyObject,
  engine,
  executeTask,
  PlayerIdentityData
} from '@dcl/sdk/ecs'
import { sleep, waitFor } from '../utils/dcl-utils'
import {
  fetchAllUserNames,
  fetchProfileData
} from '../utils/passport-promise-utils'
import { getPlayer } from '@dcl/sdk/players'
import {
  type ComposedPlayerData,
  composedUsersData,
  namedUsersData
} from '../ui-classes/main-hud/chat-and-logs/named-users-data-service'
import { getNameWithHashPostfix } from '../ui-classes/main-hud/chat-and-logs/ChatsAndLogs'
import { setIfNot } from '../utils/function-utils'
import { type GetPlayerDataRes } from '../utils/definitions'

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
  if (!userId) {
    console.error('!userId')
  }

  const playerData = (setIfNot(composedUsersData).get(userId).playerData =
    getPlayer({ userId }))

  executeTask(async () => {
    requestAndSetPlayerComposedData({ userId }).catch(console.error)
  })

  return playerData
}

export async function requestAndSetPlayerComposedData(
  {
    userId
  }: {
    userId: string
  },
  useCache = true
): Promise<ComposedPlayerData> {
  await waitFor(() => !loadingUserSet.has(userId))

  loadingUserSet.add(userId)
  const playerData = getPlayer({ userId })
  const foundUserData = setIfNot(composedUsersData).get(userId)
  foundUserData.playerData = playerData
  const profileData = await fetchProfileData({
    userId,
    useCache
  })
  console.log(
    'composedUsersData.get(userId)?.nftNames',
    composedUsersData.get(userId)?.nftNames
  )
  if (!composedUsersData.get(userId)?.nftNames) {
    setIfNot(composedUsersData).get(userId).nftNames = (
      await fetchAllUserNames({
        userId
      })
    ).map((i) => i.name)
  }

  foundUserData.profileData = profileData
  loadingUserSet.delete(userId)
  return foundUserData
}

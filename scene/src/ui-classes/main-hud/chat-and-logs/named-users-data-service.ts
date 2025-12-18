import type { GetPlayerDataRes } from '../../../utils/definitions'
import { type ProfileResponse } from '../../../utils/passport-promise-utils'
import { getPlayer } from '@dcl/sdk/players'
import { requestAndSetPlayerComposedData } from '../../../service/chat-members'

export type nameString = `${string}#${string}` | string
export type ComposedPlayerData = {
  playerData?: GetPlayerDataRes | null
  profileData?: ProfileResponse
  nftNames?: string[]
}

export type Address = `0x${string}`

export const hasClaimedName = (userId: Address): boolean => {
  return !!composedUsersData
    .get(userId)
    ?.nftNames?.includes(getPlayer({ userId })?.name ?? '__NOTHING__')
}

export const asyncHasClaimedName = async (
  userId: Address
): Promise<boolean> => {
  await requestAndSetPlayerComposedData({ userId })

  return hasClaimedName(userId)
}

export const namedUsersData = new Map<nameString, Address>()
export const composedUsersData = new Map<string, ComposedPlayerData>()

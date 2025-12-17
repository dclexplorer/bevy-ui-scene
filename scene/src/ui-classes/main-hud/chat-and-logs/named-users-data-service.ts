import type { GetPlayerDataRes } from '../../../utils/definitions'
import {
  fetchProfileData,
  type ProfileResponse
} from '../../../utils/passport-promise-utils'
import { requestAndSetPlayerComposedData } from '../../../service/chat-members'

export type nameString = `${string}#${string}` | string
export type ComposedPlayerData = {
  playerData?: GetPlayerDataRes | null
  profileData?: ProfileResponse
}
export type Address = `0x${string}`

export const hasClaimedName = (userId: Address): boolean => {
  return !!composedUsersData.get(userId)?.profileData?.avatars[0].hasClaimedName
}

export const asyncHasClaimedName = async (
  userId: Address
): Promise<boolean> => {
  await requestAndSetPlayerComposedData({ userId })
  return hasClaimedName(userId)
}

export const namedUsersData = new Map<nameString, Address>()
export const composedUsersData = new Map<string, ComposedPlayerData>()

import type { GetPlayerDataRes } from '../../../utils/definitions'
import { type ProfileResponse } from '../../../utils/passport-promise-utils'

export type nameString = `${string}#${string}` | string
export type ComposedPlayerData = {
  playerData?: GetPlayerDataRes | null
  profileData?: ProfileResponse
}
export type userIdString = `0x${string}`
export const namedUsersData = new Map<nameString, ComposedPlayerData>()
export const composedUsersData = new Map<userIdString, ComposedPlayerData>()

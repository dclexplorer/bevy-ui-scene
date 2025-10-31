import type { GetPlayerDataRes } from '../../../utils/definitions'
import { type ProfileResponse } from '../../../utils/passport-promise-utils'
import { getNameWithHashPostfix } from './ChatsAndLogs'

export type nameString = `${string}#${string}` | string
export type ComposedPlayerData = {
  playerData?: GetPlayerDataRes | null
  profileData?: ProfileResponse
}

export const namedUsersData = new Map<nameString, ComposedPlayerData>()

export const getUserDataWithOrWithoutHash = (
  name: string,
  userId: string
): ComposedPlayerData | undefined => {
  if (name.includes('#')) {
    return (
      namedUsersData.get(name.toLowerCase()) ??
      namedUsersData.get(name.split('#')[0].toLowerCase())
    )
  } else {
    return (
      namedUsersData.get(name.toLowerCase()) ??
      namedUsersData.get(getNameWithHashPostfix(name, userId) ?? '')
    )
  }
}

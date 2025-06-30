import { getRealm } from '~system/Runtime'
import { CATALYST_BASE_URL_FALLBACK } from './constants'
import { fetchJsonOrTryFallback } from './promise-utils'
import { type Avatar } from '@dcl/schemas'

export type ProfileResponse = {
  timestamp: number
  avatars: Avatar[]
}

export async function fetchProfileData({
  userId
}: {
  userId: string
}): Promise<ProfileResponse> {
  const realm = await getRealm({})
  const catalystBaseURl = realm.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
  const passportDataURL = `${catalystBaseURl}/lambdas/profiles/${userId}`
  const response = await fetchJsonOrTryFallback(passportDataURL)

  return response
}

export type NameDefinition = {
  name: string
  contractAddress: string
  tokenId: string
}

const namesCache = new Map<string, NameDefinition[]>()

export async function fetchAllUserNames({
  userId
}: {
  userId: string
}): Promise<NameDefinition[]> {
  if (namesCache.has(userId)) {
    return namesCache.get(userId) as NameDefinition[]
  }
  const realm = await getRealm({})
  const catalystBaseURl = realm.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
  const namesURL = `${catalystBaseURl}/lambdas/users/${userId}/names`
  const response = await fetchJsonOrTryFallback(namesURL)
  return response?.elements ?? []
}

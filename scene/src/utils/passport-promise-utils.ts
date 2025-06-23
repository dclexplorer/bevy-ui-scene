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

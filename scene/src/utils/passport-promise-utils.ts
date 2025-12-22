import { getRealm } from '~system/Runtime'
import { CATALYST_BASE_URL_FALLBACK } from './constants'
import { fetchJsonOrTryFallback } from './promise-utils'
import { type Avatar } from '@dcl/schemas'
import { cloneDeep } from './function-utils'
import { type ViewAvatarData } from '../state/hud/state'
import { BevyApi } from '../bevy-api'
import { showErrorPopup } from '../service/error-popup-service'
import {
  type Address,
  namedUsersData
} from '../ui-classes/main-hud/chat-and-logs/named-users-data-service'
import { getPlayer } from '@dcl/sdk/players'

export type ProfileResponse = {
  timestamp: number
  avatars: Avatar[]
}
export const profileDataMap = new Map<string, ProfileResponse>()

export async function fetchProfileData({
  userId,
  useCache = false
}: {
  userId: string
  useCache?: boolean
}): Promise<ProfileResponse> {
  const realm = await getRealm({})
  const catalystBaseURl = realm.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
  const passportDataURL = `${catalystBaseURl}/lambdas/profiles/${userId}`
  if (useCache && profileDataMap.has(userId)) {
    return profileDataMap.get(userId) as ProfileResponse
  } else {
    const result = await fetchJsonOrTryFallback(passportDataURL)
    const hasClaimedName = (result?.avatars ?? []).some(
      (avatar: Avatar) => avatar.hasClaimedName
    )
    const player = getPlayer({ userId })
    if (hasClaimedName && player) {
      namedUsersData.set(player.name.toLowerCase(), userId as Address)
    }
    profileDataMap.set(userId, result)
    return result
  }
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

export type ProfileExtra = {
  description: string
  country: string
  language: string
  gender: string
  relationshipStatus: string
  sexualOrientation: string
  employmentStatus: string
  pronouns: string
  profession: string
  birthdate: number
  hobbies: string
  links: Array<{ url: string; title: string }>
  tutorialStep: number
  blocked: string[]
  interests: string[]
  realName: string
  unclaimedName: string
  email: string
}

export const saveProfileData = async (
  profileData: ViewAvatarData
): Promise<void> => {
  const profileExtras = fromViewAvatarDataToProfileExtra(profileData)

  await BevyApi.setAvatar({
    profileExtras
  }).catch(showErrorPopup)
}

function fromViewAvatarDataToProfileExtra(
  profileData: ViewAvatarData
): ProfileExtra {
  const profileExtras: ProfileExtra = {
    description: profileData.description ?? 'No intro.',
    country: profileData.country ?? '',
    language: profileData.language ?? '',
    gender: profileData.gender ?? '',
    relationshipStatus: profileData.relationshipStatus ?? '',
    sexualOrientation: profileData.sexualOrientation ?? '',
    employmentStatus: profileData.employmentStatus ?? '',
    pronouns: profileData.pronouns ?? '',
    profession: profileData.profession ?? '',
    birthdate: profileData.birthdate ?? 0,
    hobbies: profileData.hobbies ?? '',
    links: cloneDeep(profileData.links ?? []),
    tutorialStep: profileData.tutorialStep ?? 0,
    blocked: profileData.blocked ?? [],
    interests: profileData.interests ?? [],
    realName: profileData.realName ?? '',
    unclaimedName: profileData.unclaimedName ?? '',
    email: profileData.email ?? ''
  }

  return profileExtras
}

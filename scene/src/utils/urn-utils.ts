import type { EquippedEmote, URN, URNWithoutTokenId } from './definitions'
import { memoize } from './function-utils'

export const BASE_MALE_URN: URNWithoutTokenId =
  'urn:decentraland:off-chain:base-avatars:BaseMale' as URNWithoutTokenId
export const BASE_FEMALE_URN: URNWithoutTokenId =
  'urn:decentraland:off-chain:base-avatars:BaseFemale' as URNWithoutTokenId
const urnWithoutTokenIdMemo = new Map<URN, URNWithoutTokenId>()
export const urnWithTokenIdMemo = new Map<
  URNWithoutTokenId | EquippedEmote,
  URN
>()

export function getItemsWithTokenId(
  wearables: Array<URNWithoutTokenId | EquippedEmote>
): URN[] {
  return wearables.map(
    (wearableURN) => urnWithTokenIdMemo.get(wearableURN) as URN
  )
}

export function getURNWithoutTokenId(
  urn: URN | null | URNWithoutTokenId | EquippedEmote,
  avoidCache: boolean = false
): URNWithoutTokenId | EquippedEmote | null | '' {
  if (urn === null) return null

  if (!avoidCache && urnWithoutTokenIdMemo.has(urn as URN)) {
    return urnWithoutTokenIdMemo.get(urn as URN) as URNWithoutTokenId
  }

  let urnWithoutTokenId: URNWithoutTokenId

  if (isOffChainOrIncomplete(urn)) {
    urnWithoutTokenId = urn as URNWithoutTokenId
  } else {
    const parts = urn.split(':')
    const lastPart = parts[parts.length - 1]

    if (/^\d+$/.test(lastPart)) {
      urnWithoutTokenId = urn.replace(/^(.*):[^:]+$/, '$1') as URNWithoutTokenId
    } else {
      urnWithoutTokenId = urn as URNWithoutTokenId
    }
  }

  urnWithoutTokenIdMemo.set(urn as URN, urnWithoutTokenId)
  urnWithTokenIdMemo.set(urnWithoutTokenId, urn as URN)

  return urnWithoutTokenId
}

function isOffChainOrIncomplete(urn: string): boolean {
  return urn.includes(':off-chain:') || urn.split(':').length < 6
}

function _applyMiddleEllipsis(address: string): string {
  if (!address) return ''

  const start = address.slice(0, 6) // '0x' + 4 chars
  const end = address.slice(-4) // Last 4 chars

  return `${start}…${end}`
}
export const applyMiddleEllipsis = memoize(_applyMiddleEllipsis)

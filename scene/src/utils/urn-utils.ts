import type { URN, URNWithoutTokenId } from './definitions'

export const BASE_MALE_URN: URNWithoutTokenId =
  'urn:decentraland:off-chain:base-avatars:BaseMale' as URNWithoutTokenId

const urnWithoutTokenIdMemo = new Map<URN, URNWithoutTokenId>()
export const urnWithTokenIdMemo = new Map<URNWithoutTokenId, URN>()

export function getWearablesWithTokenId(wearables: URNWithoutTokenId[]): URN[] {
  return wearables.map(
    (wearableURN) => urnWithTokenIdMemo.get(wearableURN) as URN
  )
}

export function getURNWithoutTokenId(
  urn: URN | null | URNWithoutTokenId,
  avoidCache: boolean = false
): URNWithoutTokenId | null {
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

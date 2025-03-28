import type { URNWithoutTokenId } from '../utils/definitions'
import type {
  OutfitSetup,
  OutfitSetupWearables,
  CatalystEntityMap,
  WearableEntityMetadata,
  EmoteEntityMetadata
} from '../utils/item-definitions'
import {
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from './categories'
import { BASE_MALE_URN } from '../utils/urn-utils'
import { deepFreeze } from '../utils/object-utils'

export const EMPTY_OUTFIT: OutfitSetup = deepFreeze({
  wearables: {
    body_shape: fromBaseToURN('BaseMale'),
    hair: null,
    eyebrows: null,
    eyes: null,
    mouth: null,
    facial_hair: null,
    upper_body: null,
    hands_wear: null,
    lower_body: null,
    feet: null,
    hat: null,
    eyewear: null,
    earring: null,
    mask: null,
    top_head: null,
    tiara: null,
    helmet: null,
    skin: null
  },
  base: {
    name: 'default_name',
    skinColor: { r: 1, g: 1, b: 1 },
    hairColor: { r: 1, g: 1, b: 1 },
    eyesColor: { r: 1, g: 1, b: 1 },
    bodyShapeUrn: BASE_MALE_URN
  }
})

export function getOutfitSetupFromWearables(
  equippedWearables: URNWithoutTokenId[] = [],
  catalystWearables: CatalystEntityMap
): OutfitSetupWearables {
  return equippedWearables.reduce(
    (acc: OutfitSetupWearables, wearableURN: URNWithoutTokenId) => {
      const entityMetadata = catalystWearables[wearableURN]
      const data =
        (entityMetadata as WearableEntityMetadata).data ??
        (entityMetadata as EmoteEntityMetadata)?.emoteDataADR74
      acc[data.category as WearableCategory] = wearableURN
      return acc
    },
    { ...EMPTY_OUTFIT.wearables }
  )
}

export function getWearablesFromOutfit(
  outfit: OutfitSetup
): URNWithoutTokenId[] {
  const result: URNWithoutTokenId[] = []
  Object.keys(WEARABLE_CATEGORY_DEFINITIONS).forEach((category): void => {
    if (
      outfit.wearables[category as WearableCategory] !== null &&
      category !== WEARABLE_CATEGORY_DEFINITIONS.body_shape.id
    ) {
      result.push(
        outfit.wearables[category as WearableCategory] as URNWithoutTokenId
      )
    }
  })
  return result
}

function fromBaseToURN(baseKey: string): URNWithoutTokenId {
  return `urn:decentraland:off-chain:base-avatars:${baseKey}` as URNWithoutTokenId
}

import {
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from './wearable-categories'
import type { URNWithoutTokenId } from '../utils/definitions'
import type { CatalystWearableMap } from '../utils/wearables-definitions'

export function forceRenderHasEffect(
  category: WearableCategory,
  currentWearableURN: URNWithoutTokenId | null,
  wearablesData: CatalystWearableMap,
  equippedWearables: URNWithoutTokenId[]
): boolean {
  if (category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id) return false
  if (currentWearableURN === null) return false
  const categoryIsHead = [
    WEARABLE_CATEGORY_DEFINITIONS.hair.id,
    WEARABLE_CATEGORY_DEFINITIONS.facial_hair.id,
    WEARABLE_CATEGORY_DEFINITIONS.eyebrows.id,
    WEARABLE_CATEGORY_DEFINITIONS.eyes.id,
    WEARABLE_CATEGORY_DEFINITIONS.mouth.id
  ].includes(category)

  return equippedWearables.some((wearableURN: URNWithoutTokenId) => {
    if (currentWearableURN === wearableURN) return false

    return (
      wearablesData[wearableURN].data.hides.includes(category) ||
      (categoryIsHead && wearablesData[wearableURN].data.hides.includes('head'))
    )
  })
}

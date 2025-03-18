import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { WearableCategoryButton } from './WearableCategoryButton'
import {
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from '../../service/wearable-categories'
import { type OutfitSetup } from '../../utils/wearables-definitions'
import { store } from '../../state/store'
import { catalystWearableMap } from '../../utils/wearables-promise-utils'
import { type URNWithoutTokenId } from '../../utils/definitions'

type WearableCategoryListProps = {
  activeCategory: WearableCategory | null
  outfitSetup: OutfitSetup
  onSelectCategory: (w: WearableCategory | null) => void
}

export function WearableCategoryList({
  activeCategory,
  outfitSetup,
  onSelectCategory
}: WearableCategoryListProps): ReactElement {
  const wearableCategoryColumns = Object.keys(
    WEARABLE_CATEGORY_DEFINITIONS
  ).reduce(
    (acc: [WearableCategory[], WearableCategory[]], categoryId, index) => {
      acc[index % 2 === 0 ? 0 : 1].push(categoryId as WearableCategory)
      return acc
    },
    [[], []]
  )

  return (
    <UiEntity>
      <UiEntity uiTransform={{ flexDirection: 'column' }}>
        {wearableCategoryColumns[0].map((category) => (
          <WearableCategoryButton
            category={category}
            active={activeCategory === category}
            onClick={() => {
              onSelectCategory(activeCategory === category ? null : category)
            }}
            selectedURN={
              categoryIsBody(category)
                ? outfitSetup?.base?.bodyShapeUrn
                : outfitSetup.wearables[category]
            }
            showForceRender={forceRenderHasEffect(
              category,
              outfitSetup.wearables[category]
            )}
            forceRender={isCategoryInForceRender(category)}
          />
        ))}
      </UiEntity>
      <UiEntity uiTransform={{ flexDirection: 'column' }}>
        {wearableCategoryColumns[1].map((category) => (
          <WearableCategoryButton
            category={category}
            active={activeCategory === category}
            onClick={() => {
              onSelectCategory(activeCategory === category ? null : category)
            }}
            selectedURN={outfitSetup.wearables[category]}
            showForceRender={forceRenderHasEffect(
              category,
              outfitSetup.wearables[category]
            )}
            forceRender={isCategoryInForceRender(category)}
          />
        ))}
      </UiEntity>
    </UiEntity>
  )
}

function isCategoryInForceRender(category: WearableCategory): boolean {
  return store.getState().backpack.forceRender.includes(category)
}

function forceRenderHasEffect(
  category: WearableCategory,
  currentWearableURN: URNWithoutTokenId | null
): boolean {
  // TODO unit test candidate
  if (category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id) return false
  if (currentWearableURN === null) return false
  const categoryIsHead = [
    WEARABLE_CATEGORY_DEFINITIONS.hair.id,
    WEARABLE_CATEGORY_DEFINITIONS.facial_hair.id,
    WEARABLE_CATEGORY_DEFINITIONS.eyebrows.id,
    WEARABLE_CATEGORY_DEFINITIONS.eyes.id,
    WEARABLE_CATEGORY_DEFINITIONS.mouth.id
  ].includes(category)

  return store
    .getState()
    .backpack.equippedWearables.some((wearableURN: URNWithoutTokenId) => {
      if (currentWearableURN === wearableURN) return false

      return (
        catalystWearableMap[wearableURN].data.hides.includes(category) ||
        (categoryIsHead &&
          catalystWearableMap[wearableURN].data.hides.includes('head'))
      )
    })
}

function categoryIsBody(category: WearableCategory): boolean {
  return category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id
}

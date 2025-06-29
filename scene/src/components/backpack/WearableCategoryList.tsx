import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { WearableCategoryButton } from './WearableCategoryButton'
import {
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from '../../service/categories'
import { type OutfitSetup } from '../../utils/item-definitions'
import { store } from '../../state/store'

import { forceRenderHasEffect } from '../../service/force-render-service'
import { catalystMetadataMap } from '../../utils/catalyst-metadata-map'

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
  const backpackState = store.getState().backpack

  return (
    <UiEntity>
      <UiEntity uiTransform={{ flexDirection: 'column' }}>
        {wearableCategoryColumns[0].map((category: WearableCategory) => (
          <WearableCategoryButton
            key={category}
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
              outfitSetup.wearables[category],
              catalystMetadataMap,
              backpackState.equippedWearables
            )}
            forceRender={isCategoryInForceRender(category)}
          />
        ))}
      </UiEntity>
      <UiEntity uiTransform={{ flexDirection: 'column' }}>
        {wearableCategoryColumns[1].map((category) => (
          <WearableCategoryButton
            key={category}
            category={category}
            active={activeCategory === category}
            onClick={() => {
              onSelectCategory(activeCategory === category ? null : category)
            }}
            selectedURN={outfitSetup.wearables[category]}
            showForceRender={forceRenderHasEffect(
              category,
              outfitSetup.wearables[category],
              catalystMetadataMap,
              backpackState.equippedWearables
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
function categoryIsBody(category: WearableCategory): boolean {
  return category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id
}

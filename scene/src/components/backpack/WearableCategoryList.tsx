import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { WearableCategoryButton } from './WearableCategoryButton'
import {
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from '../../service/wearable-categories'
import { type OutfitSetup } from '../../utils/wearables-definitions'

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
            showForceRender={forceRenderHasEffect(category)}
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
            showForceRender={forceRenderHasEffect(category)}
          />
        ))}
      </UiEntity>
    </UiEntity>
  )
}

function forceRenderHasEffect(category: WearableCategory): boolean {
  if (category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id) return false
  // TODO add more cases:
  //  - if no other wearable is hidding this category
  //  - ...
  return true
}

function categoryIsBody(category: WearableCategory): boolean {
  return category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id
}

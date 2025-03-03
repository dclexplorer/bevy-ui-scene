import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { WearableCategoryButton } from './WearableCategoryButton'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import {WEARABLE_CATEGORY_DEFINITIONS, type WearableCategory} from '../../service/wearable-categories'
import { type OutfitSetup } from '../../utils/wearables-definitions'
import {getURNWithoutTokenId} from "../../utils/URN-utils";
import {type URNWithoutTokenId} from "../../utils/definitions";

type WearableCategoryListProps = {
  activeCategory: WearableCategory | null
  outfitSetup:OutfitSetup
  // eslint-disable-next-line @typescript-eslint/ban-types
  onSelectCategory: Function
}
export function WearableCategoryList({
  activeCategory,
    outfitSetup,
  onSelectCategory
}: WearableCategoryListProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const isWearableCategoryActive = (category: WearableCategory): boolean =>
    activeCategory === category

  return (
    <UiEntity>
      <UiEntity
        uiTransform={{
          flexDirection: 'column'
        }}
      >
        <WearableCategoryButton
          category={WEARABLE_CATEGORY_DEFINITIONS.body_shape.id}
          active={isWearableCategoryActive(WEARABLE_CATEGORY_DEFINITIONS.body_shape.id)}
          onClick={() =>
            onSelectCategory(activeCategory === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id ? null : WEARABLE_CATEGORY_DEFINITIONS.body_shape.id)
          }
          selectedURN={outfitSetup?.base?.bodyShapeUrn as URNWithoutTokenId}
        />
        <WearableCategoryButton
          category={'eyebrows'}
          active={isWearableCategoryActive('eyebrows')}
          onClick={() =>
            onSelectCategory(activeCategory === 'eyebrows' ? null : 'eyebrows')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.eyebrows)}
        />
        <WearableCategoryButton
          category={'mouth'}
          active={isWearableCategoryActive('mouth')}
          onClick={() =>
            onSelectCategory(activeCategory === 'mouth' ? null : 'mouth')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.mouth)}
        />
        <WearableCategoryButton
          category={'upper_body'}
          active={isWearableCategoryActive('upper_body')}
          onClick={() =>
            onSelectCategory(
              activeCategory === 'upper_body' ? null : 'upper_body'
            )
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.upper_body)}
        />
        <WearableCategoryButton
          category={'lower_body'}
          active={isWearableCategoryActive('lower_body')}
          onClick={() =>
            onSelectCategory(
              activeCategory === 'lower_body' ? null : 'lower_body'
            )
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.lower_body)}
        />
        <WearableCategoryButton
          category={'hat'}
          active={isWearableCategoryActive('hat')}
          onClick={() =>
            onSelectCategory(activeCategory === 'hat' ? null : 'hat')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.hat)}
        />
        <WearableCategoryButton
          category={'earring'}
          active={isWearableCategoryActive('earring')}
          onClick={() =>
            onSelectCategory(activeCategory === 'earring' ? null : 'earring')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.earring)}
        />
        <WearableCategoryButton
          category={'tiara'}
          active={isWearableCategoryActive('tiara')}
          onClick={() =>
            onSelectCategory(activeCategory === 'tiara' ? null : 'tiara')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.tiara)}
        />
        <WearableCategoryButton
          category={'helmet'}
          active={isWearableCategoryActive('helmet')}
          onClick={() =>
            onSelectCategory(activeCategory === 'helmet' ? null : 'helmet')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.helmet)}
        />
      </UiEntity>
      <UiEntity
        uiTransform={{
          maxWidth: 280 * canvasScaleRatio * 2,
          flexDirection: 'column'
        }}
        uiBackground={{
          color: { ...Color4.Red(), a: 0.0 }
        }}
      >
        <WearableCategoryButton
          category={'hair'}
          active={isWearableCategoryActive('hair')}
          onClick={() =>
            onSelectCategory(activeCategory === 'hair' ? null : 'hair')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.hair)}
        />
        <WearableCategoryButton
          category={'eyes'}
          active={isWearableCategoryActive('eyes')}
          onClick={() =>
            onSelectCategory(activeCategory === 'eyes' ? null : 'eyes')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.eyes)}
        />
        <WearableCategoryButton
          category={'facial_hair'}
          active={isWearableCategoryActive('facial_hair')}
          onClick={() =>
            onSelectCategory(
              activeCategory === 'facial_hair' ? null : 'facial_hair'
            )
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.facial_hair)}
        />
        <WearableCategoryButton
          category={'hands_wear'}
          active={isWearableCategoryActive('hands_wear')}
          onClick={() =>
            onSelectCategory(
              activeCategory === 'hands_wear' ? null : 'hands_wear'
            )
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.hands_wear)}
        />
        <WearableCategoryButton
          category={'feet'}
          active={isWearableCategoryActive('feet')}
          onClick={() =>
            onSelectCategory(activeCategory === 'feet' ? null : 'feet')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.feet)}
        />
        <WearableCategoryButton
          category={'eyewear'}
          active={isWearableCategoryActive('eyewear')}
          onClick={() =>
            onSelectCategory(activeCategory === 'eyewear' ? null : 'eyewear')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.eyewear)}
        />
        <WearableCategoryButton
          category={'mask'}
          active={isWearableCategoryActive('mask')}
          onClick={() =>
            onSelectCategory(activeCategory === 'mask' ? null : 'mask')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.mask)}
        />
        <WearableCategoryButton
          category={'top_head'}
          active={isWearableCategoryActive('top_head')}
          onClick={() =>
            onSelectCategory(activeCategory === 'top_head' ? null : 'top_head')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.top_head)}
        />
        <WearableCategoryButton
          category={'skin'}
          active={isWearableCategoryActive('skin')}
          onClick={() =>
            onSelectCategory(activeCategory === 'skin' ? null : 'skin')
          }
          selectedURN={getURNWithoutTokenId(outfitSetup.wearables.skin)}
        />
      </UiEntity>
    </UiEntity>
  )
}

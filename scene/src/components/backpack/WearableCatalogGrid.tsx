import { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import type { URNWithoutTokenId } from '../../utils/definitions'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import type { CatalogWearableElement } from '../../utils/wearables-definitions'
import { noop } from '../../utils/function-utils'
import { WEARABLE_CATEGORY_DEFINITIONS } from '../../service/wearable-categories'
import { EMPTY_OUTFIT } from '../../service/outfit'
import { type PBAvatarBase } from '../../bevy-api/interface'
import { WearableCatalogItem } from './WearableCatalogItem'

export type WearableCatalogGridProps = {
  wearables: CatalogWearableElement[]
  equippedWearables: URNWithoutTokenId[]
  baseBody: PBAvatarBase
  uiTransform: UiTransformProps
  loading: boolean
  onChangeSelection?: (wearableURN: URNWithoutTokenId | null) => void
  onEquipWearable: (wearable: CatalogWearableElement) => Promise<void> | void
  onUnequipWearable: (wearable: CatalogWearableElement) => Promise<void> | void
}

type WearableCatalogGridState = {
  selectedWearableURN: URNWithoutTokenId | null
}

const state: WearableCatalogGridState = {
  selectedWearableURN: null
}

const isEquippedMemo: {
  equippedWearables: URNWithoutTokenId[]
  baseBody: PBAvatarBase
  memo: Map<URNWithoutTokenId, boolean>
} = {
  equippedWearables: [],
  memo: new Map(),
  baseBody: { ...EMPTY_OUTFIT.base }
}

export function WearableCatalogGrid({
  wearables,
  equippedWearables,
  baseBody,
  uiTransform,
  loading,
  onChangeSelection = noop,
  onEquipWearable = noop,
  onUnequipWearable = noop
}: WearableCatalogGridProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity
      uiTransform={{
        padding: 10 * canvasScaleRatio,
        width: 950 * canvasScaleRatio,
        flexWrap: 'wrap',
        ...uiTransform
      }}
    >
      {wearables.map((wearableElement:CatalogWearableElement, index:number) => <WearableCatalogItem
        key={index}
        wearableElement={wearableElement}
        onEquipWearable={(wearableElement:CatalogWearableElement) => {
          void onEquipWearable(wearableElement)
        }}
        onUnequipWearable={(wearableElement:CatalogWearableElement) => {
          void onUnequipWearable(wearableElement)
        }}
        onSelect={()=>{
          select(isSelected(wearableElement.urn) ? null : wearableElement.urn)
          onChangeSelection(state.selectedWearableURN)
        }}
        isSelected={isSelected(wearableElement?.urn)}
        isEquipped={isEquipped(wearableElement, equippedWearables, baseBody)}
        loading={loading}
      />)}
    </UiEntity>
  )
}

function isSelected(wearableURN: URNWithoutTokenId): boolean {
  return state.selectedWearableURN === wearableURN
}

function select(wearableURNWithoutTokenId: null | URNWithoutTokenId): void {
  state.selectedWearableURN = wearableURNWithoutTokenId
}

function isEquipped(
  wearable: CatalogWearableElement,
  equippedWearables: URNWithoutTokenId[] = [],
  baseBody: PBAvatarBase
): boolean {
  if (wearable === null) return false
  if (
    equippedWearables !== isEquippedMemo.equippedWearables ||
    isEquippedMemo.baseBody !== baseBody
  ) {
    isEquippedMemo.equippedWearables = equippedWearables
    isEquippedMemo.baseBody = baseBody
    isEquippedMemo.memo.clear()
  }

  if (isEquippedMemo.memo.has(wearable.urn)) {
    return isEquippedMemo.memo.get(wearable.urn) as boolean
  }

  const equipped = isBodyCategory(wearable)
    ? baseBody.bodyShapeUrn === wearable.urn
    : equippedWearables.includes(wearable.urn)

  isEquippedMemo.memo.set(wearable.urn, equipped)
  return equipped
}

function isBodyCategory(wearable: CatalogWearableElement): boolean {
  return wearable.category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id
}



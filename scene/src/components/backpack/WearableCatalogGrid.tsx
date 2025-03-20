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
import { COLOR } from '../color-palette'
import { Color4 } from '@dcl/sdk/math'
import Icon from '../icon/Icon'
import { openExternalUrl } from '~system/RestrictedActions'

export type WearableCatalogGridProps = {
  wearables: CatalogWearableElement[]
  equippedWearables: URNWithoutTokenId[]
  baseBody: PBAvatarBase
  uiTransform: UiTransformProps
  loading: boolean
  onChangeSelection?: (wearableURN: URNWithoutTokenId | null) => void
  onEquipWearable: (wearable: CatalogWearableElement) => void
  onUnequipWearable: (wearable: CatalogWearableElement) => void
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
  if (!wearables.length) {
    return (
      <UiEntity
        uiTransform={{
          padding: {
            left: 10 * canvasScaleRatio,
            right: 10 * canvasScaleRatio,
            top: 380 * canvasScaleRatio
          },
          flexWrap: 'wrap',
          width: 950 * canvasScaleRatio,
          flexDirection: 'column',
          justifyContent: 'center',
          ...uiTransform
        }}
      >
        <Icon
          uiTransform={{ alignSelf: 'center' }}
          iconSize={canvasScaleRatio * 100}
          icon={{ atlasName: 'backpack', spriteName: 'empty-search-result' }}
        />
        <UiEntity
          uiTransform={{
            margin: { top: canvasScaleRatio * 20 }
          }}
          uiText={{
            textAlign: 'middle-center',
            value: `You do not have any wearable that meets this category or search criteria.
If you want you can find the ideal one for you in the <color=${Color4.toHexString(
              COLOR.LINK_COLOR
            )}><u>Marketplace.</u></color>`,
            fontSize: canvasScaleRatio * 25
          }}
        />
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: {
              top: canvasScaleRatio * 530,
              left: canvasScaleRatio * 640
            },
            height: 30,
            width: 200 * canvasScaleRatio
          }}
          uiBackground={{ color: Color4.create(0, 0, 0, 0) }}
          onMouseDown={linkToMarketPlace}
        />
      </UiEntity>
    )
  }
  return (
    <UiEntity
      uiTransform={{
        padding: 10 * canvasScaleRatio,
        width: 950 * canvasScaleRatio,
        flexWrap: 'wrap',
        ...uiTransform
      }}
    >
      {wearables.map(
        (wearableElement: CatalogWearableElement, index: number) => (
          <WearableCatalogItem
            uiTransform={{}}
            key={index}
            wearableElement={wearableElement}
            onEquipWearable={(wearableElement: CatalogWearableElement) => {
              onEquipWearable(wearableElement)
            }}
            onUnequipWearable={(wearableElement: CatalogWearableElement) => {
              onUnequipWearable(wearableElement)
            }}
            onSelect={() => {
              select(
                isSelected(wearableElement.urn) ? null : wearableElement.urn
              )
              onChangeSelection(state.selectedWearableURN)
            }}
            isSelected={isSelected(wearableElement?.urn)}
            isEquipped={isEquipped(
              wearableElement,
              equippedWearables,
              baseBody
            )}
            loading={loading}
          />
        )
      )}
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

function linkToMarketPlace(): void {
  openExternalUrl({ url: 'https://decentraland.org/marketplace/' }).catch(
    console.error
  )
}

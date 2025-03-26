import { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import type { URNWithoutTokenId } from '../../utils/definitions'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import {
  type ItemElement,
  type CatalogEmoteElement,
  type CatalogWearableElement
} from '../../utils/item-definitions'
import { noop } from '../../utils/function-utils'
import { CatalogItem } from './CatalogItem'
import { COLOR } from '../color-palette'
import { Color4 } from '@dcl/sdk/math'
import Icon from '../icon/Icon'
import { openExternalUrl } from '~system/RestrictedActions'

export type WearableCatalogGridProps = {
  items: CatalogWearableElement[]
  equippedItems: URNWithoutTokenId[]
  uiTransform: UiTransformProps
  loading: boolean
  onChangeSelection?: (itemURN: URNWithoutTokenId | null) => void
  onEquipWearable: (itemElement: ItemElement) => void
  onUnequipWearable: (itemElement: ItemElement) => void
}

type CatalogGridState = {
  selectedItemURN: URNWithoutTokenId | null
}

const state: CatalogGridState = {
  selectedItemURN: null
}

const isEquippedMemo: {
  equippedItems: URNWithoutTokenId[]
  memo: Map<URNWithoutTokenId, boolean>
} = {
  equippedItems: [],
  memo: new Map()
}

export function CatalogGrid({
  items,
  equippedItems,
  uiTransform,
  loading,
  onChangeSelection = noop,
  onEquipWearable = noop,
  onUnequipWearable = noop
}: WearableCatalogGridProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  if (!items.length) {
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
      {items.map(
        (
          itemElement: CatalogWearableElement | CatalogEmoteElement,
          index: number
        ) => (
          <CatalogItem
            key={index}
            itemElement={itemElement}
            onEquipItem={(itemElement: ItemElement) => {
              onEquipWearable(itemElement)
            }}
            onUnequipItem={(itemElement: ItemElement) => {
              onUnequipWearable(itemElement)
            }}
            onSelect={() => {
              if (isSelected(itemElement.urn)) return
              select(itemElement.urn)
              onChangeSelection(state.selectedItemURN)
            }}
            isSelected={isSelected(itemElement?.urn)}
            isEquipped={isEquipped(itemElement, equippedItems)}
            loading={loading}
          />
        )
      )}
    </UiEntity>
  )
}

function isSelected(wearableURN: URNWithoutTokenId): boolean {
  return state.selectedItemURN === wearableURN
}

function select(wearableURNWithoutTokenId: null | URNWithoutTokenId): void {
  state.selectedItemURN = wearableURNWithoutTokenId
}

function isEquipped(
  itemElement: ItemElement,
  equippedItems: URNWithoutTokenId[] = []
): boolean {
  if (itemElement === null) return false
  if (equippedItems !== isEquippedMemo.equippedItems) {
    isEquippedMemo.equippedItems = equippedItems
    isEquippedMemo.memo.clear()
  }
  if (isEquippedMemo.memo.has(itemElement.urn)) {
    return isEquippedMemo.memo.get(itemElement.urn) as boolean
  }
  const equipped = equippedItems.includes(itemElement.urn)
  isEquippedMemo.memo.set(itemElement.urn, equipped)
  return equipped
}

function linkToMarketPlace(): void {
  openExternalUrl({ url: 'https://decentraland.org/marketplace/' }).catch(
    console.error
  )
}

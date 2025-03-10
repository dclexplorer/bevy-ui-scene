import { Label, UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import type { URNWithoutTokenId } from '../../utils/definitions'
import { Color4 } from '@dcl/sdk/math'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import type { CatalogWearableElement } from '../../utils/wearables-definitions'
import { COLOR } from '../color-palette'
import { noop } from '../../utils/function-utils'
import { WEARABLE_CATEGORY_DEFINITIONS } from '../../service/wearable-categories'
import { EMPTY_OUTFIT } from '../../service/outfit'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../utils/constants'
import { type PBAvatarBase } from '../../bevy-api/interface'

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

const LOADING_TEXTURE_PROPS = getBackgroundFromAtlas({
  atlasName: 'backpack',
  spriteName: 'loading-wearable'
})

const state: WearableCatalogGridState = {
  selectedWearableURN: null
}

const SELECTED_BACKGROUND = {
  ...getBackgroundFromAtlas({
    atlasName: 'backpack',
    spriteName: 'selection'
  })
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
      {wearables.map((wearableElement, index) => {
        return (
          <UiEntity
            uiTransform={{
              width: 210 * canvasScaleRatio,
              height: 210 * canvasScaleRatio,
              margin: 10 * canvasScaleRatio,
              padding: 8 * canvasScaleRatio
            }}
            key={index}
            onMouseDown={() => {
              select(
                isSelected(wearableElement.urn) ? null : wearableElement.urn
              )
              onChangeSelection(state.selectedWearableURN)
            }}
          >
            {!loading &&
            isEquipped(wearableElement, equippedWearables, baseBody) &&
            !isSelected(wearableElement?.urn) ? (
              <UiEntity
                uiTransform={{
                  positionType: 'absolute',
                  width: '100%',
                  height: '100%',
                  position: {
                    top: 0,
                    left: 0
                  }
                }}
                uiBackground={
                  !loading &&
                  isEquipped(wearableElement, equippedWearables, baseBody)
                    ? {
                        ...ROUNDED_TEXTURE_BACKGROUND,
                        texture: {
                          src: 'assets/images/backgrounds/rounded-border.png'
                        },
                        color: COLOR.ACTIVE_BACKGROUND_COLOR
                      }
                    : {}
                }
              />
            ) : null}
            {state.selectedWearableURN !== wearableElement?.urn ? (
              <WearableCellThumbnail
                uiTransform={{
                  width: '100%',
                  height: '100%'
                }}
                catalystWearable={wearableElement}
                canvasScaleRatio={canvasScaleRatio}
                loading={loading}
              />
            ) : null}
            {state.selectedWearableURN === wearableElement?.urn && !loading ? (
              <UiEntity
                uiTransform={{
                  width: canvasScaleRatio * 240,
                  height: canvasScaleRatio * 320,
                  positionType: 'absolute',
                  position: {
                    top: -16 * canvasScaleRatio,
                    left: -12 * canvasScaleRatio
                  },
                  padding: {
                    top: 18 * canvasScaleRatio,
                    left: 13 * canvasScaleRatio
                  },
                  zIndex: 2,
                  flexDirection: 'column',
                  pointerFilter: 'none'
                }}
                uiBackground={SELECTED_BACKGROUND}
              >
                <WearableCellThumbnail
                  uiTransform={{
                    width: canvasScaleRatio * 210,
                    height: canvasScaleRatio * 210
                  }}
                  catalystWearable={wearableElement}
                  canvasScaleRatio={canvasScaleRatio}
                  loading={loading}
                />
                {isEquipped(wearableElement, equippedWearables, baseBody) &&
                wearableElement.category ===
                  WEARABLE_CATEGORY_DEFINITIONS.body_shape.id ? null : (
                  <RoundedButton
                    uiTransform={{
                      margin: {
                        top: 9 * canvasScaleRatio,
                        left: 1
                      },
                      width: 206 * canvasScaleRatio,
                      height: 60 * canvasScaleRatio
                    }}
                    fontSize={26 * canvasScaleRatio}
                    text={
                      isEquipped(wearableElement, equippedWearables, baseBody)
                        ? 'UNEQUIP'
                        : 'EQUIP'
                    }
                    isSecondary={isEquipped(
                      wearableElement,
                      equippedWearables,
                      baseBody
                    )}
                    onClick={() => {
                      if (
                        isEquipped(wearableElement, equippedWearables, baseBody)
                      ) {
                        void onUnequipWearable(wearableElement)
                      } else {
                        void onEquipWearable(wearableElement)
                      }
                    }}
                  />
                )}
              </UiEntity>
            ) : null}
          </UiEntity>
        )
      })}
    </UiEntity>
  )
}

function isSelected(wearableURN: URNWithoutTokenId): boolean {
  return state.selectedWearableURN === wearableURN
}

function select(wearableURNWithoutTokenId: null | URNWithoutTokenId): void {
  state.selectedWearableURN = wearableURNWithoutTokenId
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

  let equipped = false;
  if (wearable.category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id) {
    equipped = baseBody.bodyShapeUrn === wearable.urn
  } else {
    equipped = equippedWearables.includes(wearable.urn)
  }

  isEquippedMemo.memo.set(wearable.urn, equipped)
  return equipped
}


export type WearableCellProps = {
  canvasScaleRatio: number
  loading: boolean
  catalystWearable: CatalogWearableElement
  uiTransform?: UiTransformProps
}
type RoundedButtonProps = {
  uiTransform?: UiTransformProps
  isSecondary?: boolean
  onClick?: () => void
  text: string
  fontSize?: number
}
function RoundedButton({
  isSecondary,
  text,
  onClick = noop,
  uiTransform,
  fontSize = 20
}: RoundedButtonProps): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        pointerFilter: 'block',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...uiTransform
      }}
      onMouseDown={() => {
        onClick()
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: isSecondary === true ? Color4.Black() : Color4.Red()
      }}
    >
      <Label value={text} fontSize={fontSize} />
    </UiEntity>
  )
}

function WearableCellThumbnail({
  canvasScaleRatio,
  loading,
  catalystWearable,
  uiTransform
}: WearableCellProps): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: canvasScaleRatio * 180,
        height: canvasScaleRatio * 180,
        ...uiTransform
      }}
      uiBackground={{
        ...(loading
          ? LOADING_TEXTURE_PROPS
          : getBackgroundFromAtlas({
              spriteName: catalystWearable?.rarity ?? 'base',
              atlasName: 'backpack'
            }))
      }}
    >
      {!loading && Boolean(catalystWearable?.urn) ? (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
          uiBackground={{
            texture: {
              src: `https://peer.decentraland.org/lambdas/collections/contents/${catalystWearable.urn}/thumbnail`
            },
            textureMode: 'stretch'
          }}
        ></UiEntity>
      ) : null}
    </UiEntity>
  )
}

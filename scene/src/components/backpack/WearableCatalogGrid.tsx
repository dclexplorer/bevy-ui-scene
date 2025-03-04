import { Label, UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { type URN, type URNWithoutTokenId } from '../../utils/definitions'
import { Color4 } from '@dcl/sdk/math'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import type { CatalogWearableElement } from '../../utils/wearables-definitions'
import { COLOR } from '../color-palette'
import { noop } from '../../utils/function-utils'
import { getURNWithoutTokenId } from '../../utils/URN-utils'
import { type PBAvatarBase } from '@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_base.gen'
import { WEARABLE_CATEGORY_DEFINITIONS } from '../../service/wearable-categories'
import { EMPTY_OUTFIT } from '../../service/outfit'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../utils/constants'

export type WearableCatalogGridProps = {
  wearables: CatalogWearableElement[]
  equippedWearables: URN[]
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
        width: 840 * canvasScaleRatio,
        flexWrap: 'wrap',
        ...uiTransform
      }}
      uiBackground={{ color: Color4.create(1, 0, 0, 0) }}
    >
      {wearables.map((_, index) => {
        return (
          <UiEntity
            uiTransform={{
              width: 180 * canvasScaleRatio,
              height: 180 * canvasScaleRatio,
              padding: 8 * canvasScaleRatio,
              margin: 10 * canvasScaleRatio
            }}
            key={index}
            uiBackground={
              !loading &&
              isEquipped(_, equippedWearables, baseBody) &&
              !isSelected(_?.urn)
                ? {
                    ...ROUNDED_TEXTURE_BACKGROUND,
                    texture: {
                      // TODO improve image border
                      src: 'assets/images/backgrounds/rounded-border.png'
                    },
                    color: COLOR.ACTIVE_BACKGROUND_COLOR
                  }
                : {}
            }
            onMouseDown={() => {
              select(isSelected(_.urn) ? null : _.urn)
              onChangeSelection(state.selectedWearableURN)
            }}
          >
            {state.selectedWearableURN !== _?.urn ? (
              <WearableCellThumbnail
                catalystWearable={_}
                canvasScaleRatio={canvasScaleRatio}
                loading={loading}
              />
            ) : null}
            {state.selectedWearableURN === _?.urn && !loading ? (
              <UiEntity
                uiTransform={{
                  width: canvasScaleRatio * 220,
                  height: canvasScaleRatio * 300,
                  positionType: 'absolute',
                  position: {
                    top: -6 * canvasScaleRatio,
                    left: -16 * canvasScaleRatio
                  },
                  padding: {
                    top: 24 * canvasScaleRatio,
                    left: 16 * canvasScaleRatio
                  },
                  zIndex: 2,
                  flexDirection: 'column',
                  pointerFilter: 'none'
                }}
                uiBackground={SELECTED_BACKGROUND}
              >
                <WearableCellThumbnail
                  catalystWearable={_}
                  canvasScaleRatio={canvasScaleRatio}
                  loading={loading}
                />
                {isEquipped(_, equippedWearables, baseBody) &&
                _.category ===
                  WEARABLE_CATEGORY_DEFINITIONS.body_shape.id ? null : (
                  <RoundedButton
                    uiTransform={{
                      margin: { top: 10 * canvasScaleRatio },
                      width: 180 * canvasScaleRatio,
                      height: 60 * canvasScaleRatio
                    }}
                    fontSize={26 * canvasScaleRatio}
                    text={
                      isEquipped(_, equippedWearables, baseBody)
                        ? 'UNEQUIP'
                        : 'EQUIP'
                    }
                    isSecondary={isEquipped(_, equippedWearables, baseBody)}
                    onClick={() => {
                      if (isEquipped(_, equippedWearables, baseBody)) {
                        void onUnequipWearable(_)
                      } else {
                        void onEquipWearable(_)
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
  equippedWearables: URN[]
  baseBody: PBAvatarBase
  memo: Record<URN, boolean> // TODO consider using Map if possible for performance improvement because long keys
} = {
  equippedWearables: [],
  memo: {},
  baseBody: { ...EMPTY_OUTFIT.base }
}

function isEquipped(
  wearable: CatalogWearableElement,
  equippedWearables: URN[] = [],
  baseBody: PBAvatarBase
): boolean {
  if (wearable === null) return false
  if (
    equippedWearables !== isEquippedMemo.equippedWearables ||
    isEquippedMemo.baseBody !== baseBody
  ) {
    isEquippedMemo.equippedWearables = equippedWearables
    isEquippedMemo.baseBody = baseBody
    isEquippedMemo.memo = {}
  }
  if (isEquippedMemo.memo[wearable.urn] !== undefined)
    return isEquippedMemo.memo[wearable.urn]
  if (wearable.category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id) {
    isEquippedMemo.memo[wearable.urn] = baseBody.bodyShapeUrn === wearable.urn
  } else {
    isEquippedMemo.memo[wearable.urn] = equippedWearables
      .map((i) => getURNWithoutTokenId(i))
      .includes(wearable.urn)
  }

  return isEquippedMemo.memo[wearable.urn]
}

export type WearableCellProps = {
  canvasScaleRatio: number
  loading: boolean
  catalystWearable: CatalogWearableElement
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
  catalystWearable
}: WearableCellProps): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: canvasScaleRatio * 180,
        height: canvasScaleRatio * 180
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

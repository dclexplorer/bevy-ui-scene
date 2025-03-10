import { Label, UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import type { CatalogWearableElement } from '../../utils/wearables-definitions'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { noop } from '../../utils/function-utils'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../utils/constants'
import { COLOR } from '../color-palette'
import { WEARABLE_CATEGORY_DEFINITIONS } from '../../service/wearable-categories'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { Color4 } from '@dcl/sdk/math'

type WearableCatalogItemProps = {
  uiTransform?: UiTransformProps
  key: number
  isEquipped: boolean
  isSelected: boolean
  loading: boolean
  wearableElement: CatalogWearableElement
  onUnequipWearable: (wearableElement: CatalogWearableElement) => void
  onEquipWearable: (wearableElement: CatalogWearableElement) => void
  onSelect: () => void
}

const SELECTED_BACKGROUND = {
  ...getBackgroundFromAtlas({
    atlasName: 'backpack',
    spriteName: 'selection'
  })
}

const LOADING_TEXTURE_PROPS = getBackgroundFromAtlas({
  atlasName: 'backpack',
  spriteName: 'loading-wearable'
})

export function WearableCatalogItem(
  props: WearableCatalogItemProps
): ReactElement {
  const {
    isEquipped,
    isSelected,
    onSelect = noop,
    loading = true,
    wearableElement,
    onUnequipWearable = noop,
    onEquipWearable = noop,
    uiTransform
  } = props
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity
      uiTransform={{
        width: 210 * canvasScaleRatio,
        height: 210 * canvasScaleRatio,
        margin: 10 * canvasScaleRatio,
        padding: 8 * canvasScaleRatio,
        ...uiTransform
      }}
      onMouseDown={onSelect}
    >
      {!loading && isEquipped && !isSelected ? (
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
            !loading && isEquipped
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
      {!isSelected ? (
        <WearableCellThumbnail
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
          wearableElement={wearableElement}
          loading={loading}
        />
      ) : null}
      {isSelected && !loading && (
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
            wearableElement={wearableElement}
            loading={loading}
          />
          {isEquipped &&
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
              text={isEquipped ? 'UNEQUIP' : 'EQUIP'}
              isSecondary={isEquipped}
              onClick={() => {
                if (isEquipped) {
                  onUnequipWearable(wearableElement)
                } else {
                  onEquipWearable(wearableElement)
                }
              }}
            />
          )}
        </UiEntity>
      )}
    </UiEntity>
  )
}

type WearableCellProps = {
  loading: boolean
  wearableElement: CatalogWearableElement
  uiTransform?: UiTransformProps
}

function WearableCellThumbnail({
  loading,
  wearableElement,
  uiTransform
}: WearableCellProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()

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
              spriteName: wearableElement?.rarity ?? 'base',
              atlasName: 'backpack'
            }))
      }}
    >
      {!loading && Boolean(wearableElement?.urn) ? (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
          uiBackground={{
            texture: {
              src: `https://peer.decentraland.org/lambdas/collections/contents/${wearableElement.urn}/thumbnail`
            },
            textureMode: 'stretch'
          }}
        ></UiEntity>
      ) : null}
    </UiEntity>
  )
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

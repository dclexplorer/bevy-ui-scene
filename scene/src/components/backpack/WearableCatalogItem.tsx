import { Label, UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import type { CatalogWearableElement } from '../../utils/wearables-definitions'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { noop } from '../../utils/function-utils'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../utils/constants'
import { COLOR } from '../color-palette'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { Color4 } from '@dcl/sdk/math'
import Icon from '../icon/Icon'

const SELECTED_BACKGROUND = getBackgroundFromAtlas({
  atlasName: 'backpack',
  spriteName: 'catalog-selection-frame'
})

const LOADING_TEXTURE_PROPS = getBackgroundFromAtlas({
  atlasName: 'backpack',
  spriteName: 'loading-wearable'
})
const DOUBLE_CLICK_DELAY = 400

type WearableCatalogItemProps = {
  uiTransform?: UiTransformProps
  key: number
  isEquipped: boolean
  isSelected: boolean
  loading: boolean
  wearableElement: CatalogWearableElement
  onUnequipWearable?: (wearableElement: CatalogWearableElement) => void
  onEquipWearable?: (wearableElement: CatalogWearableElement) => void
  onSelect?: () => void
}
const state: any = { hoveredURN: null, lastTimeClick: 0 }

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
  const mustShowEquippedBorder = (): boolean =>
    !loading && isEquipped && !isSelected
  const mustShowSelectedOverlay = (): boolean => isSelected && !loading
  const isHovered = (): boolean => state.hoveredURN === wearableElement?.urn
  return (
    <UiEntity
      uiTransform={{
        width: 210 * canvasScaleRatio,
        height: 210 * canvasScaleRatio,
        margin: 10 * canvasScaleRatio,
        padding: 8 * canvasScaleRatio,
        ...uiTransform
      }}
      onMouseDown={() => {
        if (state.lastTimeClick + DOUBLE_CLICK_DELAY > Date.now()) {
          onEquipWearable(wearableElement)
        } else {
          state.lastTimeClick = Date.now()
          onSelect()
        }
      }}
      onMouseEnter={() => {
        console.log('hoveredURN', wearableElement.urn)
        state.hoveredURN = wearableElement.urn
      }}
    >
      {mustShowEquippedBorder() && <EquippedBorder />}
      {isHovered() && <HoverBorder />}
      {!isSelected && (
        <WearableCellThumbnail
          uiTransform={{ width: '100%', height: '100%' }}
          wearableElement={wearableElement}
          loading={loading}
        />
      )}
      {mustShowSelectedOverlay() && (
        <SelectedWearableOverlay
          wearableElement={wearableElement}
          isEquipped={isEquipped}
          onEquipWearable={onEquipWearable}
          onUnequipWearable={onUnequipWearable}
        />
      )}
    </UiEntity>
  )
}

function HoverBorder(): ReactElement | null {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        width: '105%',
        height: '100%',
        position: { top: '-2%', left: '-2%' }
      }}
      uiBackground={{
        ...getBackgroundFromAtlas({
          spriteName: 'hover-item',
          atlasName: 'backpack'
        })
      }}
    />
  )
}

function EquippedBorder(): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        width: '100%',
        height: '95%',
        position: { top: 0, left: 0 }
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        texture: { src: 'assets/images/backgrounds/rounded-border.png' },
        color: COLOR.ACTIVE_BACKGROUND_COLOR
      }}
    />
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
      uiBackground={
        loading
          ? LOADING_TEXTURE_PROPS
          : getBackgroundFromAtlas({
              spriteName: `rarity-background-${
                wearableElement?.rarity ?? 'base'
              }`,
              atlasName: 'backpack'
            })
      }
    >
      {!loading && wearableElement?.urn && (
        <WearableImage wearableElement={wearableElement} />
      )}
      {wearableElement?.individualData?.length > 1 && (
        <UiEntity
          uiTransform={{
            alignSelf: 'flex-end',
            margin: { right: '2%', bottom: '8%' }
          }}
          uiBackground={{
            ...ROUNDED_TEXTURE_BACKGROUND,
            color: COLOR.SMALL_TAG_BACKGROUND
          }}
        >
          <Label value={`${wearableElement.individualData.length}X`} />
        </UiEntity>
      )}
    </UiEntity>
  )
}

function WearableImage({
  wearableElement
}: {
  wearableElement: CatalogWearableElement
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{ width: '95%', height: '95%' }}
      uiBackground={{
        texture: {
          src: `https://peer.decentraland.org/lambdas/collections/contents/${wearableElement.urn}/thumbnail`
        },
        textureMode: 'stretch'
      }}
    >
      <UiEntity
        uiTransform={{ width: '50%', height: '50%', positionType: 'absolute' }}
        uiBackground={getBackgroundFromAtlas({
          atlasName: 'backpack',
          spriteName: `rarity-corner-${wearableElement.rarity ?? 'base'}`
        })}
      >
        <Icon
          uiTransform={{ margin: { top: '5%', left: '8%' } }}
          iconSize={'40%'}
          icon={{
            atlasName: 'backpack',
            spriteName: `category-${wearableElement.category}`
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

type SelectedWearableOverlayProps = {
  wearableElement: CatalogWearableElement
  isEquipped: boolean
  onEquipWearable: (w: CatalogWearableElement) => void
  onUnequipWearable: (w: CatalogWearableElement) => void
}

function SelectedWearableOverlay({
  wearableElement,
  isEquipped,
  onEquipWearable,
  onUnequipWearable
}: SelectedWearableOverlayProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        width: canvasScaleRatio * 260,
        height: canvasScaleRatio * 320,
        positionType: 'absolute',
        position: { top: -16 * canvasScaleRatio, left: -23 * canvasScaleRatio },
        padding: {
          top: 24 * canvasScaleRatio,
          left: 24 * canvasScaleRatio,
          bottom: 24 * canvasScaleRatio
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
        loading={false}
      />
      <RoundedButton
        uiTransform={{
          margin: { top: 9 * canvasScaleRatio, left: 1 },
          width: 206 * canvasScaleRatio,
          height: 60 * canvasScaleRatio
        }}
        fontSize={26 * canvasScaleRatio}
        text={isEquipped ? 'UNEQUIP' : 'EQUIP'}
        isSecondary={isEquipped}
        onClick={() => {
          isEquipped
            ? onUnequipWearable?.(wearableElement)
            : onEquipWearable?.(wearableElement)
        }}
      />
    </UiEntity>
  )
}

function RoundedButton({
  isSecondary,
  text,
  onClick = noop,
  uiTransform,
  fontSize = 20
}: {
  isSecondary?: boolean
  text: string
  onClick?: () => void
  uiTransform?: UiTransformProps
  fontSize?: number
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        pointerFilter: 'block',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...uiTransform
      }}
      onMouseDown={onClick}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: isSecondary ? Color4.Black() : Color4.Red()
      }}
    >
      <Label value={text} fontSize={fontSize} />
    </UiEntity>
  )
}

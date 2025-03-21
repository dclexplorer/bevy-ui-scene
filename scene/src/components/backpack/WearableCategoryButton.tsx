import { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { type WearableCategory } from '../../service/wearable-categories'
import ReactEcs, {
  type ReactElement,
  type UiBackgroundProps
} from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { Color4 } from '@dcl/sdk/math'
import { COLOR } from '../color-palette'
import Icon from '../icon/Icon'
import type { AtlasIcon, URNWithoutTokenId } from '../../utils/definitions'
import { noop } from '../../utils/function-utils'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { catalystWearableMap } from '../../utils/wearables-promise-utils'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../utils/constants'
import { store } from '../../state/store'
import { switchForceRenderCategory } from '../../state/backpack/actions'
import { updateAvatarPreview } from './AvatarPreview'

type WearableCategoryButtonProps = {
  uiTransform?: UiTransformProps
  category: WearableCategory
  active?: boolean
  onClick?: () => void
  selectedURN: URNWithoutTokenId | null
  forceRender?: boolean
  showForceRender?: boolean
}
const state: { hoveredCategory: null | WearableCategory } = {
  hoveredCategory: null
}

export function WearableCategoryButton({
  category,
  uiTransform,
  active,
  onClick = noop,
  selectedURN,
  forceRender = false,
  showForceRender = true
}: WearableCategoryButtonProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const categoryIcon: AtlasIcon = {
    spriteName: `category-${category}`,
    atlasName: 'backpack'
  }
  const iconSize = 68 * canvasScaleRatio
  const thumbnailSize = iconSize * 1.7
  const textureProps: UiBackgroundProps = selectedURN
    ? getWearableThumbnailBackground(selectedURN)
    : getBackgroundFromAtlas({
        atlasName: 'backpack',
        spriteName: 'empty-wearable-field' // TODO change and fix file
      })
  const isHovered = (): boolean => state.hoveredCategory === category
  return (
    <UiEntity
      uiTransform={{
        ...uiTransform,
        width: 239 * canvasScaleRatio,
        height: 133 * canvasScaleRatio,
        margin: {
          left: 20 * canvasScaleRatio,
          bottom: 12 * canvasScaleRatio
        },
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 4 * canvasScaleRatio
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color:
          active === true
            ? COLOR.ACTIVE_BACKGROUND_COLOR
            : Color4.create(0, 0, 0, 0.2)
      }}
      onMouseDown={() => {
        onClick()
      }}
      onMouseEnter={() => {
        state.hoveredCategory = category
      }}
      onMouseLeave={() => {
        if (!(state.hoveredCategory && state.hoveredCategory !== category)) {
          state.hoveredCategory = null
        }
      }}
    >
      <Icon icon={categoryIcon} iconSize={iconSize} />
      <UiEntity
        uiTransform={{
          width: 124 * canvasScaleRatio,
          height: 124 * canvasScaleRatio,
          display: selectedURN === null ? 'none' : 'flex',
          positionType: 'absolute',
          position: {
            left: 54 * canvasScaleRatio * 2
          }
        }}
      />
      <UiEntity
        uiTransform={{
          width: 116 * canvasScaleRatio,
          height: 116 * canvasScaleRatio,
          display: selectedURN === null ? 'none' : 'flex',
          positionType: 'absolute',
          position: {
            left: 112 * canvasScaleRatio
          }
        }}
        uiBackground={getBackgroundFromAtlas({
          atlasName: 'backpack',
          spriteName: `rarity-background-${
            catalystWearableMap[selectedURN as URNWithoutTokenId]?.rarity ??
            'base'
          }`
        })}
      />
      <UiEntity
        uiTransform={{
          width: thumbnailSize,
          height: thumbnailSize,
          position: {
            left: 6 * canvasScaleRatio
          }
        }}
        uiBackground={{
          ...textureProps
        }}
      >
        {isHovered() && <HoveredSquare />}
        {(forceRender || showForceRender) && (
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              height: '40%',
              width: '40%',
              position: {
                right: '-14%',
                bottom: '-14%'
              }
            }}
            uiBackground={{
              ...ROUNDED_TEXTURE_BACKGROUND,
              color: Color4.fromHexString('#4E0E78')
            }}
            onMouseDown={() => {
              store.dispatch(switchForceRenderCategory(category))
              updateAvatarPreview(
                store.getState().backpack.equippedWearables,
                store.getState().backpack.outfitSetup.base,
                store.getState().backpack.forceRender
              )
            }}
          >
            <UiEntity
              uiTransform={{
                width: '90%',
                height: '90%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              uiBackground={{
                ...ROUNDED_TEXTURE_BACKGROUND,
                color: Color4.White()
              }}
            >
              <Icon
                icon={{
                  atlasName: 'icons',
                  spriteName: forceRender ? 'PreviewIcon' : 'HideUIIcon'
                }}
                iconSize={32 * canvasScaleRatio}
                iconColor={forceRender ? Color4.Green() : Color4.Red()}
                uiTransform={{ flexShrink: 0 }}
              />
            </UiEntity>
          </UiEntity>
        )}
      </UiEntity>
    </UiEntity>
  )
}
function HoveredSquare(): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: '102%',
        height: '98%',
        positionType: 'absolute',
        position: {
          left: '-2%',
          top: '-1.5%'
        }
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        texture: { src: 'assets/images/backgrounds/rounded-border.png' },
        color: COLOR.ACTIVE_BACKGROUND_COLOR
      }}
    />
  )
}
function getWearableThumbnailBackground(
  selectedURN: URNWithoutTokenId
): UiBackgroundProps {
  return {
    texture: {
      src: `https://peer.decentraland.org/lambdas/collections/contents/${selectedURN}/thumbnail`
    },
    textureMode: 'stretch'
  }
}

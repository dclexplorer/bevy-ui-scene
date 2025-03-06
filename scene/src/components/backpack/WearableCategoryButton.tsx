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

type WearableCategoryButtonProps = {
  uiTransform?: UiTransformProps
  category: WearableCategory
  active?: boolean
  onClick?: () => void
  selectedURN: URNWithoutTokenId | null
}
export function WearableCategoryButton({
  category,
  uiTransform,
  active,
  onClick,
  selectedURN
}: WearableCategoryButtonProps): ReactElement {
  const callbacks: { onClick: () => void } = {
    onClick: onClick ?? noop
  }
  const canvasScaleRatio = getCanvasScaleRatio()
  const categoryIcon: AtlasIcon = {
    spriteName: category,
    atlasName: 'backpack'
  }
  const iconSize = 34 * canvasScaleRatio * 2
  const thumbnailSize = iconSize * 1.7

  const textureProps: UiBackgroundProps =
    selectedURN === null
      ? getBackgroundFromAtlas({
          atlasName: 'backpack',
          spriteName: 'nft-empty'
        })
      : {
          texture: {
            src: `https://peer.decentraland.org/lambdas/collections/contents/${selectedURN}/thumbnail`
          },
          textureMode: 'stretch'
        }

  return (
    <UiEntity
      uiTransform={{
        ...uiTransform,
        width: 124 * canvasScaleRatio * 1.9,
        height: 70 * canvasScaleRatio * 1.9,
        margin: {
          left: 10 * canvasScaleRatio * 2,
          bottom: 6 * canvasScaleRatio * 2
        },
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 2 * canvasScaleRatio * 2
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color:
          active === true
            ? COLOR.ACTIVE_BACKGROUND_COLOR
            : Color4.create(0, 0, 0, 0.2)
      }}
      onMouseDown={() => {
        callbacks.onClick()
      }}
    >
      <Icon icon={categoryIcon} iconSize={iconSize} />
      <UiEntity
        uiTransform={{
          width: 62 * canvasScaleRatio * 2,
          height: 62 * canvasScaleRatio * 2,
          display: selectedURN === null ? 'none' : 'flex',
          positionType: 'absolute',
          position: {
            left: 54 * canvasScaleRatio * 2
          }
        }}
        uiBackground={ROUNDED_TEXTURE_BACKGROUND}
      />
      <UiEntity
        uiTransform={{
          width: 58 * canvasScaleRatio * 2,
          height: 58 * canvasScaleRatio * 2,
          display: selectedURN === null ? 'none' : 'flex',
          positionType: 'absolute',
          position: {
            left: 56 * canvasScaleRatio * 2
          }
        }}
        uiBackground={getBackgroundFromAtlas({
          atlasName: 'backpack',
          spriteName:
            catalystWearableMap[selectedURN as URNWithoutTokenId]?.rarity ??
            'base'
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
      />
    </UiEntity>
  )
}

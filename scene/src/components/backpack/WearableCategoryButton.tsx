import { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { type WearableCategory } from '../../service/wearable-categories'
import ReactEcs, {type ReactElement, type UiBackgroundProps} from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { Color4 } from '@dcl/sdk/math'
import { COLOR } from '../color-palette'
import Icon from '../icon/Icon'
import { type AtlasIcon, type URN } from '../../utils/definitions'
import { noop } from '../../utils/function-utils'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import {catalystWearableMap} from "../../utils/wearables-promise-utils";
import {ROUNDED_TEXTURE_BACKGROUND} from "../../utils/constants";

type WearableCategoryButtonProps = {
  uiTransform?: UiTransformProps
  category: WearableCategory
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick?: Function
  selectedURN: URN | null
}
export function WearableCategoryButton({
  category,
  uiTransform,
  active,
  onClick,
  selectedURN
}: WearableCategoryButtonProps): ReactElement {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const callbacks: { onClick: Function } = {
    onClick: onClick ?? noop
  }
  const canvasScaleRatio = getCanvasScaleRatio()
  const categoryIcon: AtlasIcon = {
    spriteName: category,
    atlasName: 'backpack'
  }
  const iconSize = 34 * canvasScaleRatio * 2;
  const textureProps:UiBackgroundProps = selectedURN === null ? getBackgroundFromAtlas({
      atlasName:"backpack",
      spriteName:"nft-empty"
  }):{
      texture: {
          src:
              selectedURN === null
                  ? 'assets/images/nft-empty.png'
                  : `https://peer.decentraland.org/lambdas/collections/contents/${selectedURN}/thumbnail`
      },
      textureMode: 'stretch'
  }

  return (
    <UiEntity
      uiTransform={{
        width: 124 * canvasScaleRatio * 2,
        height: 70 * canvasScaleRatio * 2,
        margin: {
          left: 20 * canvasScaleRatio * 2,
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
            : Color4.create(0, 0, 0, 0.1)
      }}
      onMouseDown={() => callbacks.onClick()}
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
          spriteName:  catalystWearableMap[selectedURN as URN]?.rarity ?? 'base'
        })}
      />
      <UiEntity
        uiTransform={{
          width: 62 * canvasScaleRatio * 2,
          height: 62 * canvasScaleRatio * 2
        }}
        uiBackground={{
         ...textureProps
        }}
      />
    </UiEntity>
  )
}

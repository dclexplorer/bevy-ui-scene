import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../../utils/constants'
import { NavItem } from '../../../components/nav-button/NavButton'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { store } from '../../../state/store'
import {
  categoryHasColor,
  WEARABLE_CATEGORY_DEFINITIONS
} from '../../../service/wearable-categories'
import { Label } from '@dcl/sdk/react-ecs'
import { noop } from '../../../utils/function-utils'
import { BasicSlider } from '../../../components/slider/BasicSlider'
import { updateAvatarBase } from '../../../state/backpack/actions'
import {
  getBackgroundFromAtlas,
  hueToRGB,
  rgbToHue
} from '../../../utils/ui-utils'

export function WearableColorPicker(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack
  const categoryDefinition =
    (backpackState.activeWearableCategory &&
      WEARABLE_CATEGORY_DEFINITIONS[backpackState.activeWearableCategory]) ??
    null
  const categoryColorKey: string =
    categoryDefinition?.baseColorKey ?? 'skinColor'
  const mustShowColor = categoryHasColor(backpackState.activeWearableCategory)
  const activeCategoryColor: Color4 = mustShowColor
    ? (backpackState as any).outfitSetup.base[categoryColorKey as any] ??
      Color4.White() // TODO review any here
    : Color4.White()
  const hue = rgbToHue(
    activeCategoryColor.r,
    activeCategoryColor.g,
    activeCategoryColor.b
  )
  return (
    <NavItem
      active={true}
      uiTransform={{ margin: { left: '2%' } }}
      backgroundColor={Color4.White()}
    >
      <UiEntity
        uiTransform={{}}
        uiText={{
          value: '<b>COLOR</b>',
          color: COLOR.TEXT_COLOR,
          fontSize: 26 * canvasScaleRatio
        }}
      />
      <UiEntity
        uiTransform={{
          width: canvasScaleRatio * 50,
          height: canvasScaleRatio * 50
        }}
        uiBackground={{
          ...ROUNDED_TEXTURE_BACKGROUND,
          color: Color4.create(
            activeCategoryColor.r,
            activeCategoryColor.g,
            activeCategoryColor.b
          )
        }}
      />
      <UiEntity
        uiTransform={{
          width: 300,
          height: 300,
          zIndex: 3,
          positionType: 'absolute',
          pointerFilter: 'block',
          position: {
            top: canvasScaleRatio * 100,
            left: 0
          },
          padding: canvasScaleRatio * 30,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}
        onMouseEnter={noop}
        uiBackground={{
          ...ROUNDED_TEXTURE_BACKGROUND,
          color: Color4.Gray()
        }}
      >
        <Label
          value={'<b>PRESETS</b>'}
          color={COLOR.TEXT_COLOR}
          fontSize={canvasScaleRatio * 26}
        />
        <Label
          value={'<b>COLOR</b>'}
          color={COLOR.TEXT_COLOR}
          fontSize={canvasScaleRatio * 26}
        />
        <BasicSlider
          value={hue}
          min={1}
          max={359}
          floatNumber={false}
          uiTransform={{
            width: '100%',
            height: '8%'
          }}
          uiBackground={getBackgroundFromAtlas({
            atlasName: 'backpack',
            spriteName: 'color-slider'
          })}
          onChange={(newValue) => {
            const avatarBase = store.getState().backpack.outfitSetup.base
            const payload = {
              ...avatarBase,
              [categoryColorKey]: hueToRGB(newValue)
            }
            store.dispatch(updateAvatarBase(payload))
          }}
        />
        <Label
          value={'<b>SATURATION</b>'}
          color={COLOR.TEXT_COLOR}
          fontSize={canvasScaleRatio * 26}
        />
        <Label
          value={'<b>BRIGHTNESS</b>'}
          color={COLOR.TEXT_COLOR}
          fontSize={canvasScaleRatio * 26}
        />
      </UiEntity>
    </NavItem>
  )
}

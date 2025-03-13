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
import {
  type BackpackUpdateAvatarBasePayload,
  updateAvatarBase
} from '../../../state/backpack/actions'
import {
  getBackgroundFromAtlas,
  hsvToRgb,
  rgbToHsv
} from '../../../utils/ui-utils'
import { updateAvatarPreview } from '../../../components/backpack/AvatarPreview'

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
  const hsv = rgbToHsv(
    activeCategoryColor.r,
    activeCategoryColor.g,
    activeCategoryColor.b
  )
  const activeColor4 = Color4.create(
    activeCategoryColor.r,
    activeCategoryColor.g,
    activeCategoryColor.b,
    1
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
          width: canvasScaleRatio * 800,
          height: canvasScaleRatio * 800,
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
          value={hsv.h}
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
              [categoryColorKey]: hsvToRgb(newValue, hsv.s, hsv.v)
            }
            updateAvatar(payload)
          }}
        />
        <Label
          value={'<b>SATURATION</b>'}
          color={COLOR.TEXT_COLOR}
          fontSize={canvasScaleRatio * 26}
        />
        <BasicSlider
          value={hsv.s}
          min={1}
          max={359}
          uiTransform={{
            width: '100%',
            height: '8%'
          }}
          uiBackground={{
            ...getBackgroundFromAtlas({
              atlasName: 'backpack',
              spriteName: 'saturation-slider'
            }),
            color: activeColor4
          }}
          onChange={(newValue) => {
            const avatarBase = store.getState().backpack.outfitSetup.base
            const payload = {
              ...avatarBase,
              [categoryColorKey]: hsvToRgb(hsv.h, newValue, hsv.v)
            }
            updateAvatar(payload)
          }}
        />
        <Label
          value={'<b>BRIGHTNESS</b>'}
          color={COLOR.TEXT_COLOR}
          fontSize={canvasScaleRatio * 26}
        />
        <BasicSlider
          value={hsv.v}
          min={1}
          max={359}
          uiTransform={{
            width: '100%',
            height: '8%'
          }}
          uiBackground={{
            ...getBackgroundFromAtlas({
              atlasName: 'backpack',
              spriteName: 'brightness-slider'
            }),
            color: activeColor4
          }}
          onChange={(newValue) => {
            const avatarBase = store.getState().backpack.outfitSetup.base
            const payload = {
              ...avatarBase,
              [categoryColorKey]: hsvToRgb(hsv.h, hsv.s, newValue)
            }
            updateAvatar(payload)
          }}
        />
      </UiEntity>
    </NavItem>
  )
}

function updateAvatar(payload: BackpackUpdateAvatarBasePayload): void {
  updateAvatarPreview(
    store.getState().backpack.equippedWearables,
    store.getState().backpack.outfitSetup.base
  )
  store.dispatch(updateAvatarBase(payload))
}

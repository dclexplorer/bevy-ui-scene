import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR, COLOR_PRESETS } from '../../../components/color-palette'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../../utils/constants'
import { NavItem } from '../../../components/nav-button/NavButton'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { store } from '../../../state/store'
import {
  categoryHasColor,
  WEARABLE_CATEGORY_DEFINITIONS
} from '../../../service/wearable-categories'
import { Label, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { noop } from '../../../utils/function-utils'
import { BasicSlider } from '../../../components/slider/BasicSlider'
import {
  type BackpackUpdateAvatarBasePayload,
  updateAvatarBase
} from '../../../state/backpack/actions'
import {
  getBackgroundFromAtlas,
  hsvToRgb,
  rgbToArray,
  rgbToHsv
} from '../../../utils/ui-utils'
import { updateAvatarPreview } from '../../../components/backpack/AvatarPreview'

const state = { open: false }

export function closeColorPicker(): void {
  state.open = false
}

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
    ? Color4.create(
        ...rgbToArray((backpackState as any).outfitSetup.base[categoryColorKey])
      )
    : Color4.Black()

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
        onMouseDown={() => (state.open = !state.open)}
      />
      <ColorBox
        color={activeCategoryColor}
        onMouseDown={() => (state.open = !state.open)}
      />
      {state.open && (
        <ColorPickerDialog
          categoryColorKey={categoryColorKey}
          color={activeCategoryColor}
        />
      )}
    </NavItem>
  )
}

function updateAvatar(payload: BackpackUpdateAvatarBasePayload): void {
  store.dispatch(updateAvatarBase(payload))
  updateAvatarPreview(
    store.getState().backpack.equippedWearables,
    store.getState().backpack.outfitSetup.base
  )
}

function ColorBox({
  color,
  key,
  onMouseDown,
  uiTransform
}: {
  color: Color4
  key?: any
  onMouseDown?: () => void
  uiTransform?: UiTransformProps
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        width: canvasScaleRatio * 50,
        height: canvasScaleRatio * 50,
        flexShrink: 0,
        ...uiTransform
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color
      }}
      onMouseDown={onMouseDown}
    />
  )
}

function ColorPickerDialog({
  categoryColorKey,
  color
}: {
  categoryColorKey: string
  color: Color4
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const hsv = rgbToHsv(...rgbToArray(color))
  const rawColor = Color4.create(...rgbToArray(hsvToRgb(hsv.h, 360, 360)))

  return (
    <UiEntity
      uiTransform={{
        width: canvasScaleRatio * 640,
        height: canvasScaleRatio * 700,
        zIndex: 3,
        positionType: 'absolute',
        pointerFilter: 'block',
        position: {
          top: canvasScaleRatio * 100,
          left: 0
        },
        padding: '30%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}
      onMouseEnter={noop}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: Color4.White()
      }}
    >
      <Label
        value={'<b>PRESETS</b>'}
        color={COLOR.TEXT_COLOR}
        fontSize={canvasScaleRatio * 26}
      />
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          maxWidth: '100%',
          flexWrap: 'wrap',
          margin: { bottom: '5%' }
        }}
      >
        {COLOR_PRESETS.map((color, index) => (
          <ColorBox
            uiTransform={{
              margin: { right: '5%', bottom: '3%' },
              width: canvasScaleRatio * 60,
              height: canvasScaleRatio * 60
            }}
            color={color}
            key={index}
            onMouseDown={() => {
              const avatarBase = store.getState().backpack.outfitSetup.base
              const payload = {
                ...avatarBase,
                [categoryColorKey]: color
              }
              updateAvatar(payload)
            }}
          />
        ))}
      </UiEntity>
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
          color: Color4.create(...rgbToArray(hsvToRgb(hsv.h, 0, hsv.v)))
        }}
        onChange={(newValue) => {
          const avatarBase = store.getState().backpack.outfitSetup.base
          const payload = {
            ...avatarBase,
            [categoryColorKey]: hsvToRgb(hsv.h, newValue, hsv.v)
          }
          updateAvatar(payload)
        }}
      >
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            positionType: 'absolute'
          }}
          uiBackground={{
            ...getBackgroundFromAtlas({
              atlasName: 'backpack',
              spriteName: 'mask-slider'
            }),
            color: rawColor
          }}
        />
      </BasicSlider>
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
          color: rawColor
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
  )
}

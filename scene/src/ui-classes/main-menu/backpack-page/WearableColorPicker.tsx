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

export function WearableColorPicker(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack
  const categoryDefinition =
    (backpackState.activeWearableCategory &&
      WEARABLE_CATEGORY_DEFINITIONS[backpackState.activeWearableCategory]) ??
    null
  const categoryColorKey = categoryDefinition?.baseColorKey ?? null
  const mustShowColor = categoryHasColor(backpackState.activeWearableCategory)
  const activeCategoryColor: Color4 = mustShowColor
    ? (backpackState as any).outfitSetup.base[categoryColorKey as any] // TODO review any here
    : Color4.White()

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
    </NavItem>
  )
}

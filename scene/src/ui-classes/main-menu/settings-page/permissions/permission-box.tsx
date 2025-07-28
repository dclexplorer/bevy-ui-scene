import {
  type PermissionValue,
  POSSIBLE_PERMISSION_VALUES
} from '../../../../bevy-api/permission-definitions'
import type { UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../../service/canvas-ratio'
import { COLOR } from '../../../../components/color-palette'
import Icon from '../../../../components/icon/Icon'
import type { Color4 } from '@dcl/sdk/math'
import useState = ReactEcs.useState

export function PermissionBox({
  value,
  uiTransform,
  active,
  onChange
}: {
  value: PermissionValue
  uiTransform?: UiTransformProps
  active?: boolean
  onChange?: (value: string) => void
}): ReactElement {
  const [currentValue, setValue] = useState(value)
  const switchValue: () => void = () => {
    console.log('switchValue', currentValue)
    if (
      POSSIBLE_PERMISSION_VALUES.indexOf(currentValue) ===
      POSSIBLE_PERMISSION_VALUES.length - 1
    ) {
      setValue(POSSIBLE_PERMISSION_VALUES[0])
    } else {
      setValue(
        POSSIBLE_PERMISSION_VALUES[
          POSSIBLE_PERMISSION_VALUES.indexOf(currentValue) + 1
        ]
      )
    }
  }
  return (
    <UiEntity
      uiTransform={{
        padding: getCanvasScaleRatio() * 5,
        ...(active
          ? {
              borderColor: COLOR.ACTIVE_BACKGROUND_COLOR,
              borderRadius: getCanvasScaleRatio() * 18,
              borderWidth: 1
            }
          : {}),
        ...uiTransform
      }}
      onMouseDown={switchValue}
    >
      <Icon
        iconSize={getCanvasScaleRatio() * 48}
        icon={{
          spriteName: 'check-off',
          atlasName: 'backpack'
        }}
      />
      <Icon
        uiTransform={{
          positionType: 'absolute',
          position: {
            left: getCanvasScaleRatio() * 5,
            top: getCanvasScaleRatio() * 5
          },
          zIndex: 2
        }}
        iconSize={getCanvasScaleRatio() * 48}
        icon={{
          spriteName: getSpritePerValue(currentValue),
          atlasName: 'icons'
        }}
        iconColor={getSpriteColorPerValue(currentValue)}
      />
    </UiEntity>
  )

  function getSpritePerValue(value: PermissionValue): string {
    if (value === 'Ask') {
      return 'Support'
    } else if (value === 'Deny') {
      return 'CloseIcon'
    } else if (value === 'Allow') {
      return 'Check'
    }
    return 'LeftArrow'
  }

  function getSpriteColorPerValue(value: PermissionValue): Color4 {
    if (value === 'Ask') {
      return COLOR.ORANGE
    } else if (value === 'Deny') {
      return COLOR.RED
    } else if (value === 'Allow') {
      return COLOR.GREEN
    }
    return COLOR.TEXT_COLOR_GREY
  }
}

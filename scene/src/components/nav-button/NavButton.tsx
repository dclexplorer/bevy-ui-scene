import { type AtlasIcon } from '../../utils/definitions'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import Icon from '../icon/Icon'
import { Label, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { COLOR } from '../color-palette'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'

export type NavButtonProps = {
  icon?: AtlasIcon
  text?: string
  active?: boolean
  uiTransform?: UiTransformProps
}

export function NavButton({
  icon,
  text = ' ',
  active = false,
  uiTransform
}: NavButtonProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity
      uiTransform={{
        padding: 8,
        height: 40 * canvasScaleRatio * 2,
        alignItems: 'center',
        ...uiTransform
      }}
      uiBackground={{
        color: active
          ? COLOR.NAV_BUTTON_ACTIVE_BACKGROUND
          : COLOR.NAV_BUTTON_INACTIVE_BACKGROUND,
        textureMode: 'nine-slices',
        texture: {
          src: 'assets/images/backgrounds/rounded.png'
        },
        textureSlices: {
          top: 0.5,
          bottom: 0.5,
          left: 0.5,
          right: 0.5
        }
      }}
    >
      {icon != null ? (
        <Icon
          icon={icon}
          iconSize={24 * canvasScaleRatio * 2}
          iconColor={
            active
              ? COLOR.NAV_BUTTON_ACTIVE_COLOR
              : COLOR.NAV_BUTTON_INACTIVE_COLOR
          }
        />
      ) : null}
      <Label
        fontSize={16 * canvasScaleRatio * 2}
        value={`<b>${text}</b>`}
        color={
          active
            ? COLOR.NAV_BUTTON_ACTIVE_COLOR
            : COLOR.NAV_BUTTON_INACTIVE_COLOR
        }
      />
    </UiEntity>
  )
}

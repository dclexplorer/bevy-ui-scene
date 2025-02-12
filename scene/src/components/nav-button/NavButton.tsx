import { type AtlasIcon } from '../../utils/definitions'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import Icon from '../icon/Icon'
import { Label, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { COLOR } from '../color-palette'

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
  return (
    <UiEntity
      uiTransform={{
        padding: 8,
        height: '40vh',
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
          iconSize={26}
          iconColor={
            active
              ? COLOR.NAV_BUTTON_ACTIVE_COLOR
              : COLOR.NAV_BUTTON_INACTIVE_COLOR
          }
        />
      ) : null}
      <Label
        font={'serif'}
        fontSize={18}
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

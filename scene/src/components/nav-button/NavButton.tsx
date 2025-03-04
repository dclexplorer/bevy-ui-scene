import { type AtlasIcon } from '../../utils/definitions'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import Icon from '../icon/Icon'
import { Label, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { COLOR } from '../color-palette'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { noop } from '../../utils/function-utils'
import { type Color4 } from '@dcl/sdk/math'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../utils/constants'

export type NavButtonProps = {
  icon?: AtlasIcon
  text?: string
  active?: boolean
  uiTransform?: UiTransformProps
  showDeleteButton?: boolean
  onDelete?: () => void
  onClick?: () => void
  backgroundColor?: Color4 | null
  color?: Color4 | null
}

export function NavButton({
  icon,
  text = ' ',
  active = false,
  uiTransform,
  showDeleteButton = false,
  onDelete = noop,
  onClick = noop,
  backgroundColor = null,
  color = null
}: NavButtonProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const callbacks = {
    onClick,
    onDelete
  }
  return (
    <UiEntity
      uiTransform={{
        padding: 16 * canvasScaleRatio,
        height: 40 * canvasScaleRatio * 2,
        alignItems: 'center',
        ...uiTransform
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color:
          backgroundColor ??
          (active
            ? COLOR.NAV_BUTTON_ACTIVE_BACKGROUND
            : COLOR.NAV_BUTTON_INACTIVE_BACKGROUND)
      }}
      onMouseDown={() => {
        callbacks.onClick()
      }}
    >
      {icon != null ? (
        <Icon
          icon={icon}
          iconSize={24 * canvasScaleRatio * 2}
          iconColor={
            color ??
            (active
              ? COLOR.NAV_BUTTON_ACTIVE_COLOR
              : COLOR.NAV_BUTTON_INACTIVE_COLOR)
          }
        />
      ) : null}
      <Label
        fontSize={16 * canvasScaleRatio * 2}
        value={`<b>${text}</b>`}
        color={
          color ??
          (active
            ? COLOR.NAV_BUTTON_ACTIVE_COLOR
            : COLOR.NAV_BUTTON_INACTIVE_COLOR)
        }
      />
      {showDeleteButton ? (
        <UiEntity
          onMouseDown={() => {
            callbacks.onDelete()
          }}
        >
          {/* // TODO look for better icon on spritesheets */}
          <Icon
            icon={{ atlasName: 'context', spriteName: 'Unpublish' }}
            iconSize={40 * canvasScaleRatio}
          />
        </UiEntity>
      ) : null}
    </UiEntity>
  )
}

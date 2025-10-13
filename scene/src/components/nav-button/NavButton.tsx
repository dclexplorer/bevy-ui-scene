import { type AtlasIcon } from '../../utils/definitions'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import Icon from '../icon/Icon'
import { Label, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { COLOR } from '../color-palette'
import { getContentScaleRatio } from '../../service/canvas-ratio'
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
  iconSize?: number
  fontSize?: number
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
  iconSize = 0,
  fontSize = 0,
  color = null
}: NavButtonProps): ReactElement {
  const canvasScaleRatio = getContentScaleRatio() * 0.9
  return (
    <UiEntity
      uiTransform={{
        padding: fontSize * 0.5 || 16 * canvasScaleRatio,
        height: fontSize * 2.5 || 80 * canvasScaleRatio,
        alignItems: 'center',
        margin: { left: 12 },
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
        console.log('clicked')
        onClick()
      }}
    >
      {icon && (
        <Icon
          icon={icon}
          iconSize={iconSize || 48 * canvasScaleRatio}
          iconColor={
            color ??
            (active
              ? COLOR.NAV_BUTTON_ACTIVE_COLOR
              : COLOR.NAV_BUTTON_INACTIVE_COLOR)
          }
        />
      )}
      <Label
        fontSize={fontSize || 32 * canvasScaleRatio}
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
            onDelete()
          }}
        >
          <Icon
            icon={{ atlasName: 'context', spriteName: 'Unpublish' }}
            iconSize={iconSize || 40 * canvasScaleRatio}
          />
        </UiEntity>
      ) : null}
    </UiEntity>
  )
}

export type NavItemProps = {
  children?: ReactElement | null | false | Array<ReactElement | null | false>
  active: boolean
  uiTransform: UiTransformProps
  backgroundColor: Color4
  onClick?: () => void
}

export function NavItem({
  children,
  active,
  uiTransform,
  backgroundColor,
  onClick = noop
}: NavItemProps): ReactElement {
  const canvasScaleRatio = getContentScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        padding: 16 * canvasScaleRatio,
        height: 80 * canvasScaleRatio,
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
      onMouseDown={onClick}
    >
      {children}
    </UiEntity>
  )
}

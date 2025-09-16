import type { AtlasIcon } from '../../utils/definitions'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type PositionUnit,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { noop } from '../../utils/function-utils'

type IconProps = {
  icon: AtlasIcon
  uiTransform?: UiTransformProps
  iconSize?: PositionUnit
  iconColor?: Color4
  onMouseDown?: () => void
  onMouseUp?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const defaultIconProps: IconProps = {
  icon: { atlasName: 'icons', spriteName: 'icon.png' },
  uiTransform: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  onMouseDown: noop,
  onMouseUp: noop,
  onMouseEnter: noop,
  onMouseLeave: noop
}

function Icon(
  props: IconProps = defaultIconProps
): ReactEcs.JSX.Element | null {
  const _props = { ...defaultIconProps, ...props }
  return (
    <UiEntity
      uiTransform={{
        width: _props.iconSize ?? 30,
        height: _props.iconSize ?? 30,
        ..._props.uiTransform
      }}
      uiBackground={{
        ...getBackgroundFromAtlas(props.icon),
        color: props.iconColor ?? Color4.White()
      }}
      onMouseDown={props.onMouseDown}
    />
  )
}

export default Icon

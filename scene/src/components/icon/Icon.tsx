import type { AtlasIcon } from '../../utils/definitions'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type PositionUnit, UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'

type IconProps = UiTransformProps & {
  icon: AtlasIcon
  iconSize?: number|string
  iconColor?: Color4
}

const defaultIconProps:IconProps = {
  icon:{atlasName:"icons", spriteName: "icon.png"},
  iconSize:"70%",
  flexDirection:"row",
  alignItems:"center"
}

function Icon(props:IconProps = defaultIconProps): ReactEcs.JSX.Element | null {
  return  <UiEntity
    uiTransform={{
      ...defaultIconProps,
      width: props.iconSize as PositionUnit ?? '70%',
      height: props.iconSize as PositionUnit ?? '70%',
      flexDirection: 'row',
      alignItems: 'center',
      ...props
    }}
    uiBackground={{
      ...getBackgroundFromAtlas(props.icon),
      color: props.iconColor ?? Color4.White()
    }}
  />
}

export default Icon;
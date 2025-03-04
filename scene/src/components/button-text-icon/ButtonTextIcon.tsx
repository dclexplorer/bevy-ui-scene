import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  type PositionUnit,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { type AtlasIcon } from '../../utils/definitions'
import Icon from '../icon/Icon'
import { ROUNDED_TEXTURE_BACKGROUND, TRANSPARENT } from '../../utils/constants'

function ButtonTextIcon(props: {
  // Events
  onMouseEnter?: Callback
  onMouseLeave?: Callback
  onMouseDown: Callback
  // Shape
  uiTransform?: UiTransformProps
  backgroundColor?: Color4
  // Text
  value: string
  fontSize: number
  icon: AtlasIcon
  iconSize?: PositionUnit
  fontColor?: Color4
  iconColor?: Color4
}): ReactEcs.JSX.Element | null {
  return (
    <UiEntity
      uiTransform={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        ...props.uiTransform
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: props.backgroundColor ?? TRANSPARENT
      }}
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {/* ICON */}

      <Icon
        iconSize={props.iconSize}
        icon={props.icon}
        iconColor={props.iconColor}
      />
      {/* TEXT */}
      <UiEntity
        uiText={{
          value: props.value,
          fontSize: props.fontSize,
          color: props.fontColor ?? Color4.White()
        }}
      ></UiEntity>
    </UiEntity>
  )
}

export default ButtonTextIcon

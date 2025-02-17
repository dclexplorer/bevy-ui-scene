import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  type PositionUnit,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { type AtlasIcon } from '../../utils/definitions'
import Icon from '../icon/Icon'

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
  iconSize?: number | string
  fontColor?: Color4
  iconColor?: Color4
  direction?: 'row' | 'column'
}): ReactEcs.JSX.Element | null {
  //   const ICON_MARGIN = Math.max(canvasInfo.height * 0.01, 2)
  return (
    <UiEntity
      uiTransform={{
        // padding: props.fontSize * 0.3,
        // margin: { bottom: props.fontSize * 0.3, top: props.fontSize * 0.3 },
        flexDirection: props.direction ?? 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.uiTransform
      }}
      uiBackground={{
        color: props.backgroundColor ?? { ...Color4.White(), a: 0 },
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
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {/* ICON */}

      <Icon
        iconSize={(props.iconSize as PositionUnit) ?? 2 * props.fontSize}
        icon={props.icon}
        iconColor={props.iconColor}
      />
      {/* TEXT */}
      <UiEntity
        uiTransform={{
          width: 'auto',
          height: 'auto'
        }}
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

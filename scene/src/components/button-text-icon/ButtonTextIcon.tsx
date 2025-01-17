import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { type AtlasIcon } from '../../utils/definitions'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { DCL_SNOW } from '../../utils/constants'

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
  iconSize?: number
  fontColor?: Color4
  iconColor?: Color4
}): ReactEcs.JSX.Element | null {
  return (
    <UiEntity
      uiTransform={{
        justifyContent: 'center',
        alignItems: 'center',
        ...props.uiTransform
      }}
      uiBackground={{
        color: props.backgroundColor ?? DCL_SNOW,
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

      <UiEntity
        uiTransform={{
          width: props.iconSize ?? 2 * props.fontSize,
          height: props.iconSize ?? 2 * props.fontSize
        }}
        uiBackground={{
          ...getBackgroundFromAtlas(props.icon),
          color: props.iconColor
        }}
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

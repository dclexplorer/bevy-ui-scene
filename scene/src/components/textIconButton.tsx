import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'

function TextIconButton(props: {
  // Events
  onMouseEnter: Callback
  onMouseLeave: Callback
  onMouseDown: Callback
  // Shape
  uiTransform: UiTransformProps
  backgroundColor: Color4
  // Text
  value: string
  fontSize: number
  iconSrc: string
  iconSize?: number
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
        color: props.backgroundColor,

        textureMode: 'nine-slices',
        texture: {
          src: 'assets/images/buttonBackground100.png'
        },
        textureSlices: {
          top: 0.25,
          bottom: 0.25,
          left: 0.25,
          right: 0.25
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
          textureMode: 'stretch',
          color: props.iconColor,
          texture: { src: props.iconSrc }
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

export default TextIconButton

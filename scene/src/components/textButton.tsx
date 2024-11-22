import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'

function TextButton(props: {
  // Events
  onMouseEnter?: Callback
  onMouseLeave?: Callback
  onMouseDown: Callback
  // Shape
  uiTransform: UiTransformProps
  backgroundColor?: Color4
  // Text
  value: string
  fontSize: number
  fontColor?: Color4
  // Status
  isLoading?: boolean
}): ReactEcs.JSX.Element | null {
  //   const ICON_MARGIN = Math.max(canvasInfo.height * 0.01, 2)
  return (
    <UiEntity
      uiTransform={{
        padding: props.fontSize * 0.3,
        margin: { bottom: props.fontSize * 0.3, top: props.fontSize * 0.3 },
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.uiTransform
      }}
      uiBackground={{
        color: props.backgroundColor ?? Color4.create(0, 0, 0, 0),

        textureMode: 'nine-slices',
        texture: {
          src: 'assets/images/backgrounds/rounded.png'
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
      >
        {/* ICON */}
        {props.isLoading === true && (
          <UiEntity
            uiTransform={{
              width: props.fontSize,
              height: props.fontSize,
              positionType: 'absolute',
              position: { top: '25%', left: -1.25 * props.fontSize }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'assets/images/Spinner.png' }
            }}
          />
        )}
      </UiEntity>
    </UiEntity>
  )
}

export default TextButton

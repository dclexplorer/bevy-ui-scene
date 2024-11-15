import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import ArrowToast from './arrowToast'

function IconButton(props: {
  // Events
  onMouseEnter: Callback
  onMouseLeave: Callback
  onMouseDown: Callback
  // Shape
  uiTransform: UiTransformProps
  backgroundColor: Color4
  iconSrc: string
  hintText?: string
  showHint?: boolean
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  const FONT_SIZE = Math.max(canvasInfo.height * 0.02, 12)

  return (
    <UiEntity
      uiTransform={{
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
          width: '70%',
          height: '70%',
          flexDirection: 'row',
          alignItems: 'center'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: props.iconSrc }
        }}
      />
      {props.showHint && props.hintText && (
        <ArrowToast
          uiTransform={{
            width: 'auto',
            height: 'auto',
            positionType: 'absolute',
            position: { left: '100%' }
          }}
          text={props.hintText}
          fontSize={FONT_SIZE}
          arrowSide={'none'}
        />
      )}
    </UiEntity>
  )
}

export default IconButton

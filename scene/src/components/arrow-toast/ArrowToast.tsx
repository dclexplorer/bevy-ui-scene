import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, {
  type Position,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { ALMOST_WHITE } from '../../utils/constants'

function ArrowToast(props: {
  uiTransform: UiTransformProps
  text: string
  fontSize: number
  arrowSide: 'left' | 'right' | 'top' | 'bottom' | 'none'
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  let position: Partial<Position> = { left: -props.fontSize * 0.4 }
  if (props.arrowSide === 'left') position = { left: -props.fontSize * 0.4 }
  if (props.arrowSide === 'right') position = { right: -props.fontSize * 0.4 }
  if (props.arrowSide === 'top') position = { top: -props.fontSize * 0.4 }
  if (props.arrowSide === 'bottom') position = { bottom: -props.fontSize * 0.4 }

  return (
    <UiEntity
      uiTransform={{
        flexDirection:
          props.arrowSide === 'left' || props.arrowSide === 'right'
            ? 'row'
            : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: { left: props.fontSize },
        zIndex: 1,
        ...props.uiTransform
      }}
    >
      {/* ARROW */}

      <UiEntity
        uiTransform={{
          display: props.arrowSide !== undefined ? 'flex' : 'none',
          width: props.fontSize,
          height: props.fontSize,
          positionType: 'absolute',
          position
        }}
        uiBackground={{
          color: Color4.Black(),
          textureMode: 'stretch',
          texture: {
            src: 'assets/images/toast-arrow.png'
          }
        }}
      />

      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        uiBackground={{
          color: Color4.Black(),
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
      >
        {/* TEXT */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '80%',
            padding: { left: props.fontSize * 0.5 }
          }}
          uiText={{
            value: props.text,
            fontSize: props.fontSize,
            color: ALMOST_WHITE,
            textWrap: 'wrap',
            textAlign: 'middle-left'
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

export default ArrowToast

import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, {
  type Position,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { ALMOST_WHITE } from '../utils/constants'
import { Color4 } from '@dcl/sdk/math'

function ArrowToast(props: {
  uiTransform: UiTransformProps
  text: string
  fontSize: number
  arrowSide: 'left' | 'right' | 'top' | 'bottom' | 'none'
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  let position: Partial<Position> = { left: -props.fontSize * 0.8 }
  if (props.arrowSide === 'left') position = { left: -props.fontSize * 0.8 }
  if (props.arrowSide === 'right') position = { right: -props.fontSize * 0.8 }
  if (props.arrowSide === 'top') position = { top: -props.fontSize * 0.8 }
  if (props.arrowSide === 'bottom') position = { bottom: -props.fontSize * 0.8 }

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
        zIndex:1,
        ...props.uiTransform
      }}
    >
      {/* ARROW */}

      {props.arrowSide !== 'none' && (
        <UiEntity
          uiTransform={{
            width: props.fontSize * 2,
            height: props.fontSize * 2,
            positionType: 'absolute',
            position
          }}
          uiBackground={{
            color: Color4.Black(),
            textureMode: 'stretch',
            texture: {
              src: 'assets/images/toastArrow.png'
            }
          }}
        />
      )}

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
            top: 0.25,
            bottom: 0.25,
            left: 0.25,
            right: 0.25
          }
        }}
      >
        {/* TEXT */}
        <UiEntity
          uiTransform={{
            width: '90%',
            height: '80%',
            padding: { right: props.fontSize }
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

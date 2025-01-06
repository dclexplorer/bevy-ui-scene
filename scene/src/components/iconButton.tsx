import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  Label,
  type Position,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import ArrowToast from './arrowToast'
import { type Icon } from '../utils/definitions'
import { getBackgroundFromAtlas } from '../utils/ui-utils'

function IconButton(props: {
  // Events
  onMouseEnter?: Callback
  onMouseLeave?: Callback
  onMouseDown?: Callback
  // Shape
  uiTransform: UiTransformProps
  backgroundColor?: Color4
  icon: Icon
  iconColor?: Color4
  hintText?: string
  showHint?: boolean
  hintFontSize?: number
  notifications?: number
  side?: 'left' | 'right' | 'top' | 'bottom'
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  const FONT_SIZE = Math.max(canvasInfo.height * 0.02, 12)

  let position: Partial<Position> = { left: '100%' }

  if (props.side === 'right') position = { right: '100%' }
  if (props.side === 'bottom') position = { bottom: '100%' }
  if (props.side === 'top') position = { top: '100%' }

  return (
    <UiEntity
      uiTransform={{
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

      <UiEntity
        uiTransform={{
          width: '70%',
          height: '70%',
          flexDirection: 'row',
          alignItems: 'center'
        }}
        uiBackground={{
          ...getBackgroundFromAtlas(props.icon),
          color: props.iconColor ?? Color4.White()
        }}
      />
      <UiEntity
        uiTransform={{
          width: '40%',
          height: '40%',
          flexDirection: 'row',
          alignItems: 'center',
          positionType: 'absolute',
          position: { bottom: '-5%', right: '-5%' },
          display:
            props.notifications !== undefined && props.notifications > 0
              ? 'flex'
              : 'none'
        }}
        uiBackground={{
          color: { ...Color4.Red() },
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
        <Label
          value={props.notifications?.toString() ?? '0'}
          textAlign="middle-center"
          uiTransform={{ width: '100%', height: '100%' }}
        />
      </UiEntity>
      {props.showHint !== false && props.hintText !== undefined && (
        <ArrowToast
          uiTransform={{
            width: 'auto',
            height: 'auto',
            positionType: 'absolute',
            position
          }}
          text={props.hintText}
          fontSize={props.hintFontSize ?? FONT_SIZE}
          arrowSide={props.side ?? 'left'}
        />
      )}
    </UiEntity>
  )
}

export default IconButton

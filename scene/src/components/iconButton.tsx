import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
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
  onMouseDown: Callback
  // Shape
  uiTransform: UiTransformProps
  backgroundColor?: Color4
  icon: Icon
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
        uiBackground={getBackgroundFromAtlas(props.icon)}
      />
      {props.showHint !== false && props.hintText !== undefined && (
        <ArrowToast
          uiTransform={{
            width: 'auto',
            height: 'auto',
            positionType: 'absolute',
            position: { left: '100%' },
          }}
          text={props.hintText}
          fontSize={FONT_SIZE}
          arrowSide={'left'}
        />
      )}
    </UiEntity>
  )
}

export default IconButton

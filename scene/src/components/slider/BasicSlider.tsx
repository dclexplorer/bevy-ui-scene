import ReactEcs, {
  type ReactElement,
  type UiBackgroundProps,
  UiEntity
} from '@dcl/react-ecs'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import { engine, PrimaryPointerInfo } from '@dcl/sdk/ecs'
import { noop } from '../../utils/function-utils'
import { Color4 } from '@dcl/sdk/math'

type BasicSliderProps = {
  value: number
  uiTransform: UiTransformProps
  min?: number
  max?: number
  floatNumber?: boolean
  onChange?: (percentage: number) => void
  uiBackground?: UiBackgroundProps
}
const MOUSE_VELOCITY = 0.1

export function BasicSlider({
  min = 0,
  max = 1,
  value,
  uiTransform,
  onChange = noop,
  floatNumber = true,
  uiBackground = { color: Color4.Black() }
}: BasicSliderProps): ReactElement {
  const percentage = Math.min(100, Math.max(0, (value * 100) / max))
  return (
    <UiEntity uiTransform={uiTransform}>
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%'
        }}
        uiBackground={{
          ...uiBackground
        }}
        onMouseDragLocked={() => {
          const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
          const deltaX: number = pointerInfo?.screenDelta?.x ?? 0
          const newPercentage = Math.min(
            100,
            Math.max(0, percentage + deltaX * MOUSE_VELOCITY)
          )
          const total = max - min
          const newValue = min + (newPercentage / 100) * total

          onChange(floatNumber ? newValue : Math.floor(newValue))
        }}
      >
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { left: `${percentage}%` },
            margin: { top: '-1%', left: '-2.5%' },
            height: '120%',
            width: '5%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: 'assets/images/menu/slider.png' }
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

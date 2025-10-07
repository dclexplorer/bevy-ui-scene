import ReactEcs, {
  type ReactElement,
  type UiBackgroundProps,
  UiEntity
} from '@dcl/react-ecs'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import { engine, PrimaryPointerInfo } from '@dcl/sdk/ecs'
import { noop } from '../../utils/function-utils'
import { Color4 } from '@dcl/sdk/math'
import useState = ReactEcs.useState

type UncontrolledBasicSliderProps = {
  children?: ReactElement
  defaultValue?: number
  uiTransform: UiTransformProps
  min?: number
  max?: number
  stepSize?: number
  onChange?: (value: number) => void
  uiBackground?: UiBackgroundProps
  onRelease?: (value: number) => void
}

const MOUSE_VELOCITY = 0.1

export function UncontrolledBasicSlider({
  children,
  min = 0,
  max = 1,
  defaultValue = min,
  uiTransform,
  onChange = noop,
  stepSize = 0.1,
  uiBackground = { color: Color4.Black() },
  onRelease = noop
}: UncontrolledBasicSliderProps): ReactElement {
  const [value, setValue] = useState<number>(defaultValue)
  // Calculate percentage correctly for both positive and negative ranges
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  const handleValueChange = (newValue: number): void => {
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <UiEntity uiTransform={uiTransform}>
      {children}
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
          let newValue = min + (newPercentage / 100) * total

          // Apply step size and round to nearest step
          if (stepSize > 0) {
            newValue = Math.round(newValue / stepSize) * stepSize

            // Determine decimal places based on stepSize
            const stepString = stepSize.toString()
            const decimalIndex = stepString.indexOf('.')

            if (decimalIndex === -1) {
              // stepSize is an integer, no decimals
              newValue = Math.floor(newValue)
            } else {
              // Count decimals in stepSize and round to that precision
              const decimalPlaces = stepString.length - decimalIndex - 1
              newValue = Math.floor(newValue * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
            }
          }

          handleValueChange(newValue)
        }}
        onMouseDragEnd={() => {
          onRelease(value)
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

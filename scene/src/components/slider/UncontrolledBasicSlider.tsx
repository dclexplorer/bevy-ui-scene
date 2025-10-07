import ReactEcs, {
  type ReactElement,
  type UiBackgroundProps
} from '@dcl/react-ecs'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import { noop } from '../../utils/function-utils'
import { Color4 } from '@dcl/sdk/math'
import { BasicSlider } from './BasicSlider'
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
  showStepButtons?: boolean
}

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

  const handleValueChange = (newValue: number): void => {
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <BasicSlider
      value={value}
      min={min}
      max={max}
      stepSize={stepSize}
      uiTransform={uiTransform}
      uiBackground={uiBackground}
      onChange={handleValueChange}
      onRelease={onRelease}
    >
      {children}
    </BasicSlider>
  )
}

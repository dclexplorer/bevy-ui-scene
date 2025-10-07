import ReactEcs, {
  type ReactElement,
  type UiBackgroundProps,
  UiEntity
} from '@dcl/react-ecs'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import { noop } from '../../utils/function-utils'
import { Color4 } from '@dcl/sdk/math'
import { BasicSlider } from './BasicSlider'
import ButtonIcon from '../button-icon/ButtonIcon'
import useState = ReactEcs.useState
import { COLOR } from '../color-palette'

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
  onRelease = noop,
  showStepButtons = false
}: UncontrolledBasicSliderProps): ReactElement {
  const [value, setValue] = useState<number>(defaultValue)

  // Helper function to round value based on stepSize precision
  const roundToStep = (val: number): number => {
    const decimals = stepSize.toString().split('.')[1]?.length ?? 0
    const rounded = Math.round(val / stepSize) * stepSize
    // Fix floating-point precision issues by rounding to the correct decimal places
    return parseFloat(rounded.toFixed(decimals))
  }

  const handleValueChange = (newValue: number): void => {
    const roundedValue = roundToStep(newValue)
    setValue(roundedValue)
    onChange(roundedValue)
  }

  const handleDecrement = (): void => {
    const newValue = roundToStep(Math.max(min, value - stepSize))
    setValue(newValue)
    onChange(newValue)
    onRelease(newValue)
  }

  const handleIncrement = (): void => {
    const newValue = roundToStep(Math.min(max, value + stepSize))
    setValue(newValue)
    onChange(newValue)
    onRelease(newValue)
  }

  const slider = (
    <BasicSlider
      value={value}
      min={min}
      max={max}
      stepSize={stepSize}
      uiTransform={
        showStepButtons ? { ...uiTransform, width: '80%' } : uiTransform
      }
      uiBackground={uiBackground}
      onChange={handleValueChange}
      onRelease={onRelease}
    >
      {children}
    </BasicSlider>
  )

  if (!showStepButtons) {
    return slider
  }

  return (
    <UiEntity
      uiTransform={{
        ...uiTransform,
        width: uiTransform?.width ?? '100%',
        height: uiTransform?.height ?? '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLOR.RED,
        borderRadius: 0
      }}
    >
      <ButtonIcon
        icon={{ atlasName: 'icons', spriteName: 'LeftArrow' }}
        onMouseDown={handleDecrement}
        uiTransform={{
          width: '8%',
          height: '80%'
        }}
        iconColor={Color4.White()}
      />
      {slider}
      <ButtonIcon
        icon={{ atlasName: 'icons', spriteName: 'RightArrow' }}
        onMouseDown={handleIncrement}
        uiTransform={{
          width: '8%',
          height: '80%'
        }}
        iconColor={Color4.White()}
      />
    </UiEntity>
  )
}

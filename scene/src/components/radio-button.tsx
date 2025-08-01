import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { Column, Row } from './layout'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import { COLOR } from './color-palette'
import { type InputOption } from '../utils/definitions'
import { getCanvasScaleRatio } from '../service/canvas-ratio'
import useState = ReactEcs.useState
import { noop } from '../utils/function-utils'

export function RadioButton({
  uiTransform,
  options,
  value,
  fontSize = getCanvasScaleRatio() * 48,
  onChange = noop
}: {
  uiTransform?: UiTransformProps
  options: InputOption[]
  value: any
  fontSize?: number
  onChange?: (value: any) => void
}): ReactElement {
  const [selectedValue, setSelectedValue] = useState(value)
  return (
    <Column uiTransform={{ ...uiTransform }}>
      {options.map((option) => {
        return (
          <Row
            uiTransform={{
              alignItems: 'center'
            }}
            onMouseDown={() => {
              setSelectedValue(option.value)
              onChange(option.value)
            }}
          >
            <RadioCircle
              fontSize={fontSize}
              active={selectedValue === option.value}
            />
            <UiEntity uiText={{ value: option.label, fontSize }} />
          </Row>
        )
      })}
    </Column>
  )
}

export function RadioCircle({
  active = false,
  uiTransform,
  fontSize = getCanvasScaleRatio() * 48
}: {
  active: boolean
  uiTransform?: UiTransformProps
  fontSize?: number
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        borderWidth: 0,
        borderColor: COLOR.WHITE,
        borderRadius: 99999,
        position: { top: '5%' },
        width: fontSize,
        height: fontSize,
        alignItems: 'center',
        justifyContent: 'center',
        ...uiTransform
      }}
      uiBackground={{ color: COLOR.WHITE }}
    >
      <UiEntity
        uiTransform={{
          borderWidth: 0,
          borderColor: active ? COLOR.TEXT_COLOR : COLOR.WHITE,
          borderRadius: 99999,
          width: '60%',
          height: '60%'
        }}
        uiBackground={{ color: active ? COLOR.BLACK : COLOR.WHITE }}
      ></UiEntity>
    </UiEntity>
  )
}

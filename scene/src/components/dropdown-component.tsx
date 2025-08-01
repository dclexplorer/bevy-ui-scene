import { DropdownStyled } from './dropdown-styled'
import { getCanvasScaleRatio } from '../service/canvas-ratio'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import { noop } from '../utils/function-utils'
import { timers } from '@dcl-sdk/utils'
import { type InputOption } from '../utils/definitions'

export type DropdownComponentProps = {
  dropdownId: string // TODO refactor with useState when  it's available
  uiTransform: UiTransformProps
  options: InputOption[]
  value: any
  fontSize?: number
  onChange: (value: any) => void
  scroll?: boolean
  disabled?: boolean
  listMaxHeight?: number
}

export type DropdownState = Record<
  string,
  {
    open: boolean
    entered: number | null
  }
>
const state: DropdownState = {}

export function DropdownComponent({
  dropdownId,
  options = [{ label: '', value: null }],
  value = null,
  uiTransform,
  fontSize = getCanvasScaleRatio() * 32,
  onChange = noop,
  scroll = false,
  disabled = false,
  listMaxHeight
}: DropdownComponentProps): ReactElement {
  state[dropdownId] = state[dropdownId] ?? {
    open: false,
    entered: null
  }

  return (
    <DropdownStyled
      scroll={scroll}
      uiTransform={uiTransform}
      isOpen={state[dropdownId].open}
      onMouseDown={() => {
        if (!disabled) {
          state[dropdownId].open = !state[dropdownId].open
        }
      }}
      onOptionMouseDown={(index) => {
        onChange(options[index].value)
        state[dropdownId].open = false
      }}
      onOptionMouseEnter={(index) => {
        state[dropdownId].entered = index
      }}
      onOptionMouseLeave={(index) => {}}
      onListMouseLeave={() => {
        timers.setTimeout(() => {
          state[dropdownId].entered = null
        }, 100)
      }}
      title={''}
      fontSize={fontSize}
      value={options.findIndex((o) => o.value === value)}
      entered={
        state[dropdownId].entered !== null
          ? state[dropdownId].entered ?? -1
          : -1
      }
      options={options}
      disabled={disabled}
      listMaxHeight={listMaxHeight}
    />
  )
}

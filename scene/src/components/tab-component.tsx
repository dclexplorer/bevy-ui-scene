import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { BottomBorder } from './bottom-border'
import { COLOR } from './color-palette'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'

export type Tab = {
  text: string
  active?: boolean
}
export function TabComponent({
  tabs,
  fontSize,
  uiTransform
}: {
  tabs: Tab[]
  fontSize: number
  uiTransform: UiTransformProps
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        ...uiTransform
      }}
    >
      <BottomBorder color={COLOR.WHITE_OPACITY_1} />
      {tabs.map(({ text, active }) => (
        <UiEntity
          uiText={{
            value: active ? `<b>${text}</b>` : text,
            color: active ? COLOR.WHITE : COLOR.INACTIVE,
            fontSize
          }}
        >
          {active && <BottomBorder color={COLOR.LINK_COLOR} />}
        </UiEntity>
      ))}
    </UiEntity>
  )
}

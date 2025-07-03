import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'

export function Row({
  uiTransform,
  children
}: {
  uiTransform?: UiTransformProps
  children?: ReactElement
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        ...uiTransform
      }}
    >
      {children}
    </UiEntity>
  )
}

export function Column({
  uiTransform,
  children
}: {
  uiTransform: UiTransformProps
  children: ReactElement
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        ...uiTransform
      }}
    >
      {children}
    </UiEntity>
  )
}

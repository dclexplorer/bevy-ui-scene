import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { noop } from '../utils/function-utils'

export function Row({
  uiTransform,
  children,
  onMouseEnter = noop,
  onMouseLeave = noop
}: {
  uiTransform?: UiTransformProps
  children?: ReactElement
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}): ReactElement {
  return (
    <UiEntity
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
  children,
  onMouseEnter = noop,
  onMouseLeave = noop
}: {
  uiTransform?: UiTransformProps
  children?: ReactElement
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}): ReactElement {
  return (
    <UiEntity
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      uiTransform={{
        flexDirection: 'column',
        ...uiTransform
      }}
    >
      {children}
    </UiEntity>
  )
}

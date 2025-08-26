import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, {
  type ReactElement,
  UiBackgroundProps,
  UiEntity
} from '@dcl/react-ecs'
import { noop } from '../utils/function-utils'

export function Row({
  uiTransform,
  uiBackground,
  children,
  onMouseEnter = noop,
  onMouseLeave = noop,
  onMouseDown = noop
}: {
  uiTransform?: UiTransformProps
  uiBackground?: UiBackgroundProps
  children?: ReactElement
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onMouseDown?: () => void
}): ReactElement {
  return (
    <UiEntity
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      uiTransform={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        ...uiTransform
      }}
      uiBackground={uiBackground}
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

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
  onMouseEnter,
  onMouseLeave,
  onMouseDown
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
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  uiBackground
}: {
  uiTransform?: UiTransformProps
  children?: ReactElement | ReactElement[] | null[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onMouseDown?: () => void
  uiBackground?: UiBackgroundProps
}): ReactElement {
  return (
    <UiEntity
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      uiBackground={uiBackground}
      onMouseDown={onMouseDown}
      uiTransform={{
        flexDirection: 'column',
        ...uiTransform
      }}
    >
      {children}
    </UiEntity>
  )
}

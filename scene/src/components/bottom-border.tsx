import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { type Color4 } from '@dcl/sdk/math'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import { getCanvasScaleRatio } from '../service/canvas-ratio'

export function BottomBorder({
  color,
  uiTransform
}: {
  color: Color4
  uiTransform?: UiTransformProps
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { bottom: 0 },
        height: getCanvasScaleRatio() * 5,
        width: '100%',
        ...uiTransform
      }}
      uiBackground={{ color }}
    />
  )
}

export function TopBorder({
  color,
  uiTransform
}: {
  color: Color4
  uiTransform?: UiTransformProps
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0 },
        height: getCanvasScaleRatio() * 5,
        width: '100%',
        ...uiTransform
      }}
      uiBackground={{ color }}
    />
  )
}

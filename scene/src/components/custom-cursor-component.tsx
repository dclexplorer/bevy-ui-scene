import type { ReactElement } from '@dcl/react-ecs'
import { getContentScaleRatio } from '../service/canvas-ratio'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { getBackgroundFromAtlas } from '../utils/ui-utils'
import { getMouseCustomCursorState } from '../service/custom-cursor-service'
import { MAX_ZINDEX } from '../utils/constants'

export function CustomMouseCursorElement(): ReactElement | null {
  const canvasScaleRatio = getContentScaleRatio()
  const mouseCursorSize = canvasScaleRatio * 50
  const customMouseCursorState = getMouseCustomCursorState()
  if (!customMouseCursorState.showCustomCursor) return null
  return (
    <UiEntity
      uiTransform={{
        height: mouseCursorSize,
        width: mouseCursorSize,
        positionType: 'absolute',
        position: {
          top: customMouseCursorState.y - mouseCursorSize / 2,
          left: customMouseCursorState.x - mouseCursorSize / 2
        },
        zIndex: MAX_ZINDEX
      }}
      uiBackground={{
        ...getBackgroundFromAtlas(customMouseCursorState.sprite),
        color: customMouseCursorState.sprite.color
      }}
    />
  )
}

import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { MiniMapContent } from './mini-map-content'

export function MiniMap() {
  return (
    <UiEntity
      uiTransform={{
        position: {
          top: getCanvasScaleRatio() * 200,
          left: getCanvasScaleRatio() * 150
        }
      }}
    >
      <MiniMapContent />
    </UiEntity>
  )
}

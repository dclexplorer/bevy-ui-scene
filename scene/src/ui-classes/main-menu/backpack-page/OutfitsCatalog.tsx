import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'

export const OutfitsCatalog = (): ReactElement => {
  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 2145
      }}
    ></UiEntity>
  )
}

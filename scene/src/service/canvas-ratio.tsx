import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'

export function getCanvasScaleRatio(): number {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return 1
  const minSize: number = Math.min(canvasInfo.height, canvasInfo.width)
  return minSize / 2200
}

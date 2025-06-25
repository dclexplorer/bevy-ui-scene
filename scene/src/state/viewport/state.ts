import { type BorderRect } from '@dcl/ecs/dist/components/generated/pb/decentraland/common/border_rect.gen'

export const VIEWPORT_STORE_ID: 'viewport' = 'viewport'

export type ViewportState = {
  width: number
  height: number
  interactableArea: BorderRect
}
export type InteractableArea = {
  top: number
  left: number
  bottom: number
  right: number
}
export const viewportInitialState: ViewportState = {
  width: 0,
  height: 0,
  interactableArea: { top: 0, left: 0, bottom: 0, right: 0 }
}

export const VIEWPORT_STORE_ID: 'viewport' = 'viewport'

export type ViewportState = {
  width: number
  height: number
}
export type InteractableArea = {
  top: number
  left: number
  bottom: number
  right: number
}
export const viewportInitialState: ViewportState = {
  width: 0,
  height: 0
}

import { VIEWPORT_STORE_ID, type ViewportState } from './state'

type ViewportActionId = { __reducer: typeof VIEWPORT_STORE_ID }

export enum VIEWPORT_ACTION {
  UPDATE_VIEWPORT
}

export type ViewportInfoAction = ViewportActionId & {
  type: VIEWPORT_ACTION.UPDATE_VIEWPORT
  payload: { width: number; height: number }
}

export type ViewportActions = ViewportInfoAction

export const updateViewportSize = (
  viewportInfo: ViewportState
): ViewportActions => ({
  __reducer: VIEWPORT_STORE_ID,
  type: VIEWPORT_ACTION.UPDATE_VIEWPORT,
  payload: viewportInfo
})

import { HUD_STORE_ID, type HUDPopup, type HudStateUpdateParams } from './state'

type HudActionId = { __reducer: typeof HUD_STORE_ID }

export enum HUD_ACTION {
  UPDATE_HUD_STATE,
  PUSH_POPUP,
  CLOSE_LAST_POPUP,
  UNSHIFT_POPUP
}

export type UpdateHudAction = HudActionId & {
  type: HUD_ACTION.UPDATE_HUD_STATE
  payload: HudStateUpdateParams
}

export const updateHudStateAction = (
  payload: HudStateUpdateParams
): UpdateHudAction => ({
  __reducer: HUD_STORE_ID,
  type: HUD_ACTION.UPDATE_HUD_STATE,
  payload
})

export type ShowPopupAction = HudActionId & {
  type: HUD_ACTION.PUSH_POPUP | HUD_ACTION.UNSHIFT_POPUP
  payload: HUDPopup
}

export type CloseLastPopupAction = HudActionId & {
  type: HUD_ACTION.CLOSE_LAST_POPUP
}

export const pushPopupAction = (payload: HUDPopup): ShowPopupAction => ({
  __reducer: HUD_STORE_ID,
  type: HUD_ACTION.PUSH_POPUP,
  payload
})

export const unshiftPopupAction = (payload: HUDPopup): ShowPopupAction => ({
  __reducer: HUD_STORE_ID,
  type: HUD_ACTION.UNSHIFT_POPUP,
  payload
})

export const closeLastPopupAction = (): CloseLastPopupAction => ({
  __reducer: HUD_STORE_ID,
  type: HUD_ACTION.CLOSE_LAST_POPUP
})

export type HudActions =
  | UpdateHudAction
  | ShowPopupAction
  | CloseLastPopupAction

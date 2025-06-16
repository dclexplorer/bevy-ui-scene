import { HUD_STORE_ID, type HudStateUpdateParams } from './state'

type HudActionId = { __reducer: typeof HUD_STORE_ID }

export enum HUD_ACTION {
  UPDATE_HUD_STATE
}

export type UpdateHudAction = HudActionId & {
  type: HUD_ACTION.UPDATE_HUD_STATE
  payload: HudStateUpdateParams
}

export type HudActions = UpdateHudAction

export const updateHudStateAction = (
  payload: HudStateUpdateParams
): UpdateHudAction => ({
  __reducer: HUD_STORE_ID,
  type: HUD_ACTION.UPDATE_HUD_STATE,
  payload
})

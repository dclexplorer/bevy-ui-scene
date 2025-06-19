export const HUD_STORE_ID = 'hud'

export enum HUD_POPUP_TYPE {
  URL,
  TELEPORT,
  PASSPORT
}

export type HUDPopup = {
  type: HUD_POPUP_TYPE
  data: string
}

export type HudState = {
  chatOpen: boolean
  shownPopups: HUDPopup[]
}

export type HudStateUpdateParams = {
  chatOpen?: boolean
  shownPopup?: HUDPopup[]
}

export const hudInitialState: HudState = {
  chatOpen: true,
  shownPopups: []
}

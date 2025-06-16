export const HUD_STORE_ID = 'hud'

export enum HUD_POPUP_TYPE {
  URL,
  TELEPORT
}

export type HUDPopup = {
  type: HUD_POPUP_TYPE
  data: string
}

export type HudState = {
  chatOpen: boolean
  shownPopup: HUDPopup | null
}

export type HudStateUpdateParams = {
  chatOpen?: boolean
  shownPopup?: HUDPopup | null
}

export const hudInitialState: HudState = {
  chatOpen: true,
  shownPopup: {
    // TODO set to null
    type: HUD_POPUP_TYPE.URL,
    data: 'https://google.com'
  }
}

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
  shownPopup: HUDPopup | null
}

export type HudStateUpdateParams = {
  chatOpen?: boolean
  shownPopup?: HUDPopup | null
}

export const hudInitialState: HudState = {
  chatOpen: true,
  shownPopup: {
    type: HUD_POPUP_TYPE.PASSPORT,
    data: `0x598f8af1565003AE7456DaC280a18ee826Df7a2c`
  }
}

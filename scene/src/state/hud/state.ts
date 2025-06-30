import { cloneDeep } from '../../utils/function-utils'
import { NameDefinition } from '../../utils/passport-promise-utils'

export const HUD_STORE_ID = 'hud'

export type ViewAvatarData = Record<string, any> & {
  hasClaimedName: boolean
  hasConnectedWeb3: boolean
  description: string
  country: string
  language: string
  gender: string
  relationshipStatus: string
  sexualOrientation: string
  employmentStatus: string
  pronouns: string
  profession: string
  birthdate: number
  hobbies: string
  name: string
  links: Array<{ url: string; title: string }>
  userId: string
}
export const EMPTY_PROFILE_DATA = {
  userId: '',
  hasClaimedName: false,
  hasConnectedWeb3: false,
  name: '',
  description: '',
  country: '',
  language: '',
  gender: '',
  relationshipStatus: '',
  sexualOrientation: '',
  employmentStatus: '',
  pronouns: '',
  profession: '',
  birthdate: 0,
  hobbies: '',
  links: []
}

export enum HUD_POPUP_TYPE {
  URL,
  TELEPORT,
  PASSPORT,
  NAME_EDIT,
  ADD_LINK,
  PROFILE_MENU
}

export type HUDPopup = {
  type: HUD_POPUP_TYPE
  data?: string
}

export type HudState = {
  chatOpen: boolean
  shownPopups: HUDPopup[]
  profileData: ViewAvatarData
  names: NameDefinition[]
}

export type HudStateUpdateParams = {
  chatOpen?: boolean
  shownPopup?: HUDPopup[]
  profileData?: ViewAvatarData
  names?: NameDefinition[]
}

export const hudInitialState: HudState = {
  chatOpen: true,
  shownPopups: [],
  profileData: cloneDeep(EMPTY_PROFILE_DATA),
  names: []
}

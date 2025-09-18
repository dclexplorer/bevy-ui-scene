import { cloneDeep } from '../../utils/function-utils'
import { type NameDefinition } from '../../utils/passport-promise-utils'
import { Place } from '../../service/map-places'
import { EMPTY_PLACE } from '../../utils/constants'
import { PlaceRepresentation } from '../../ui-classes/main-hud/big-map/big-map-view'
import { Vector3 } from '@dcl/sdk/math'

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
  PROFILE_MENU,
  ERROR,
  NOTIFICATIONS_MENU,
  PERMISSION_REQUEST
}

export type HUDPopup = {
  type: HUD_POPUP_TYPE
  data?: unknown
}
export type SceneCatalogOrder = 'most_active' | 'like_score' | 'updated_at'
export type HudState = {
  mapCameraIsOrbiting: boolean
  chatOpen: boolean
  shownPopups: HUDPopup[]
  profileData: ViewAvatarData
  names: NameDefinition[]
  unreadNotifications: number
  loggedIn: boolean
  realmURL?: string
  chatOptionShowUserMessages: boolean
  chatOptionShowSystemMessages: boolean
  chatInput: string
  minimapOpen: boolean
  mapModeActive: boolean
  mapFilterCategories: string[]
  placeListActiveItem: Place | null
  sceneList: {
    total: number
    data: Place[]
  }
  movingMap: boolean
  sceneCatalogOrder: SceneCatalogOrder
  homePlace: Place | null
  mapTargetPosition: Vector3
}

export type HudStateUpdateParams = {
  chatOpen?: boolean
  shownPopup?: HUDPopup[]
  profileData?: ViewAvatarData
  names?: NameDefinition[]
  loggedIn?: boolean
  unreadNotifications?: number
  realmURL?: string
  chatOptionShowUserMessages?: boolean
  chatOptionShowSystemMessages?: boolean
  chatInput?: string
  minimapOpen?: boolean
  mapModeActive?: boolean
  mapFilterCategories?: string[]
  placeListActiveItem?: Place | null
  sceneList?: {
    total: number
    data: Place[]
  }
  movingMap?: boolean
  sceneCatalogOrder?: SceneCatalogOrder
  homePlace?: Place
  mapTargetPosition?: Vector3
  mapCameraIsOrbiting?: boolean
}

export const hudInitialState: HudState = {
  chatOpen: true,
  shownPopups: [],
  profileData: cloneDeep(EMPTY_PROFILE_DATA),
  names: [],
  loggedIn: false,
  unreadNotifications: 0,
  realmURL: 'main',
  chatOptionShowUserMessages: true,
  chatOptionShowSystemMessages: false,
  chatInput: '',
  minimapOpen: true,
  mapModeActive: false,
  mapFilterCategories: ['all'],
  placeListActiveItem: null,
  sceneList: {
    total: 0,
    data: []
  },
  movingMap: true,
  sceneCatalogOrder: `most_active`,
  homePlace: null,
  mapTargetPosition: Vector3.Zero(),
  mapCameraIsOrbiting: false
}

import { BACKPACK_STORE_ID } from './state'
import { type URNWithoutTokenId } from '../../utils/definitions'
import { type WearableCategory } from '../../service/wearable-categories'
import {
  type CatalogWearableElement,
  type WearableEntityMetadata
} from '../../utils/wearables-definitions'
import { type PBAvatarBase } from '../../bevy-api/interface'

type BackpackActionId = { __reducer: typeof BACKPACK_STORE_ID }

export enum BACKPACK_ACTION {
  SELECT_WEARABLE_URN,
  UPDATE_CURRENT_PAGE,
  UPDATE_ACTIVE_WEARABLE_CATEGORY,
  UPDATE_LOADING_PAGE,
  UPDATE_LOADED_PAGE,
  UPDATE_EQUIPPED_WEARABLES,
  UPDATE_AVATAR_BASE
}

export type BackpackSelectWearableURNAction = BackpackActionId & {
  type: BACKPACK_ACTION.SELECT_WEARABLE_URN
  payload: URNWithoutTokenId | null
}

export type BackpackUpdateCurrentPageAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_CURRENT_PAGE
  payload: number
}

export type BackpackUpdateActiveWearableCategoryAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_ACTIVE_WEARABLE_CATEGORY
  payload: WearableCategory | null
}

export type BackpackUpdateLoadingPageAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_LOADING_PAGE
  payload: boolean
}
export type BackpackUpdateEquippedWearablesPayload = {
  wearables: URNWithoutTokenId[]
  wearablesData: WearableEntityMetadata[]
}
export type BackpackUpdateEquippedWearablesAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_EQUIPPED_WEARABLES
  payload: BackpackUpdateEquippedWearablesPayload
}

export type BackpackUpdateAvatarBasePayload = PBAvatarBase
export type BackpackUpdateAvatarBaseAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_AVATAR_BASE
  payload: BackpackUpdateAvatarBasePayload
}

export type BackpackUpdateLoadedPagePayload = {
  totalPages: number
  shownWearables: CatalogWearableElement[]
}
export type BackpackUpdateLoadedPageAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_LOADED_PAGE
  payload: BackpackUpdateLoadedPagePayload
}

export type BackpackActions =
  | BackpackSelectWearableURNAction
  | BackpackUpdateCurrentPageAction
  | BackpackUpdateActiveWearableCategoryAction
  | BackpackUpdateLoadingPageAction
  | BackpackUpdateLoadedPageAction
  | BackpackUpdateEquippedWearablesAction
  | BackpackUpdateAvatarBaseAction

export const updateSelectedWearableURN = (
  payload: URNWithoutTokenId | null
): BackpackSelectWearableURNAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.SELECT_WEARABLE_URN,
  payload
})

export const updateCurrentPage = (
  payload: number
): BackpackUpdateCurrentPageAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_CURRENT_PAGE,
  payload
})

export const updateActiveWearableCategory = (
  payload: WearableCategory | null
): BackpackUpdateActiveWearableCategoryAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_ACTIVE_WEARABLE_CATEGORY,
  payload
})

export const updateLoadingPage = (
  payload: boolean
): BackpackUpdateLoadingPageAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_LOADING_PAGE,
  payload
})

export const updateLoadedPage = (
  payload: BackpackUpdateLoadedPagePayload
): BackpackUpdateLoadedPageAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_LOADED_PAGE,
  payload
})

export const updateEquippedWearables = (
  payload: BackpackUpdateEquippedWearablesPayload
): BackpackUpdateEquippedWearablesAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_EQUIPPED_WEARABLES,
  payload
})

export const updateAvatarBase = (
  payload: BackpackUpdateAvatarBasePayload
): BackpackUpdateAvatarBaseAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_AVATAR_BASE,
  payload
})

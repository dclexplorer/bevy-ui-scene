import {
  type BACKPACK_SECTION,
  BACKPACK_STORE_ID,
  type SearchFilterState
} from './state'
import {
  type EquippedEmote,
  type URNWithoutTokenId
} from '../../utils/definitions'
import { type WearableCategory } from '../../service/categories'
import {
  type CatalogEmoteElement,
  type CatalogWearableElement,
  type CatalystMetadataMap
} from '../../utils/item-definitions'
import { type PBAvatarBase } from '../../bevy-api/interface'

type BackpackActionId = { __reducer: typeof BACKPACK_STORE_ID }

export enum BACKPACK_ACTION {
  SELECT_CATALOG_URN,
  UPDATE_CURRENT_PAGE,
  UPDATE_ACTIVE_WEARABLE_CATEGORY,
  UPDATE_LOADING_PAGE,
  UPDATE_LOADED_PAGE,
  UPDATE_EQUIPPED_WEARABLES,
  UPDATE_AVATAR_BASE,
  UPDATE_CACHE_KEY,
  SWITCH_FORCE_RENDER_CATEGORY,
  UPDATE_SAVED_RESET_VERSION,
  RESET_OUTFIT,
  UNEQUIP_WEARABLE_CATEGORY,
  CHANGE_SECTION,
  UPDATE_EQUIPPED_EMOTES,
  UPDATE_EQUIPPED_EMOTE,
  SELECT_EMOTE_SLOT,
  UPDATE_EMOTES_SAVED_RESET_VERSION,
  RESET_EMOTES,
  RESET_DEFAULT_EMOTES,
  UPDATE_SEARCH_FILTER
}

export type BackpackSelectWearableURNAction = BackpackActionId & {
  type: BACKPACK_ACTION.SELECT_CATALOG_URN
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
  wearablesData: CatalystMetadataMap
}
export type BackpackUpdateEquippedWearablesAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_EQUIPPED_WEARABLES
  payload: BackpackUpdateEquippedWearablesPayload
}
export type BackpackUpdateEquippedEmotesAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_EQUIPPED_EMOTES
  payload: EquippedEmote[]
}
export type BackpackUpdateEquippedEmotePayload = {
  equippedEmote: EquippedEmote
  slot: number
}
export type BackpackUpdateEquippedEmoteAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_EQUIPPED_EMOTE
  payload: BackpackUpdateEquippedEmotePayload
}
export type BackpackUpdateAvatarBasePayload = PBAvatarBase
export type BackpackUpdateAvatarBaseAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_AVATAR_BASE
  payload: BackpackUpdateAvatarBasePayload
}

export type BackpackUpdateLoadedPagePayload = {
  totalPages: number
  elements: Array<CatalogWearableElement | CatalogEmoteElement>
}
export type BackpackUpdateLoadedPageAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_LOADED_PAGE
  payload: BackpackUpdateLoadedPagePayload
}
export type BackpackUpdateCacheKeyAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_CACHE_KEY
}
export type BackpackSwitchForceRenderCategory = BackpackActionId & {
  type: BACKPACK_ACTION.SWITCH_FORCE_RENDER_CATEGORY
  payload: WearableCategory
}

export type BackpackUpdateSavedResetVersionAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_SAVED_RESET_VERSION
}
export type BackpackResetOutfitAction = BackpackActionId & {
  type: BACKPACK_ACTION.RESET_OUTFIT
}
export type BackpackUpdateEmotesSavedResetVersionAction = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_EMOTES_SAVED_RESET_VERSION
}
export type BackpackResetEmotesAction = BackpackActionId & {
  type: BACKPACK_ACTION.RESET_EMOTES
}
export type BackpackUnequipWearableCategoryAction = BackpackActionId & {
  type: BACKPACK_ACTION.UNEQUIP_WEARABLE_CATEGORY
  payload: WearableCategory
}

export type BackpackChangeSectionAction = BackpackActionId & {
  type: BACKPACK_ACTION.CHANGE_SECTION
  payload: BACKPACK_SECTION
}
export type BackpackSelectEmoteSlotAction = BackpackActionId & {
  type: BACKPACK_ACTION.SELECT_EMOTE_SLOT
  payload: number
}
export type BackpackResetDefaultEmotesAction = BackpackActionId & {
  type: BACKPACK_ACTION.RESET_DEFAULT_EMOTES
}

export type BackpackUpdateSearchFilter = BackpackActionId & {
  type: BACKPACK_ACTION.UPDATE_SEARCH_FILTER
  payload: SearchFilterState
}

export type BackpackActions =
  | BackpackSelectWearableURNAction
  | BackpackUpdateCurrentPageAction
  | BackpackUpdateActiveWearableCategoryAction
  | BackpackUpdateLoadingPageAction
  | BackpackUpdateLoadedPageAction
  | BackpackUpdateEquippedWearablesAction
  | BackpackUpdateAvatarBaseAction
  | BackpackUpdateCacheKeyAction
  | BackpackSwitchForceRenderCategory
  | BackpackUpdateSavedResetVersionAction
  | BackpackResetOutfitAction
  | BackpackUnequipWearableCategoryAction
  | BackpackChangeSectionAction
  | BackpackUpdateEquippedEmotesAction
  | BackpackUpdateEquippedEmoteAction
  | BackpackSelectEmoteSlotAction
  | BackpackUpdateEmotesSavedResetVersionAction
  | BackpackResetEmotesAction
  | BackpackResetDefaultEmotesAction
  | BackpackUpdateSearchFilter

export const updateSelectedCatalogURNAction = (
  payload: URNWithoutTokenId | null
): BackpackSelectWearableURNAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.SELECT_CATALOG_URN,
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

export const updateEquippedEmotesAction = (
  payload: EquippedEmote[]
): BackpackUpdateEquippedEmotesAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_EQUIPPED_EMOTES,
  payload
})

export const updateEquippedEmoteAction = (
  payload: BackpackUpdateEquippedEmotePayload
): BackpackUpdateEquippedEmoteAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_EQUIPPED_EMOTE,
  payload
})

export const updateAvatarBase = (
  payload: BackpackUpdateAvatarBasePayload
): BackpackUpdateAvatarBaseAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_AVATAR_BASE,
  payload
})

export const updateCacheKey = (): BackpackUpdateCacheKeyAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_CACHE_KEY
})

export const switchForceRenderCategory = (
  payload: WearableCategory
): BackpackSwitchForceRenderCategory => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.SWITCH_FORCE_RENDER_CATEGORY,
  payload
})

export const updateSavedResetVersion =
  (): BackpackUpdateSavedResetVersionAction => ({
    __reducer: BACKPACK_STORE_ID,
    type: BACKPACK_ACTION.UPDATE_SAVED_RESET_VERSION
  })

export const resetOutfitAction = (): BackpackResetOutfitAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.RESET_OUTFIT
})

export const updateEmotesSavedResetVersion =
  (): BackpackUpdateEmotesSavedResetVersionAction => ({
    __reducer: BACKPACK_STORE_ID,
    type: BACKPACK_ACTION.UPDATE_EMOTES_SAVED_RESET_VERSION
  })

export const resetEmotesAction = (): BackpackResetEmotesAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.RESET_EMOTES
})

export const unequipWearableCategory = (
  payload: WearableCategory
): BackpackUnequipWearableCategoryAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UNEQUIP_WEARABLE_CATEGORY,
  payload
})

export const changeSectionAction = (
  payload: BACKPACK_SECTION
): BackpackChangeSectionAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.CHANGE_SECTION,
  payload
})

export const selectEmoteSlotAction = (
  payload: number
): BackpackSelectEmoteSlotAction => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.SELECT_EMOTE_SLOT,
  payload
})

export const resetDefaultEmotesAction =
  (): BackpackResetDefaultEmotesAction => ({
    __reducer: BACKPACK_STORE_ID,
    type: BACKPACK_ACTION.RESET_DEFAULT_EMOTES
  })

export const updateSearchFilterAction = (
  payload: SearchFilterState
): BackpackUpdateSearchFilter => ({
  __reducer: BACKPACK_STORE_ID,
  type: BACKPACK_ACTION.UPDATE_SEARCH_FILTER,
  payload
})

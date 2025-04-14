import type { WearableCategory } from '../../service/categories'
import type {
  CatalogEmoteElement,
  CatalogWearableElement,
  OutfitSetup
} from '../../utils/item-definitions'
import type { EquippedEmote, URNWithoutTokenId } from '../../utils/definitions'
import { EMPTY_OUTFIT, getWearablesFromOutfit } from '../../service/outfit'
import type { PBAvatarBase } from '../../bevy-api/interface'
import {
  DEFAULT_EMOTE_ELEMENTS,
  EMPTY_EMOTES,
  ITEMS_CATALOG_PAGE_SIZE
} from '../../utils/backpack-constants'

export const BACKPACK_STORE_ID: 'backpack' = 'backpack'
export enum BACKPACK_SECTION {
  WEARABLES,
  EMOTES,
  OUTFITS
}
export type SearchFilterState = {
  name: string
}
export type BackpackPageState = {
  activeSection: BACKPACK_SECTION
  activeWearableCategory: WearableCategory | null
  searchFilter: SearchFilterState
  selectedEmoteSlot: number
  currentPage: number
  loadingPage: boolean
  shownWearables: CatalogWearableElement[]
  shownEmotes: CatalogEmoteElement[]
  totalPages: number
  equippedEmotes: EquippedEmote[]
  equippedWearables: URNWithoutTokenId[]
  outfitSetup: OutfitSetup
  forceRender: WearableCategory[]
  changedFromResetVersion: boolean
  savedResetOutfit: {
    base: PBAvatarBase
    equippedWearables: URNWithoutTokenId[]
    forceRender: WearableCategory[]
  }
  changedEmotesFromResetVersion: boolean
  savedResetEmotes: EquippedEmote[]
  equippedItems: Array<URNWithoutTokenId | EquippedEmote> // gather equippedWearables, baseBody.bodyShapeUrn & emotes
  selectedURN: URNWithoutTokenId | null
  cacheKey: string
}

export const backpackInitialState: BackpackPageState = {
  activeSection: BACKPACK_SECTION.WEARABLES,
  activeWearableCategory: null,
  searchFilter: {
    name: ''
  },
  selectedEmoteSlot: 1,
  currentPage: 1,
  loadingPage: false,
  shownWearables: new Array(ITEMS_CATALOG_PAGE_SIZE).fill(null),
  shownEmotes: DEFAULT_EMOTE_ELEMENTS,
  totalPages: 0,
  equippedWearables: getWearablesFromOutfit(EMPTY_OUTFIT),
  equippedEmotes: EMPTY_EMOTES,
  equippedItems: [
    EMPTY_OUTFIT.base.bodyShapeUrn,
    ...getWearablesFromOutfit(EMPTY_OUTFIT)
  ],
  outfitSetup: EMPTY_OUTFIT,
  selectedURN: null,
  forceRender: [],
  cacheKey: '',
  changedFromResetVersion: false,
  savedResetOutfit: {
    base: EMPTY_OUTFIT.base,
    equippedWearables: getWearablesFromOutfit(EMPTY_OUTFIT),
    forceRender: []
  },
  changedEmotesFromResetVersion: true,
  savedResetEmotes: EMPTY_EMOTES
}

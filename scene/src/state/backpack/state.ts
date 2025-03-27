import type { WearableCategory } from '../../service/categories'
import type {
  CatalogEmoteElement,
  CatalogWearableElement,
  OutfitSetup
} from '../../utils/item-definitions'
import type {
  offchainEmoteURN,
  URN,
  URNWithoutTokenId
} from '../../utils/definitions'
import { EMPTY_OUTFIT, getWearablesFromOutfit } from '../../service/outfit'
import { ITEMS_CATALOG_PAGE_SIZE } from '../../utils/constants'
import type { PBAvatarBase } from '../../bevy-api/interface'
import {
  DEFAULT_EMOTE_ELEMENTS,
  DEFAULT_EMOTE_NAMES,
  DEFAULT_EMOTES
} from '../../service/emotes'

export const BACKPACK_STORE_ID: 'backpack' = 'backpack'
export enum BACKPACK_SECTION {
  WEARABLES,
  EMOTES,
  OUTFITS
}

export type BackpackPageState = {
  activeSection: BACKPACK_SECTION
  activeWearableCategory: WearableCategory | null
  currentPage: number
  loadingPage: boolean
  shownWearables: CatalogWearableElement[]
  shownEmotes: CatalogEmoteElement[]
  totalPages: number
  equippedEmotes: offchainEmoteURN[]
  equippedWearables: URNWithoutTokenId[]
  outfitSetup: OutfitSetup
  forceRender: WearableCategory[]
  changedFromResetVersion: boolean // TODO we can remove it and replace it with a memoized function that compares savedResetOutfit with state
  savedResetOutfit: {
    base: PBAvatarBase
    equippedWearables: URNWithoutTokenId[]
    forceRender: WearableCategory[]
  }
  equippedItems: Array<URNWithoutTokenId | offchainEmoteURN> // gather equippedWearables, baseBody.bodyShapeUrn & emotes
  selectedURN: URNWithoutTokenId | null
  cacheKey: string
}

export const backpackInitialState: BackpackPageState = {
  activeSection: BACKPACK_SECTION.WEARABLES,
  activeWearableCategory: null,
  currentPage: 1,
  loadingPage: false,
  shownWearables: new Array(ITEMS_CATALOG_PAGE_SIZE).fill(null),
  shownEmotes: DEFAULT_EMOTE_ELEMENTS,
  totalPages: 0,
  equippedWearables: getWearablesFromOutfit(EMPTY_OUTFIT),
  equippedEmotes: DEFAULT_EMOTES,
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
  }
}

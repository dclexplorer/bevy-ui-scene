import type { WearableCategory } from '../../service/categories'
import type {
  CatalogWearableElement,
  OutfitSetup
} from '../../utils/item-definitions'
import type { URNWithoutTokenId } from '../../utils/definitions'
import { EMPTY_OUTFIT, getWearablesFromOutfit } from '../../service/outfit'
import { WEARABLE_CATALOG_PAGE_SIZE } from '../../utils/constants'
import type { PBAvatarBase } from '../../bevy-api/interface'

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
  totalPages: number
  equippedEmotes: URNWithoutTokenId[]
  equippedWearables: URNWithoutTokenId[]
  outfitSetup: OutfitSetup
  forceRender: WearableCategory[]
  changedFromResetVersion: boolean // TODO we can remove it and replace it with a memoized function that compares savedResetOutfit with state
  savedResetOutfit: {
    base: PBAvatarBase
    equippedWearables: URNWithoutTokenId[]
    forceRender: WearableCategory[]
  }
  equippedItems: URNWithoutTokenId[] // gather equippedWearables, baseBody.bodyShapeUrn & emotes
  selectedURN: URNWithoutTokenId | null
  cacheKey: string
}

export const backpackInitialState: BackpackPageState = {
  activeSection: BACKPACK_SECTION.WEARABLES,
  activeWearableCategory: null,
  currentPage: 1,
  loadingPage: false,
  shownWearables: new Array(WEARABLE_CATALOG_PAGE_SIZE).fill(null),
  totalPages: 0,
  equippedWearables: getWearablesFromOutfit(EMPTY_OUTFIT),
  equippedEmotes: [],
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

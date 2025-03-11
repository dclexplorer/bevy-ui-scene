import type { WearableCategory } from '../../service/wearable-categories'
import type {
  CatalogWearableElement,
  OutfitSetup
} from '../../utils/wearables-definitions'
import type { URNWithoutTokenId } from '../../utils/definitions'
import { EMPTY_OUTFIT, getWearablesFromOutfit } from '../../service/outfit'
import { WEARABLE_CATALOG_PAGE_SIZE } from '../../utils/constants'

export const BACKPACK_STORE_ID: 'backpack' = 'backpack'

export type BackpackPageState = {
  activeWearableCategory: WearableCategory | null
  currentPage: number
  loadingPage: boolean
  shownWearables: CatalogWearableElement[]
  totalPages: number
  equippedWearables: URNWithoutTokenId[]
  outfitSetup: OutfitSetup
  selectedURN: URNWithoutTokenId | null
  cacheKey: string
}

export const backpackInitialState: BackpackPageState = {
  activeWearableCategory: null,
  currentPage: 1,
  loadingPage: false,
  shownWearables: new Array(WEARABLE_CATALOG_PAGE_SIZE).fill(null),
  totalPages: 0,
  equippedWearables: getWearablesFromOutfit(EMPTY_OUTFIT),
  outfitSetup: EMPTY_OUTFIT,
  selectedURN: null,
  cacheKey: ''
}

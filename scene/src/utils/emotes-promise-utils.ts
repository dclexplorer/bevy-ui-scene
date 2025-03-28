import type {
  CatalogEmoteElement,
  CatalogWearableElement
} from './item-definitions'
import {
  CATALYST_BASE_URL_FALLBACK,
  ITEMS_CATALOG_PAGE_SIZE,
  ITEMS_ORDER_BY,
  ITEMS_ORDER_DIRECTION
} from './constants'
import { getRealm } from '~system/Runtime'
import { fetchJsonOrTryFallback } from './promise-utils'
import { DEFAULT_EMOTE_ELEMENTS, DEFAULT_EMOTES } from '../service/emotes'
import { catalystEntityMap } from './wearables-promise-utils'
import { type URNWithoutTokenId } from './definitions'

export type EmotesCatalogPageRequest = {
  pageNum: number
  pageSize: number
  address: string
  orderBy?:
    | typeof ITEMS_ORDER_BY.DATE
    | typeof ITEMS_ORDER_BY.RARITY
    | typeof ITEMS_ORDER_BY.NAME
  orderDirection?:
    | typeof ITEMS_ORDER_DIRECTION.ASC
    | typeof ITEMS_ORDER_DIRECTION.DESC
  cacheKey: string
}
export type EmotesPageResponse = {
  elements: CatalogEmoteElement[]
  pageNum: number
  pageSize: number
  totalAmount: number
}

const pageCache = new Map<string, EmotesPageResponse>()

export async function fetchEmotesPage({
  pageNum,
  pageSize,
  address,
  orderBy = ITEMS_ORDER_BY.DATE,
  orderDirection = ITEMS_ORDER_DIRECTION.DESC,
  cacheKey = Date.now().toString()
}: EmotesCatalogPageRequest): Promise<EmotesPageResponse> {
  const realm = await getRealm({})
  const catalystBaseURl = realm.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
  const emoteCatalogPageURL = `${catalystBaseURl}${getEmoteCatalogPageURL({
    pageNum,
    pageSize,
    address,
    orderBy,
    orderDirection,
    cacheKey
  })}`
  if (pageCache.has(emoteCatalogPageURL)) {
    return pageCache.get(emoteCatalogPageURL) as EmotesPageResponse
  }
  const emotesPageResponse: EmotesPageResponse =
    await fetchJsonOrTryFallback(emoteCatalogPageURL)
  const originalTotalAmount = emotesPageResponse.totalAmount
  emotesPageResponse.totalAmount += DEFAULT_EMOTES.length
  const isExtraPage =
    pageNum * pageSize >=
    (Math.ceil(originalTotalAmount / pageSize) + 1) * pageSize
  const isOriginalLastPage =
    pageNum * pageSize >= originalTotalAmount && !isExtraPage
  const lastPageEmptyCells =
    Math.ceil(originalTotalAmount / pageSize) * pageSize - originalTotalAmount
  // TODO Unit test candidate about elements decoration with DEFAULT_EMOTE_ELEMENTS
  if (isOriginalLastPage && lastPageEmptyCells > 0) {
    emotesPageResponse.elements = [
      ...emotesPageResponse.elements,
      ...DEFAULT_EMOTE_ELEMENTS.slice(0, lastPageEmptyCells)
    ] as CatalogEmoteElement[]
  } else if (
    isExtraPage &&
    lastPageEmptyCells < DEFAULT_EMOTE_ELEMENTS.length
  ) {
    emotesPageResponse.elements = [
      ...emotesPageResponse.elements,
      ...DEFAULT_EMOTE_ELEMENTS.slice(
        lastPageEmptyCells,
        DEFAULT_EMOTE_ELEMENTS.length
      )
    ] as CatalogEmoteElement[]
  }

  emotesPageResponse.elements?.forEach((emoteElement: CatalogEmoteElement) => {
    catalystEntityMap[emoteElement.urn as URNWithoutTokenId] =
      emoteElement.entity.metadata
  })

  pageCache.set(emoteCatalogPageURL, emotesPageResponse)
  return emotesPageResponse
}

function getEmoteCatalogPageURL(params: EmotesCatalogPageRequest): string {
  const { pageNum, pageSize, address, orderBy, orderDirection, cacheKey } =
    params

  let url: string = `/lambdas/users/${address}/emotes?includeEntities=true&pageNum=${pageNum}&pageSize=${pageSize}`
  url += `&orderBy=${orderBy}&direction=${orderDirection}&cacheKey=${cacheKey}`
  return url
}

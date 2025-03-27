import type { CatalogEmoteElement } from './item-definitions'
import {
  CATALYST_BASE_URL_FALLBACK,
  ITEMS_ORDER_BY,
  ITEMS_ORDER_DIRECTION
} from './constants'
import { getRealm } from '~system/Runtime'
import { fetchJsonOrTryFallback } from './promise-utils'
import { DEFAULT_EMOTE_ELEMENTS } from '../service/emotes'

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

  const isLastPage = pageNum * pageSize >= emotesPageResponse.totalAmount

  if (isLastPage) {
    let combinedElements = [
      ...emotesPageResponse.elements,
      ...DEFAULT_EMOTE_ELEMENTS
    ]

    // Si al agregar los default emotes, la cantidad excede pageSize, dividir en otra página
    if (combinedElements.length > pageSize) {
      const newTotalAmount =
        emotesPageResponse.totalAmount + DEFAULT_EMOTE_ELEMENTS.length
      const newPageNum = Math.ceil(newTotalAmount / pageSize)

      if (pageNum < newPageNum) {
        combinedElements = combinedElements.slice(0, pageSize)
      }

      return {
        elements: combinedElements,
        pageNum,
        pageSize,
        totalAmount: newTotalAmount
      }
    }
    const result = {
      elements: combinedElements,
      pageNum,
      pageSize,
      totalAmount:
        emotesPageResponse.totalAmount + DEFAULT_EMOTE_ELEMENTS.length
    }
    console.log('fetchEmotesPage', result)
    return result
  }

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

import type {
  CatalogWearableElement,
  WearableEntityMetadata,
  EmoteEntityMetadata
} from './item-definitions'
import type { URNWithoutTokenId } from './definitions'
import { type WearableCategory } from '../service/categories'
import {
  CATALYST_BASE_URL_FALLBACK,
  type ITEMS_ORDER_BY,
  type ITEMS_ORDER_DIRECTION
} from './constants'
import { fetchJsonOrTryFallback } from './promise-utils'
import { catalystMetadataMap } from './catalyst-metadata-map'
import { type SearchFilterState } from '../state/backpack/state'
import { updateLoadingPage } from '../state/backpack/actions'
import { store } from '../state/store'

export type WearablesPageResponse = {
  elements: CatalogWearableElement[]
  pageNum: number
  pageSize: number
  totalAmount: number
}
export type WearableCatalogRequest = {
  // TODO rename if its used for wearables but also for emotes
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
  wearableCategory: WearableCategory | null
  cacheKey: string
  searchFilter: SearchFilterState
}
export type WearableCatalogPageParams = WearableCatalogRequest & {
  includeBase: boolean
  includeOnChain: boolean
  catalystBaseUrl: string
  searchFilter: SearchFilterState
}

const pageCache = new Map<string, WearablesPageResponse>()
export const fetchWearablesPage =
  (catalystBaseUrl?: string) =>
  async (
    requestParams: WearableCatalogRequest
  ): Promise<WearablesPageResponse> => {
    const {
      pageNum,
      pageSize,
      wearableCategory,
      address,
      cacheKey = Date.now().toString(),
      searchFilter
    } = requestParams
    try {
      const wearableCatalogPageURL = getWearableCatalogPageURL({
        pageNum,
        pageSize,
        address,
        wearableCategory,
        includeBase: !searchFilter.collectiblesOnly,
        includeOnChain: true,
        catalystBaseUrl: catalystBaseUrl ?? CATALYST_BASE_URL_FALLBACK,
        cacheKey,
        searchFilter
      })
      if (pageCache.has(wearableCatalogPageURL)) {
        return pageCache.get(wearableCatalogPageURL) as WearablesPageResponse
      }

      const wearablesPageResponse: WearablesPageResponse =
        await fetchJsonOrTryFallback(wearableCatalogPageURL)

      wearablesPageResponse.elements?.forEach(
        (wearableElement: CatalogWearableElement) => {
          if (
            wearableElement.urn.includes(':collections-v1:') ||
            wearableElement.urn.includes(':off-chain:')
          ) {
            wearableElement.entity.metadata.name =
              wearableElement.entity.metadata.i18n[0].text
          }
          catalystMetadataMap[wearableElement.urn] =
            wearableElement.entity.metadata
        }
      )
      pageCache.set(wearableCatalogPageURL, wearablesPageResponse)
      return wearablesPageResponse
    } catch (error) {
      console.error('wearablesPage Error fetching:', error)
      store.dispatch(updateLoadingPage(false))
      throw error
    }

    function getWearableCatalogPageURL(
      params: WearableCatalogPageParams
    ): string {
      const {
        pageNum,
        pageSize,
        address,
        wearableCategory,
        includeBase,
        includeOnChain,
        catalystBaseUrl,
        cacheKey,
        searchFilter
      } = params
      let url: string = `${catalystBaseUrl}/explorer/${address}/wearables?pageNum=${pageNum}&pageSize=${pageSize}&includeEntities=true`
      url += `&orderBy=${searchFilter.orderBy}&direction=${searchFilter.orderDirection}&cacheKey=${cacheKey}`
      if (searchFilter.name) {
        url += `&name=${searchFilter.name}`
      }
      if (wearableCategory) url += `&category=${wearableCategory}`
      if (includeBase) url += `&collectionType=base-wearable`
      if (includeOnChain) url += `&collectionType=on-chain`
      return url
    }
  }

export const fetchWearablesData =
  (catalystBaseUrl: string) =>
  async (
    ...entityURNs: URNWithoutTokenId[]
  ): Promise<Array<WearableEntityMetadata | EmoteEntityMetadata>> => {
    if (entityURNs.every((entityURN) => catalystMetadataMap[entityURN])) {
      return entityURNs.map((entityURN) => catalystMetadataMap[entityURN])
    }
    try {
      const baseURL = `${catalystBaseUrl}/lambdas/collections/wearables`
      const url = `${baseURL}?${entityURNs
        .map((urn: URNWithoutTokenId) => {
          return `wearableId=${urn}`
        })
        .join('&')}`
      const wearables = (await fetchJsonOrTryFallback(url)).wearables
      wearables.forEach((wearable: WearableEntityMetadata) => {
        const wearableURN: URNWithoutTokenId = wearable.id
        catalystMetadataMap[wearableURN] = wearable
      })
      return wearables
    } catch (error) {
      console.error('fetchWearablesData error', error)
      return []
    }
  }

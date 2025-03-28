import type {
  CatalogWearableElement,
  WearableEntityMetadata,
  CatalystMetadataMap,
  EmoteEntityMetadata
} from './item-definitions'
import type { URNWithoutTokenId } from './definitions'
import { type WearableCategory } from '../service/categories'
import { getRealm } from '~system/Runtime'
import {
  CATALYST_BASE_URL_FALLBACK,
  ITEMS_ORDER_BY,
  ITEMS_ORDER_DIRECTION
} from './constants'
import { fetchJsonOrTryFallback } from './promise-utils'

export type WearablesPageResponse = {
  elements: CatalogWearableElement[]
  pageNum: number
  pageSize: number
  totalAmount: number
}
export type WearableCatalogRequest = {
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
}
export type WearableCatalogPageParams = WearableCatalogRequest & {
  includeBase: boolean
  includeOnChain: boolean
  catalystBaseUrl: string
}

// cache
export const catalystMetadataMap: CatalystMetadataMap = {}

const pageCache = new Map<string, WearablesPageResponse>()
export async function fetchWearablesPage({
  pageNum,
  pageSize,
  wearableCategory,
  address,
  orderBy = ITEMS_ORDER_BY.DATE,
  orderDirection = ITEMS_ORDER_DIRECTION.DESC,
  cacheKey = Date.now().toString()
}: WearableCatalogRequest): Promise<WearablesPageResponse> {
  try {
    const realm = await getRealm({})
    const wearableCatalogPageURL = getWearableCatalogPageURL({
      pageNum,
      pageSize,
      address,
      wearableCategory,
      orderBy,
      orderDirection,
      includeBase: true,
      includeOnChain: true,
      catalystBaseUrl: realm.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK,
      cacheKey
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
      orderBy,
      orderDirection,
      includeBase,
      includeOnChain,
      catalystBaseUrl,
      cacheKey
    } = params
    let url: string = `${catalystBaseUrl}/explorer/${address}/wearables?pageNum=${pageNum}&pageSize=${pageSize}&includeEntities=true`
    url += `&orderBy=${orderBy}&direction=${orderDirection}&cacheKey=${cacheKey}`
    if (wearableCategory) url += `&category=${wearableCategory}`
    if (includeBase) url += `&collectionType=base-wearable`
    if (includeOnChain) url += `&collectionType=on-chain`
    return url
  }
}

export async function fetchWearablesData(
  ...entityURNs: URNWithoutTokenId[]
): Promise<Array<WearableEntityMetadata | EmoteEntityMetadata>> {
  if (entityURNs.every((entityURN) => catalystMetadataMap[entityURN])) {
    return entityURNs.map((entityURN) => catalystMetadataMap[entityURN])
  }
  try {
    const realm = await getRealm({})
    const realmBaseURL =
      realm.realmInfo?.baseUrl ?? 'https://peer.decentraland.org'
    const baseURL = `${realmBaseURL}/lambdas/collections/wearables`
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

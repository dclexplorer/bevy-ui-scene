import type {
  CatalogWearableElement,
  WearableEntityMetadata,
  CatalystWearableMap
} from './item-definitions'
import type { URNWithoutTokenId } from './definitions'
import { type WearableCategory } from '../service/categories'
import { getRealm } from '~system/Runtime'

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
    | typeof WEARABLES_ORDER_BY.DATE
    | typeof WEARABLES_ORDER_BY.RARITY
    | typeof WEARABLES_ORDER_BY.NAME
  orderDirection?:
    | typeof WEARABLES_ORDER_DIRECTION.ASC
    | typeof WEARABLES_ORDER_DIRECTION.DESC
  wearableCategory: WearableCategory | null
  cacheKey: string
}
export type WearableCatalogPageParams = WearableCatalogRequest & {
  includeBase: boolean
  includeOnChain: boolean
  catalystBaseUrl: string
}

// cache
export const catalystWearableMap: CatalystWearableMap = {}
const WEARABLES_ORDER_BY = {
  DATE: 'date',
  RARITY: 'rarity',
  NAME: 'name'
}
const WEARABLES_ORDER_DIRECTION = {
  DESC: 'DESC',
  ASC: 'ASC'
}

const pageCache = new Map<string, WearablesPageResponse>()
const CATALYST_BASE_URL_FALLBACK = 'https://peer.decentraland.org'
export async function fetchWearablesPage({
  pageNum,
  pageSize,
  wearableCategory,
  address,
  orderBy = WEARABLES_ORDER_BY.DATE,
  orderDirection = WEARABLES_ORDER_DIRECTION.DESC,
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
        catalystWearableMap[wearableElement.urn] =
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
  ...wearableURNs: URNWithoutTokenId[]
): Promise<WearableEntityMetadata[]> {
  if (wearableURNs.every((wearableURN) => catalystWearableMap[wearableURN])) {
    return wearableURNs.map((wearableURN) => catalystWearableMap[wearableURN])
  }
  try {
    const realm = await getRealm({})
    const realmBaseURL =
      realm.realmInfo?.baseUrl ?? 'https://peer.decentraland.org'
    const baseURL = `${realmBaseURL}/lambdas/collections/wearables`
    const url = `${baseURL}?${wearableURNs
      .map((urn: URNWithoutTokenId) => {
        return `wearableId=${urn}`
      })
      .join('&')}`
    const wearables = (await fetchJsonOrTryFallback(url)).wearables
    wearables.forEach((wearable: WearableEntityMetadata) => {
      const wearableURN: URNWithoutTokenId = wearable.id
      catalystWearableMap[wearableURN] = wearable
    })
    return wearables
  } catch (error) {
    console.error('fetchWearablesData error', error)
    return []
  }
}

export async function fetchJsonOrTryFallback(URL: string): Promise<any> {
  const realmBaseURL =
    (await getRealm({})).realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
  try {
    return await (await fetch(URL)).json()
  } catch (error) {
    return await (
      await fetch(URL.replace(realmBaseURL, CATALYST_BASE_URL_FALLBACK))
    ).json()
  }
}

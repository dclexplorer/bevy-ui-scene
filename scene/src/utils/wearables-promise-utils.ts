import type {
  CatalogWearableElement,
  WearableEntityMetadata,
  CatalystWearableMap
} from './wearables-definitions'
import type { URNWithoutTokenId } from './definitions'
import { type WearableCategory } from '../service/wearable-categories'
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
  orderBy: string
  orderDirection: string
  wearableCategory: WearableCategory | null
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

export async function fetchWearablesPage({
  pageNum,
  pageSize,
  wearableCategory,
  address,
  orderBy = WEARABLES_ORDER_BY.DATE,
  orderDirection = WEARABLES_ORDER_DIRECTION.DESC
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
      catalystBaseUrl:
        realm.realmInfo?.baseUrl ?? 'https://peer.decentraland.org'
    })
    if (pageCache.has(wearableCatalogPageURL)) {
      return pageCache.get(wearableCatalogPageURL) as WearablesPageResponse
    }

    const wearablesPageResponse: any = await fetch(wearableCatalogPageURL)
    const result: WearablesPageResponse = await wearablesPageResponse.json()

    result.elements?.forEach((wearableElement: CatalogWearableElement) => {
      if (
        wearableElement.urn.includes(':collections-v1:') ||
        wearableElement.urn.includes(':off-chain:')
      ) {
        // TODO review if we can use CatalogWearableElement instead of WearableEntityMetadata
        wearableElement.entity.metadata.name =
          wearableElement.entity.metadata.i18n[0].text
      }
      catalystWearableMap[wearableElement.urn] = wearableElement.entity.metadata
    })
    pageCache.set(wearableCatalogPageURL, result)
    return result
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
      catalystBaseUrl
    } = params
    let url: string = `${catalystBaseUrl}/explorer/${address}/wearables?pageNum=${pageNum}&pageSize=${pageSize}&includeEntities=true`
    url += `&orderBy=${orderBy}&direction=${orderDirection}`
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
    const response = await fetch(url)
    const wearables = (await response.json()).wearables
    wearables.forEach((wearable: WearableEntityMetadata) => {
      catalystWearableMap[wearable.id] = wearable
    })
    return wearables
  } catch (error) {
    console.error('fetchWearablesData error', error)
    return []
  }
}

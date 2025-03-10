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
  wearableCategory: WearableCategory | null
}
export type WearableCatalogPageParams = WearableCatalogRequest & {
  includeBase: boolean
  includeOnChain: boolean
  catalystBaseUrl: string
}

// cache
export const catalystWearableMap: CatalystWearableMap = {}

export async function fetchWearablesPage({
  pageNum,
  pageSize,
  wearableCategory,
  address
}: WearableCatalogRequest): Promise<WearablesPageResponse> {
  try {
    const realm = await getRealm({})
    const wearableCatalogPageURL = getWearableCatalogPageURL({
      pageNum,
      pageSize,
      address,
      wearableCategory,
      includeBase: true,
      includeOnChain: true,
      catalystBaseUrl:
        realm.realmInfo?.baseUrl ?? 'https://peer.decentraland.org'
    })

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
    return result
  } catch (error) {
    console.error('wearablesPage Error fetching:', error)
    throw error
  }

  function getWearableCatalogPageURL({
    pageNum,
    pageSize,
    address,
    wearableCategory,
    includeBase,
    includeOnChain,
    catalystBaseUrl
  }: WearableCatalogPageParams): string {
    let str: string = `${catalystBaseUrl}/explorer/${address}/wearables?pageNum=${pageNum}&pageSize=${pageSize}&includeEntities=true`
    if (wearableCategory !== null) {
      str += `&category=${wearableCategory}`
    }
    if (includeBase) {
      str += `&collectionType=base-wearable`
    }
    if (includeOnChain) {
      str += `&collectionType=on-chain`
    }
    return str
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

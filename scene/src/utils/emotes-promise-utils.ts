import type {
  CatalogEmoteElement,
  EmoteEntityMetadata,
  WearableEntityMetadata
} from './item-definitions'
import {
  CATALYST_BASE_URL_FALLBACK,
  ITEMS_ORDER_BY,
  ITEMS_ORDER_DIRECTION
} from './constants'
import { getRealm } from '~system/Runtime'
import { fetchJsonOrTryFallback } from './promise-utils'

import {
  type EquippedEmote,
  type offchainEmoteURN,
  type URNWithoutTokenId
} from './definitions'
import { decoratePageResultWithEmbededEmotes } from '../service/emote-catalog-decoration'
import { catalystMetadataMap } from './catalyst-metadata-map'
import { DEFAULT_EMOTES } from './backpack-constants'

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

export async function fetchEmotesPage(
  emotesPageRequest: EmotesCatalogPageRequest
): Promise<EmotesPageResponse> {
  const {
    pageNum,
    pageSize,
    address,
    orderBy = ITEMS_ORDER_BY.DATE,
    orderDirection = ITEMS_ORDER_DIRECTION.DESC,
    cacheKey = Date.now().toString()
  } = emotesPageRequest
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
  const decoratedEmotesPageResponse: EmotesPageResponse =
    decoratePageResultWithEmbededEmotes(emotesPageRequest, emotesPageResponse)

  pageCache.set(emoteCatalogPageURL, decoratedEmotesPageResponse)
  return decoratedEmotesPageResponse
}

function getEmoteCatalogPageURL(params: EmotesCatalogPageRequest): string {
  const { pageNum, pageSize, address, orderBy, orderDirection, cacheKey } =
    params

  let url: string = `/lambdas/users/${address}/emotes?includeEntities=true&pageNum=${pageNum}&pageSize=${pageSize}`
  url += `&orderBy=${orderBy}&direction=${orderDirection}&cacheKey=${cacheKey}`
  return url
}

export async function fetchEmotesData(
  ...entityURNs: EquippedEmote[]
): Promise<Array<WearableEntityMetadata | EmoteEntityMetadata>> {
  if (
    entityURNs.every(
      (entityURN) => catalystMetadataMap[entityURN as URNWithoutTokenId]
    )
  ) {
    return entityURNs.map(
      (entityURN) => catalystMetadataMap[entityURN as URNWithoutTokenId]
    )
  }
  try {
    const realm = await getRealm({})
    const realmBaseURL =
      realm.realmInfo?.baseUrl ?? 'https://peer.decentraland.org'
    const baseURL = `${realmBaseURL}/lambdas/collections/emotes`
    const url = `${baseURL}?${entityURNs
      .filter((i) => !DEFAULT_EMOTES.includes(i as offchainEmoteURN))
      .filter((i) => i)
      .map((urn: EquippedEmote) => {
        return `emoteId=${urn}`
      })
      .join('&')}`

    const emotes = (await fetchJsonOrTryFallback(url)).emotes
    emotes.forEach((emoteEntityMetadata: EmoteEntityMetadata) => {
      const itemURN: EquippedEmote = emoteEntityMetadata.id as EquippedEmote
      catalystMetadataMap[itemURN as URNWithoutTokenId] = emoteEntityMetadata
    })
    return emotes
  } catch (error) {
    console.error('fetchWearablesData error', error)
    return []
  }
}

import { cloneDeep } from '../utils/function-utils'
import type { CatalogEmoteElement } from '../utils/item-definitions'

import type { URNWithoutTokenId } from '../utils/definitions'
import {
  type EmotesCatalogPageRequest,
  type EmotesPageResponse
} from '../utils/emotes-promise-utils'
import {
  DEFAULT_EMOTE_ELEMENTS,
  DEFAULT_EMOTE_NAMES,
  DEFAULT_EMOTES
} from '../utils/backpack-constants'
import { catalystMetadataMap } from '../utils/catalyst-metadata-map'

export function decoratePageResultWithEmbededEmotes(
  emotesPageRequest: EmotesCatalogPageRequest,
  emotesPageResponse: EmotesPageResponse
): EmotesPageResponse {
  const { pageNum, pageSize, searchFilter } = emotesPageRequest
  const originalTotalAmount = emotesPageResponse.totalAmount
  const newEmotesPageResponse = cloneDeep(emotesPageResponse)
  const filteredDefaultEmotes = !searchFilter?.name
    ? DEFAULT_EMOTES
    : DEFAULT_EMOTES.filter((offchainURN): boolean => {
        if (offchainURN.includes(searchFilter.name.toLowerCase())) return true
        if (
          DEFAULT_EMOTE_NAMES[offchainURN]
            .toLowerCase()
            .includes(searchFilter.name)
        )
          return true
        return false
      })
  const filteredDefaultEmoteElements = searchFilter.collectiblesOnly
    ? []
    : DEFAULT_EMOTE_ELEMENTS.filter((element) =>
        filteredDefaultEmotes.includes(element.urn)
      )
  if (!searchFilter.collectiblesOnly) {
    newEmotesPageResponse.totalAmount += filteredDefaultEmotes.length
  }

  const isExtraPage =
    pageNum * pageSize >=
    (Math.ceil(originalTotalAmount / pageSize) + 1) * pageSize
  const isOriginalLastPage =
    pageNum * pageSize >= originalTotalAmount && !isExtraPage
  const lastPageEmptyCells =
    Math.ceil(originalTotalAmount / pageSize) * pageSize - originalTotalAmount

  if (isOriginalLastPage && lastPageEmptyCells > 0) {
    newEmotesPageResponse.elements = [
      ...emotesPageResponse.elements,
      ...filteredDefaultEmoteElements.slice(0, lastPageEmptyCells)
    ] as CatalogEmoteElement[]
  } else if (
    isExtraPage &&
    lastPageEmptyCells < filteredDefaultEmoteElements.length
  ) {
    newEmotesPageResponse.elements = [
      ...emotesPageResponse.elements,
      ...filteredDefaultEmoteElements.slice(
        lastPageEmptyCells,
        filteredDefaultEmoteElements.length
      )
    ] as CatalogEmoteElement[]
  }

  newEmotesPageResponse.elements?.forEach(
    (emoteElement: CatalogEmoteElement) => {
      catalystMetadataMap[emoteElement.urn as URNWithoutTokenId] =
        emoteElement?.entity?.metadata
    }
  )
  return newEmotesPageResponse
}

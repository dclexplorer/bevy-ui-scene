import { cloneDeep } from '../utils/function-utils'
import { DEFAULT_EMOTE_ELEMENTS, DEFAULT_EMOTES } from './emotes'
import type { CatalogEmoteElement } from '../utils/item-definitions'
import { catalystMetadataMap } from '../utils/wearables-promise-utils'
import type { URNWithoutTokenId } from '../utils/definitions'
import {
  type EmotesCatalogPageRequest,
  type EmotesPageResponse
} from '../utils/emotes-promise-utils'

export function decoratePageResultWithEmbededEmotes(
  emotesPageRequest: EmotesCatalogPageRequest,
  emotesPageResponse: EmotesPageResponse
): EmotesPageResponse {
  const { pageNum, pageSize } = emotesPageRequest
  const originalTotalAmount = emotesPageResponse.totalAmount
  const newEmotesPageResponse = cloneDeep(
    emotesPageResponse
  ) as EmotesPageResponse

  newEmotesPageResponse.totalAmount += DEFAULT_EMOTES.length
  const isExtraPage =
    pageNum * pageSize >=
    (Math.ceil(originalTotalAmount / pageSize) + 1) * pageSize
  const isOriginalLastPage =
    pageNum * pageSize >= originalTotalAmount && !isExtraPage
  const lastPageEmptyCells =
    Math.ceil(originalTotalAmount / pageSize) * pageSize - originalTotalAmount
  // TODO Unit test candidate about elements decoration with DEFAULT_EMOTE_ELEMENTS

  if (isOriginalLastPage && lastPageEmptyCells > 0) {
    newEmotesPageResponse.elements = [
      ...newEmotesPageResponse.elements,
      ...DEFAULT_EMOTE_ELEMENTS.slice(0, lastPageEmptyCells)
    ] as CatalogEmoteElement[]
  } else if (
    isExtraPage &&
    lastPageEmptyCells < DEFAULT_EMOTE_ELEMENTS.length
  ) {
    newEmotesPageResponse.elements = [
      ...newEmotesPageResponse.elements,
      ...DEFAULT_EMOTE_ELEMENTS.slice(
        lastPageEmptyCells,
        DEFAULT_EMOTE_ELEMENTS.length
      )
    ] as CatalogEmoteElement[]
  }

  newEmotesPageResponse.elements?.forEach(
    (emoteElement: CatalogEmoteElement) => {
      catalystMetadataMap[emoteElement.urn as URNWithoutTokenId] =
        emoteElement.entity.metadata
    }
  )
  return newEmotesPageResponse
}

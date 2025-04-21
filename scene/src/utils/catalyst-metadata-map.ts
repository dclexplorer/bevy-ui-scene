// cache
import { type CatalystMetadataMap } from './item-definitions'
import { DEFAULT_EMOTE_ELEMENTS } from './backpack-constants'
import { type URNWithoutTokenId } from './definitions'

export const catalystMetadataMap: CatalystMetadataMap = {
  ...DEFAULT_EMOTE_ELEMENTS.reduce((acc: CatalystMetadataMap, element) => {
    acc[element.urn as URNWithoutTokenId] = element.entity.metadata
    return acc
  }, {})
}

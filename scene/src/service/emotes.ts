import {
  type EquippedEmote,
  type offchainEmoteURN,
  type URNWithoutTokenId
} from '../utils/definitions'
import { type UiBackgroundProps } from '@dcl/react-ecs'
import { getBackgroundFromAtlas } from '../utils/ui-utils'

import {
  DEFAULT_EMOTE_NAMES,
  DEFAULT_EMOTES
} from '../utils/backpack-constants'
import { catalystMetadataMap } from '../utils/catalyst-metadata-map'

export function getEmoteName(
  emoteURN: offchainEmoteURN | URNWithoutTokenId | ``
): string {
  return (
    DEFAULT_EMOTE_NAMES[emoteURN as offchainEmoteURN] ??
    catalystMetadataMap[emoteURN as URNWithoutTokenId]?.name ??
    `<i><color=#ffffff66>none</color></i>`
  )
}
export function getEmoteThumbnail(urn: EquippedEmote): UiBackgroundProps {
  if (DEFAULT_EMOTES.includes(urn as offchainEmoteURN)) {
    return getBackgroundFromAtlas({ atlasName: 'emotes', spriteName: urn })
  } else {
    return {
      texture: {
        src: `https://peer.decentraland.org/lambdas/collections/contents/${
          urn as string
        }/thumbnail`
      },
      textureMode: 'stretch'
    }
  }
}

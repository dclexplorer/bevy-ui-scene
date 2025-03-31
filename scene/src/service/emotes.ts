import {
  type EquippedEmote,
  type offchainEmoteURN,
  type URN,
  type URNWithoutTokenId
} from '../utils/definitions'
import { type UiBackgroundProps } from '@dcl/react-ecs'
import { getBackgroundFromAtlas } from '../utils/ui-utils'
import { type CatalogEmoteElement } from '../utils/item-definitions'
import { getURNWithoutTokenId } from '../utils/urn-utils'
import { catalystMetadataMap } from '../utils/wearables-promise-utils'

export const DEFAULT_EMOTES: offchainEmoteURN[] = [
  'handsair',
  'wave',
  'fistpump',
  'dance',
  'raisehand',
  'clap',
  'money',
  'kiss',
  'headexplode',
  'shrug'
]
export const EMPTY_EMOTES: EquippedEmote[] = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
]
export const DEFAULT_EMOTE_NAMES: Record<offchainEmoteURN, string> = {
  handsair: 'Hands air',
  wave: 'Wave',
  fistpump: 'Fist pump',
  dance: 'Dance',
  raisehand: 'Raisehand',
  clap: 'Clap',
  money: 'Money',
  kiss: 'Kiss',
  headexplode: 'Head explode',
  shrug: 'Shrug'
}
export const DEFAULT_EMOTE_ELEMENTS: CatalogEmoteElement[] = DEFAULT_EMOTES.map(
  (offchainEmoteURN: offchainEmoteURN) => ({
    amount: 1,
    category: 'dance',
    entity: {
      content: [],
      id: offchainEmoteURN,
      metadata: {
        collectionAddress: '',
        description: '',
        emoteDataADR74: {
          category: 'dance',
          loop: true,
          representations: [
            {
              bodyShapes: [],
              contents: [],
              mainFile: ''
            }
          ],
          tags: []
        },
        i18n: [],
        id: offchainEmoteURN,
        image: '',
        metrics: {
          triangles: 0,
          materials: 0,
          meshes: 0,
          textures: 0,
          bodies: 0,
          entities: 0
        },
        name: DEFAULT_EMOTE_NAMES[offchainEmoteURN],
        rarity: 'base',
        thumbnail: ''
      },
      pointers: [offchainEmoteURN as URN],
      timestamp: Date.now(),
      type: 'emote',
      version: '1'
    },
    individualData: [
      {
        id: offchainEmoteURN as URN,
        tokenId: '0',
        transferredAt: '0',
        price: '0'
      }
    ],
    name: DEFAULT_EMOTE_NAMES[offchainEmoteURN],
    rarity: 'base',
    urn: offchainEmoteURN
  })
)

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

export async function fetchEquippedEmotes(
  address: string
): Promise<EquippedEmote[]> {
  const response = await fetch(
    `https://peer.decentraland.org/lambdas/profiles/${address}`
  )
    .then(async (r) => await r.json())
    .then((d) => d.avatars[0].avatar.emotes)
  return new Array(10).fill(null).map((_, index: number) => {
    const urn =
      response.find(
        (es: { slot: number; urn: URNWithoutTokenId | offchainEmoteURN }) =>
          es.slot === (index + 1) % 10
      )?.urn ?? ''
    return getURNWithoutTokenId(urn) as EquippedEmote
  })
}

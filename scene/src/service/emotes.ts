import { type offchainEmoteURN, type URN } from '../utils/definitions'
import { type UiBackgroundProps } from '@dcl/react-ecs'
import { getBackgroundFromAtlas } from '../utils/ui-utils'
import { type CatalogEmoteElement } from '../utils/item-definitions'

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

export function getEmoteName(emoteURN: offchainEmoteURN): string {
  return DEFAULT_EMOTE_NAMES[emoteURN] ?? ''
}
export function getEmoteThumbnail(urn: offchainEmoteURN): UiBackgroundProps {
  if (DEFAULT_EMOTES.includes(urn)) {
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

import type { EquippedEmote, offchainEmoteURN, URN } from './definitions'
import type { CatalogEmoteElement } from './item-definitions'

export const ITEMS_CATALOG_PAGE_SIZE = 16

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

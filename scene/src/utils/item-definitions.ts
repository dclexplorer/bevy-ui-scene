import {
  type EmoteCategory,
  type WearableCategory
} from '../service/categories'
import type { offchainEmoteURN, URN, URNWithoutTokenId } from './definitions'
import type { PBAvatarBase } from '../bevy-api/interface'

export type OutfitSetupWearables = {
  [K in WearableCategory]: URNWithoutTokenId | null
}

export type OutfitSetup = {
  wearables: OutfitSetupWearables
  base: PBAvatarBase
}

export type RarityName =
  | 'base'
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'exotic'
  | 'mythic'
  | 'unique'
type I18n = {
  code: string
  text: string
}

type Content = {
  key: string
  url: string
}

type Representation = {
  bodyShapes: URN[]
  mainFile: string
  contents: Content[]
  overrideHides: string[]
  overrideReplaces: string[]
}

type WearableEntityData = {
  replaces: string[]
  hides: string[]
  removesDefaultHiding: string[]
  tags: string[]
  category: WearableCategory
  representations: Representation[]
  blockVrmExport: boolean
}

type Metrics = {
  triangles: number
  materials: number
  meshes: number
  textures: number
  bodies: number
  entities: number
}
export type FileContent = {
  file: string
  hash: string
}

export type WearableEntityMetadata = {
  id: URNWithoutTokenId
  name: string
  description: string
  collectionAddress: string
  rarity: string
  i18n: I18n[]
  data: WearableEntityData
  image: string
  thumbnail: string
  metrics: Metrics
}
export type EntityType = 'emote' | 'wearable'
export type CatalogWearableEntity = {
  content: FileContent[]
  id: string
  metadata: WearableEntityMetadata
  pointers: URN[]
  timestamp: number
  type: EntityType
  version: string
}
export type EmoteEntityMetadata = {
  collectionAddress: string
  description: string
  emoteDataADR74: {
    category: string
    loop: boolean
    representations: Array<{
      bodyShapes: string[]
      contents: string[]
      mainFile: string
    }>
    tags: string[]
  }
  i18n: I18n[]
  id: offchainEmoteURN
  image: string
  metrics: Metrics
  name: string
  rarity: RarityName
  thumbnail: string
}

export type CatalogEmoteEntity = {
  content: FileContent[]
  id: string
  metadata: EmoteEntityMetadata
  pointers: URN[]
  timestamp: number
  type: EntityType
  version: string
}
export type ItemIndividualData = {
  id: URN
  price: string
  tokenId: string
  transferredAt: string
}

export type CatalogWearableElement = {
  amount: number
  category: WearableCategory
  entity: CatalogWearableEntity
  individualData: ItemIndividualData[]
  name: string
  rarity: RarityName
  type: 'on-chain' | 'off-chain' | 'base'
  urn: URNWithoutTokenId
}
export type CatalogEmoteElement = {
  amount: number
  category: EmoteCategory
  entity: CatalogEmoteEntity
  individualData: ItemIndividualData[]
  name: string
  rarity: RarityName
  urn: offchainEmoteURN
}
export type ItemElement = CatalogWearableElement | CatalogEmoteElement
export type CatalystMetadataMap = {
  [K in URNWithoutTokenId]: WearableEntityMetadata | EmoteEntityMetadata
}

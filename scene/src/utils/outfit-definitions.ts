import { type BASE_MALE_URN, type BASE_FEMALE_URN } from './urn-utils'
import { type RGBColor } from '../bevy-api/interface'
import { type URN } from './definitions'
import type { WearableCategory } from '../service/categories'

export type OutfitDefinition = {
  bodyShape: typeof BASE_MALE_URN | typeof BASE_FEMALE_URN
  eyes: { color: RGBColor }
  hair: { color: RGBColor }
  skin: { color: RGBColor }
  wearables: URN[]
  forceRender: WearableCategory[]
  name: string
}
export type OutfitSlot = {
  slot: number
  outfit: OutfitDefinition
}
export type OutfitsMetadata = {
  outfits: OutfitSlot[]
  namesForExtraSlots: string[]
}

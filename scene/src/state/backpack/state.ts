import { getDefaultOutfitSetup } from '../../service/default-avatar'
import { type OutfitSetup } from '../../utils/definitions'

export type BackpackState = {
  outfitSetup: OutfitSetup
}

export const backpackInitialState: BackpackState = {
  outfitSetup: getDefaultOutfitSetup()
}

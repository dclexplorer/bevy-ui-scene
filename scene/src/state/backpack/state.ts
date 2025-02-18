import { getDefaultOutfitSetup } from '../../service/default-avatar'
import {type OutfitSetup, type URN} from '../../utils/definitions'

export type BackpackState = {
  outfitSetup: OutfitSetup,
  wearables: URN[]
}

const defaultOutfitSetup = getDefaultOutfitSetup();

export const backpackInitialState: BackpackState = {
  outfitSetup: defaultOutfitSetup,
  wearables: (Object.values(defaultOutfitSetup).filter(i => i)) as unknown as URN[]
}

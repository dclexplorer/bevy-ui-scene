import { type OutfitSetup } from '../utils/definitions'

export function getDefaultOutfitSetup(): OutfitSetup {
  return {
    wearables: {
      body: fromBaseToURN('BaseMale'),
      hair: fromBaseToURN('casual_hair_01'),
      eyebrows: fromBaseToURN('eyebrows_00'),
      eyes: fromBaseToURN('eyes_00'),
      mouth: fromBaseToURN('mouth_06'),
      facial_hair: null,
      upper_body: fromBaseToURN('bee_t_shirt'),
      hands_wear: null,
      lower_body: fromBaseToURN('corduroygreenpants'),
      feet: fromBaseToURN('comfy_sport_sandals'),
      hat: null,
      eyewear: null,
      earring: null,
      mask: null,
      top_head: null,
      tiara: null,
      helmet: null,
      skin: null
    },
    color: {
      eyes: [0.5, 0.2, 0.05],
      hair: [0.5, 0.2, 0.05],
      skin: [0.82, 0.76, 0.7]
    }
  }
}

function fromBaseToURN(baseKey: string): string {
  return `urn:decentraland:off-chain:base-avatars:${baseKey}`
}

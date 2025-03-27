import { type offchainEmoteURN } from '../utils/definitions'
import { type UiBackgroundProps } from '@dcl/react-ecs'
import { getBackgroundFromAtlas } from '../utils/ui-utils'

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

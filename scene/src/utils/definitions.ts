import { InputAction } from '@dcl/sdk/ecs'
import { type Color4 } from '@dcl/sdk/math'

export type SpriteFromAtlas = {
  sprite: string
  atlasTexture: string
  atlasData: string
}

export type AtlasData = {
  frames: Record<string, Sprite>
  meta: {
    size: { w: number; h: number }
    [key: string]: any
  }
}

type CollectionName = string
type ContractAddress = string
type Network = 'ethereum' | 'matic' | 'polygon' | 'sepolia'

// https://github.com/decentraland/urn-resolver
type URN_VALUE =
  | `decentraland:off-chain:base-avatars:${string}`
  | `decentraland:${Network}:collections-v1:${ContractAddress}:${string}:${number}`
  | `decentraland:${Network}:collections-v1:${ContractAddress}:${string}`
  | `decentraland:${Network}:collections-v1:${CollectionName}:${string}:${number}`
  | `decentraland:${Network}:collections-v1:${CollectionName}:${string}`
  | `decentraland:${Network}:collections-v2:${CollectionName}:${string}:${number}`
  | `decentraland:${Network}:LAND:${number},${number}`
  | `decentraland:${Network}:LAND:${number}`
  | `decentraland:${Network}:collections-thirdparty:${string}`
  | `decentraland:${Network}:collections-thirdparty:${string}:${string}`
  | `decentraland:${Network}:collections-thirdparty:${string}:${string}:${string}`
  | `decentraland:${Network}:collections-thirdparty:${string}:${string}:${string}:${string}:${string}:${string}`

export type URN = `urn:${URN_VALUE}`
export type URNWithoutTokenId =
  | `decentraland:off-chain:base-avatars:${string}`
  | `decentraland:${Network}:collections-v1:${ContractAddress}:${string}`
  | `decentraland:${Network}:collections-v1:${CollectionName}:${string}`

export type Sprite = {
  frame: { x: number; y: number; w: number; h: number }
  rotated: false
  trimmed: false
  spriteSourceSize: { x: number; y: number; w: number; h: number }
  sourceSize: { w: number; h: number }
}
export type ColorAtlasIcon = {
  atlasName: Atlas
  spriteName: string
  color?: Color4
}
export type AtlasIcon = { atlasName: Atlas; spriteName: string }

export type ToggleType =
  | ['HeartOn', 'HeartOff']
  | ['SwitchOn', 'SwitchOff']
  | ['BellOn', 'BellOff']

export type SlotsInputs =
  | InputAction.IA_PRIMARY
  | InputAction.IA_SECONDARY
  | InputAction.IA_ACTION_3
  | InputAction.IA_ACTION_4
  | InputAction.IA_ACTION_5
  | InputAction.IA_ACTION_6

export const InputKeys: Record<SlotsInputs, string> = {
  [InputAction.IA_PRIMARY]: 'E',
  [InputAction.IA_SECONDARY]: 'F',
  [InputAction.IA_ACTION_3]: '1',
  [InputAction.IA_ACTION_4]: '2',
  [InputAction.IA_ACTION_5]: '3',
  [InputAction.IA_ACTION_6]: '4'
}

export const INPUT_KEYS_ARRAY: SlotsInputs[] = [
  InputAction.IA_ACTION_3,
  InputAction.IA_PRIMARY,
  InputAction.IA_SECONDARY,
  InputAction.IA_ACTION_4,
  InputAction.IA_ACTION_5,
  InputAction.IA_ACTION_6
]

export type SceneCategory =
  | 'favorites'
  | 'art'
  | 'crypto'
  | 'social'
  | 'game'
  | 'shop'
  | 'education'
  | 'music'
  | 'fashion'
  | 'casino'
  | 'sports'
  | 'business'
  | 'poi'
export type Setting = {
  name: string
  category: string
  description: string
  minValue: number
  maxValue: number
  namedVariants: [{ name: string; description: string }]
  value: number
}

export type Atlas =
  | 'profile'
  | 'map'
  | 'backpack'
  | 'navbar'
  | 'icons'
  | 'context'
  | 'toggles'
  | 'voice-chat'
  | 'social'
  | 'info-panel'

export type FormattedURN = {
  version: string
  contractAddress: string
  itemId: string
}

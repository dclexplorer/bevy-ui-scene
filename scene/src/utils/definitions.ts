import { InputAction } from '@dcl/sdk/ecs'

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

export type Sprite = {
  frame: { x: number; y: number; w: number; h: number }
  rotated: false
  trimmed: false
  spriteSourceSize: { x: number; y: number; w: number; h: number }
  sourceSize: { w: number; h: number }
}

export type Icon = { atlasName: string; spriteName: string }

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
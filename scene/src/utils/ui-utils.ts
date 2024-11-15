import { InputAction, type Coords } from '@dcl/sdk/ecs';
import * as fs from 'fs';
import { type AtlasData, type Sprite } from './definitions';
import { UiBackgroundProps } from '@dcl/react-ecs';

export function getUvs(atlasName:string, spriteName:string): number[] {
  const jsonData = fs.readFileSync(`scene/assets/images/atlas/${atlasName}.json`, 'utf-8')
  const parsedJson:AtlasData = JSON.parse(jsonData)
  const spriteKey = spriteName + '.png'
  if (parsedJson.frames.hasOwnProperty(spriteKey)) {
    const sprite: Sprite = parsedJson.frames.spriteKey
    const A: Coords = {
      x: sprite.frame.x / parsedJson.meta.size.w,
      y: 1 - (sprite.frame.y + sprite.frame.h) / parsedJson.meta.size.h
    }
    const B: Coords = {
      x: sprite.frame.x / parsedJson.meta.size.w,
      y: 1 - sprite.frame.y / parsedJson.meta.size.h
    }
    const C: Coords = {
      x: (sprite.frame.x + sprite.frame.w) / parsedJson.meta.size.w,
      y: 1 - sprite.frame.y / parsedJson.meta.size.h
    }
    const D: Coords = {
      x: (sprite.frame.x + sprite.frame.w) / parsedJson.meta.size.w,
      y: 1 - (sprite.frame.y + sprite.frame.h) / parsedJson.meta.size.h
    }

    const finalUvs: number[] = [A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y]
    return finalUvs
  }
  return []
}

export function getBackgroundFromAtlas(atlasName:string, spriteName:string): UiBackgroundProps { 
  const textureMode = 'stretch'
  const uvs = getUvs(atlasName, spriteName)
  const texture = {src:`scene/assets/images/atlas/${atlasName}.png`}

  return {
    textureMode,
    uvs,
    texture
  }
}








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

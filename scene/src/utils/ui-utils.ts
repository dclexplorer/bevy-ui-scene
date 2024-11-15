import { type Coords } from '@dcl/sdk/ecs';
import * as fs from 'fs';
import { Icon, type AtlasData, type Sprite } from './definitions';
import { UiBackgroundProps } from '@dcl/react-ecs';

export function getUvs(icon:Icon): number[] {
  const jsonData = fs.readFileSync(`scene/assets/images/atlas/${icon.atlasName}.json`, 'utf-8')
  const parsedJson:AtlasData = JSON.parse(jsonData)
  const spriteKey = icon.spriteName + '.png'
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

export function getBackgroundFromAtlas(icon:Icon): UiBackgroundProps { 
  const textureMode = 'stretch'
  const uvs = getUvs(icon)
  const texture = {src:`scene/assets/images/atlas/${icon.atlasName}.png`}

  return {
    textureMode,
    uvs,
    texture
  }
}









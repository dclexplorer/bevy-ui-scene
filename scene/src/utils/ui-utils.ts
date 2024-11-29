import { type Coords } from '@dcl/sdk/ecs'
import { type Icon, type AtlasData, type Sprite } from './definitions'
import { type UiBackgroundProps } from '@dcl/react-ecs'
import { backpackJson } from '../json/backpack-data'
import { navbarJson } from '../json/navbar-data'
import { iconsJson } from '../json/icons-data'
import { contextJson } from '../json/context-data'
import { toggleJson } from '../json/toggle-data'
import { backgroundsJson } from '../json/backgrounds-data'
import { profileJson } from '../json/profile-data'

export function getUvs(icon: Icon): number[] {
  let parsedJson: AtlasData | undefined
  switch (icon.atlasName) {
    case 'profile':
      parsedJson = profileJson
      break
    case 'backgrounds':
      parsedJson = backgroundsJson
      break
    case 'backpack':
      parsedJson = backpackJson
      break
    case 'navbar':
      parsedJson = navbarJson
      break
    case 'icons':
      parsedJson = iconsJson
      break
    case 'context':
      parsedJson = contextJson
      break
    case 'toggles':
      parsedJson = toggleJson
      break
  }
  if (parsedJson !== undefined) {
    const spriteKey = icon.spriteName + '.png'
    if (Object.prototype.hasOwnProperty.call(parsedJson.frames, spriteKey)) {
      const sprite: Sprite = parsedJson.frames[spriteKey]
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
  } else {
    return []
  }
  return []
}

export function getBackgroundFromAtlas(icon: Icon): UiBackgroundProps {
  const textureMode = 'stretch'
  const uvs = getUvs(icon)
  const texture = { src: `assets/images/atlas/${icon.atlasName}.png` }
  return {
    textureMode,
    uvs,
    texture
  }
}

export function isValidURL(url: string): boolean {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  return urlRegex.test(url)
}
export function isValidDate(date: string): boolean {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return dateRegex.test(date);
}


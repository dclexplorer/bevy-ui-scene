import { type Coords } from '@dcl/sdk/ecs'
import { type AtlasIcon, type AtlasData, type Sprite } from './definitions'
import { type UiBackgroundProps } from '@dcl/react-ecs'
import { backpackJson } from '../json/backpack-data'
import { navbarJson } from '../json/navbar-data'
import { iconsJson } from '../json/icons-data'
import { contextJson } from '../json/context-data'
import { toggleJson } from '../json/toggle-data'
import { profileJson } from '../json/profile-data'
import { voiceChatJson } from '../json/voice-chat-data'
import { getPlayer } from '@dcl/sdk/src/players'
import { mapJson } from '../json/map-data'

export function getUvs(icon: AtlasIcon): number[] {
  let parsedJson: AtlasData | undefined
  switch (icon.atlasName) {
    case 'profile':
      parsedJson = profileJson
      break
    case 'map':
      parsedJson = mapJson
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
    case 'voice-chat':
      parsedJson = voiceChatJson
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

export function getBackgroundFromAtlas(icon: AtlasIcon): UiBackgroundProps {
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
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
  return dateRegex.test(date)
}

export function truncateWithoutBreakingWords(
  str: string,
  maxLength: number
): string {
  if (str.length <= maxLength) {
    return str
  }

  let truncated = str.slice(0, maxLength)

  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > 0) {
    truncated = truncated.slice(0, lastSpace)
  }

  return truncated + '...'
}

export function getName(id: string): string {
  const player = getPlayer({ userId: id })
  const playerName = player?.avatar?.name ?? 'Name'
  return playerName
}

export function sliderValueToPercentage(
  value: number,
  min: number,
  max: number,
  continuos: boolean = false
): number {
  const percentage = 1 - (value - min) / (max - min)
  // to float32
  const float32Percentage = Float32Array.from([percentage])[0]
  return float32Percentage
}

export function sliderPercentageToValue(
  perc: number,
  min: number,
  max: number,
  continuos: boolean = false
): number {
  const value = min + (1 - perc) * (max - min)
  if (!continuos) {
    return Math.round(value)
  } else {
    return value
  }
}

export function formatEventTime(timestampInSecs: number): string {
  const now = new Date()
  const eventDate = new Date(timestampInSecs * 1000) // convert to miliseconds

  if (eventDate > now) {
    // Format: MON, 24 JUL AT 02:00PM
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC'
    ]
    const day = days[eventDate.getUTCDay()]
    const date = eventDate.getUTCDate()
    const month = months[eventDate.getUTCMonth()]
    const hours = eventDate.getUTCHours()
    const minutes = eventDate.getUTCMinutes()
    const formattedTime = `${isNaN(hours % 12) ? 12 : hours % 12}:${minutes
      .toString()
      .padStart(2, '0')}${hours >= 12 ? 'PM' : 'AM'}`
    return `${day}, ${date} ${month} AT ${formattedTime}`
  } else {
    // Calcular diferencia
    const diff = Math.abs(now.getTime() - eventDate.getTime()) // Diferencia en milisegundos
    const minutesDiff = Math.floor(diff / (1000 * 60))
    const hoursDiff = Math.floor(minutesDiff / 60)

    if (hoursDiff > 0) {
      return `Event started ${hoursDiff} hours ago.`
    } else {
      return `Event started ${minutesDiff} minutes ago.`
    }
  }
}

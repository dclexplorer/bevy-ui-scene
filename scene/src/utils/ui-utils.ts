import { type Coords } from '@dcl/sdk/ecs'
import type { AtlasIcon, AtlasData, Sprite, FormattedURN } from './definitions'
import { type UiBackgroundProps } from '@dcl/react-ecs'
import backpackJson from '../../assets/images/atlas/backpack.json'
import { navbarJson } from '../json/navbar-data'
import { iconsJson } from '../json/icons-data'
import { contextJson } from '../json/context-data'
import { toggleJson } from '../json/toggle-data'
import { profileJson } from '../json/profile-data'
import { voiceChatJson } from '../json/voice-chat-data'
import { getPlayer } from '@dcl/sdk/src/players'
import { mapJson } from '../json/map-data'
import { socialJson } from '../json/social-data'
import infoPanelJson from '../../assets/images/atlas/info-panel.json'
import emotesJson from '../../assets/images/atlas/emotes.json'
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
      parsedJson = backpackJson as AtlasData
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
    case 'social':
      parsedJson = socialJson
      break
    case 'info-panel':
      parsedJson = infoPanelJson as AtlasData
      break
    case 'emotes':
      parsedJson = emotesJson as AtlasData
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

export function formatEventTime(
  startTimestamp: number,
  endTimestamp: number
): string {
  const now = new Date()
  const eventStart = new Date(startTimestamp)
  const eventEnd = new Date(endTimestamp)

  if (eventStart > now) {
    // Format: MON, 24 JUL AT 02:00PM
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    const day = days[eventStart.getUTCDay()]
    const date = eventStart.getUTCDate()
    const month = months[eventStart.getUTCMonth()]
    const year = eventStart.getUTCFullYear()
    const hours = eventStart.getUTCHours()
    const minutes = eventStart.getUTCMinutes()
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`

    return `${day}, ${date} ${month} ${year} ${formattedTime} GMT`
  } else if (eventEnd > now) {
    const diff = Math.abs(now.getTime() - eventStart.getTime())
    const minutesDiff = Math.floor(diff / (1000 * 60))
    const hoursDiff = Math.floor(minutesDiff / 60)
    const daysDiff = Math.floor(hoursDiff / 24)

    if (daysDiff > 0) {
      if (daysDiff === 1) {
        return `Event started ${daysDiff} day ago.`
      } else {
        return `Event started ${daysDiff} days ago.`
      }
    } else if (hoursDiff > 0) {
      if (hoursDiff === 1) {
        return `Event started ${hoursDiff} hour ago.`
      } else {
        return `Event started ${hoursDiff} hours ago.`
      }
    } else {
      if (hoursDiff === 1) {
        return `Event started ${minutesDiff} minute ago.`
      } else {
        return `Event started ${minutesDiff} minutes ago.`
      }
    }
  } else {
    return `Event is over.`
  }
}

export function getTimestamp(dateString: string): number {
  const date = new Date(dateString)
  return date.getTime()
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(+timestamp * 1000)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const daySuffix = (() => {
    if (day % 10 === 1 && day !== 11) return 'st'
    if (day % 10 === 2 && day !== 12) return 'nd'
    if (day % 10 === 3 && day !== 13) return 'rd'
    return 'th'
  })()

  return `${month} ${day}${daySuffix} ${year}`
}

export function formatURN(urn: string): FormattedURN | undefined {
  const parts = urn.split(':')

  if (parts.length >= 5) {
    const version = parts[3]
    const contractAddress = parts[4]
    const itemId = parts[5]

    return { contractAddress, itemId, version }
  } else {
    console.error('Invalid URN format')
    return undefined
  }
}

export function rgbToHsv(
  r: number = 0,
  g: number = 0,
  b: number = 0
): { h: number; s: number; v: number } {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6
    } else if (max === g) {
      h = (b - r) / delta + 2
    } else {
      h = (r - g) / delta + 4
    }
    h *= 60
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : (delta / max) * 360
  const v = max * 360

  return { h: 360 - h, s, v }
}

export function hsvToRgb(
  h: number = 0,
  s: number = 0,
  v: number = 0
): { r: number; g: number; b: number } {
  const invertedH = 360 - (h % 360)
  const normS = s / 360
  const normV = v / 360

  const c = normV * normS
  const x = c * (1 - Math.abs(((invertedH / 60) % 2) - 1))
  const m = normV - c

  let r = 0
  let g = 0
  let b = 0

  if (invertedH >= 0 && invertedH < 60) {
    r = c
    g = x
  } else if (invertedH >= 60 && invertedH < 120) {
    r = x
    g = c
  } else if (invertedH >= 120 && invertedH < 180) {
    g = c
    b = x
  } else if (invertedH >= 180 && invertedH < 240) {
    g = x
    b = c
  } else if (invertedH >= 240 && invertedH < 300) {
    r = x
    b = c
  } else if (invertedH >= 300 && invertedH < 360) {
    r = c
    b = x
  }

  return { r: r + m, g: g + m, b: b + m }
}

export function rgbToArray(
  rgb: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 }
): number[] {
  return [rgb.r, rgb.g, rgb.b]
}

export function parseCoordinates(
  input: string
): { x: number; y: number } | null {
  const parts = input.split(',').map((part) => parseFloat(part.trim()))

  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { x: parts[0], y: parts[1] }
  }

  return null
}

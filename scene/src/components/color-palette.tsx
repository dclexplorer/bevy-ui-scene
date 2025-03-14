import { Color4 } from '@dcl/sdk/math'
import { type RarityName } from '../utils/wearables-definitions'

const ACTIVE_BACKGROUND_COLOR = Color4.fromHexString('#FF7538')
const ACTIVE_COLOR = Color4.fromHexString('#FFFFFF')
const LINK_COLOR = Color4.fromHexString('#E9315BFF')

export const COLOR_PRESETS = [
  Color4.fromHexString('#D8D8D8FF'),
  Color4.fromHexString('#2a221e'),
  Color4.fromHexString('#5b4637'),
  Color4.fromHexString('#964a2f'),
  Color4.fromHexString('#d97c13'),
  Color4.fromHexString('#eed07b'),
  Color4.fromHexString('#f0870e'),
  Color4.fromHexString('#fdd240'),
  Color4.fromHexString('#78bd31'),
  Color4.fromHexString('#59a2f7'),
  Color4.fromHexString('#9878ed'),
  Color4.fromHexString('#e875a9')
]

export const COLOR = {
  ACTIVE_COLOR,
  LINK_COLOR,
  ACTIVE_BACKGROUND_COLOR,
  MAIN_MENU_BACKGROUND: Color4.fromHexString('#161518'),
  NAV_BUTTON_ACTIVE_BACKGROUND: ACTIVE_BACKGROUND_COLOR,
  NAV_BUTTON_ACTIVE_COLOR: ACTIVE_COLOR,
  NAV_BUTTON_INACTIVE_BACKGROUND: Color4.fromHexString('#FFFFFF'),
  NAV_BUTTON_INACTIVE_COLOR: Color4.fromHexString('#000000'),
  SMALL_TAG_BACKGROUND: Color4.fromHexString('#00000066'),
  TEXT_COLOR: Color4.fromHexString('#2B272AFF')
}
export const RARITY_COLORS: Record<RarityName, Color4> = {
  base: Color4.fromHexString('#a09ba8'),
  common: Color4.fromHexString('#73d3d3'),
  uncommon: Color4.fromHexString('#ff8362'),
  rare: Color4.fromHexString('#34ce76'),
  epic: Color4.fromHexString('#438fff'),
  legendary: Color4.fromHexString('#a14bf3'),
  exotic: Color4.fromHexString('#a2de23'),
  mythic: Color4.fromHexString('#ff4bed'),
  unique: Color4.fromHexString('#fea217')
}

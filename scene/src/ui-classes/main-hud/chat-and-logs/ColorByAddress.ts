import { type RGBColor } from '../../../bevy-api/interface'
import USER_NAME_COLORS from './UserNameColors.json'
import { RandomSeed } from './random-seed'
import { ZERO_ADDRESS } from '../../../utils/constants'

const addressColors = new Map<string, RGBColor>()

export function getAddressColor(address: string): RGBColor {
  if (address === ZERO_ADDRESS) return { r: 0.6, g: 0.6, b: 0.6 }
  if (addressColors.has(address)) return addressColors.get(address) as RGBColor

  const randomGenerator = new RandomSeed(address)
  const addressColor =
    USER_NAME_COLORS[randomGenerator.next(0, USER_NAME_COLORS.length - 1)]
  addressColors.set(address, addressColor)
  return addressColor
}

import { type RGBColor } from '../../../bevy-api/interface'
import USER_NAME_COLORS from './UserNameColors.json'
import { RandomSeed } from './random-seed'

const addressColors = new Map<string, RGBColor>()

export function getAddressColor(address: string): RGBColor {
  if (addressColors.has(address)) return addressColors.get(address) as RGBColor
  const randomGenerator = new RandomSeed(address)
  const addressColor =
    USER_NAME_COLORS[randomGenerator.next(0, USER_NAME_COLORS.length - 1)]
  addressColors.set(address, addressColor)
  return addressColor
}

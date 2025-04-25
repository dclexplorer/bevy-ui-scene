import { timers } from '@dcl-sdk/utils'
import { getWaitFor } from './function-utils'

export const sleep = async (delay: number): Promise<any> =>
  await new Promise((resolve) => timers.setTimeout(resolve as any, delay))

export const waitFor = getWaitFor(sleep)

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number = 1000
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof timers.setTimeout>

  return (...args: Parameters<T>) => {
    timers.clearTimeout(timeoutId)
    timeoutId = timers.setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export function throttle<T extends (...args: any[]) => void>(
  f: T,
  w: number = 300
): (...args: Parameters<T>) => void {
  let lastCallDate: any = null
  return function (...args: any[]) {
    if (!lastCallDate) lastCallDate = Date.now()
    if (Date.now() > lastCallDate + w) {
      lastCallDate = Date.now()
      timers.setTimeout(() => {
        f(...args)
      }, w)
    }
  }
}

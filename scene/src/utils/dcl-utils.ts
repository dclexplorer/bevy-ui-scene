import { timers } from '@dcl-sdk/utils'
import { getWaitFor } from './function-utils'

export const sleep = async (delay: number): Promise<any> =>
  await new Promise((resolve) => timers.setTimeout(resolve as any, delay))

export const waitFor = getWaitFor(sleep)

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  // TODO timers.setTimeout or timers.clearTimeout seems buggy using wait time > 40ms
  let timeout: ReturnType<typeof timers.setTimeout> | null = null

  return function (...args: Parameters<T>) {
    if (timeout === null) {
      func(args)
    }
    timers.clearTimeout(timeout as number)
    timeout = timers.setTimeout(() => {
      timeout = null
    }, wait)
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

import { timers } from '@dcl-sdk/utils'
import { getWaitFor } from './function-utils'
import { type ComponentDefinition, engine } from '@dcl/sdk/ecs'

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

export function filterEntitiesWith(
  check: (params: Array<typeof engine.getEntitiesWith>) => boolean,
  ...components: Array<ComponentDefinition<any>>
): Array<Array<typeof engine.getEntitiesWith>> {
  const result: Array<Array<typeof engine.getEntitiesWith>> = []
  try {
    for (const [entity, ...properties] of engine.getEntitiesWith(
      ...(components as any)
    )) {
      result.push([entity, ...properties])
    }
  } catch (error) {}

  return result.filter(check)
}

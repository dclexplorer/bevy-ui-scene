export function noop(): void {}

export function memoize<T, U>(fn: (arg: T) => U): (arg: T) => U {
  const cache = new Map<T, U>()

  return function (arg: T): U {
    const cachedResult = cache.get(arg)
    if (cachedResult !== undefined) {
      return cachedResult
    }

    const result = fn(arg)
    cache.clear()
    cache.set(arg, result)
    return result
  }
}

export function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export const getWaitFor =
  (sleep: (ms: number) => Promise<any>) =>
  async (conditionFn: () => boolean, timeInterval = 100, timeout = 0) => {
    const started = Date.now()
    while (!conditionFn()) {
      if (timeout && Date.now() - started >= timeout) {
        console.log(
          `warning: reached timeout waiting for ${conditionFn.toString()}`
        )
        return
      }
      await sleep(timeInterval)
    }
  }

export function isNull(value: any | null): boolean {
  return value === null
}
export function isFalsy(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    value === false ||
    value === 0 ||
    value === '' ||
    isNaN(value)
  )
}
export function isTruthy(value: any): boolean {
  return !!value
}

type MediatorCallback<T extends any[] = any[]> = (...args: T) => void
type Mediator = {
  subscribe: <T extends any[]>(channel: string, fn: MediatorCallback<T>) => void
  unsubscribe: <T extends any[]>(
    channel: string,
    fn: MediatorCallback<T>
  ) => void
  publish: <T extends any[]>(channel: string, ...args: T) => void
}

export function createMediator(): Mediator {
  const channels = new Map<string, Set<MediatorCallback>>()

  return {
    subscribe: <T extends any[]>(channel: string, fn: MediatorCallback<T>) => {
      let subscribers = channels.get(channel)
      if (!subscribers) {
        subscribers = new Set()
        channels.set(channel, subscribers)
      }
      subscribers.add(fn as MediatorCallback)
    },

    unsubscribe: <T extends any[]>(
      channel: string,
      fn: MediatorCallback<T>
    ) => {
      channels.get(channel)?.delete(fn as MediatorCallback)
    },

    publish: <T extends any[]>(channel: string, ...args: T) => {
      channels.get(channel)?.forEach((fn) => {
        fn(...args)
      })
    }
  }
}

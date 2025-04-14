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
  async (conditionFn: () => boolean, timeInterval = 100) => {
    while (!conditionFn()) {
      await sleep(timeInterval)
    }
  }

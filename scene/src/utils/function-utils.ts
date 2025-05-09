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

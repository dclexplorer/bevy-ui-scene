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

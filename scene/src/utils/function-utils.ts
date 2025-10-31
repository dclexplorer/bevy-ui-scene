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

export function memoizeFirstArg<T, U>(
  fn: (...args: any[]) => U
): (...args: any[]) => U | undefined {
  const cache = new Map<T, U>()

  return function (...args: any[]): U | undefined {
    const key = args[0] as T

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.clear() // sigues manteniendo solo un valor en cache
    cache.set(key, result)

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
    value === ''
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

export const compose = <T>(
  fn1: (a: T) => T,
  ...fns: Array<(a: T) => T>
): ((a: T) => T) =>
  fns.reduce<(a: T) => T>(
    (prevFn, nextFn) =>
      (value: T): T =>
        prevFn(nextFn(value)),
    fn1
  )

type Id = PropertyKey // string | number | symbol
type WithId<K extends Id = Id> = { id: K }

export function dedupeById<T extends WithId<K>, K extends Id = Id>(
  arr: readonly T[],
  mode: 'keep-first' | 'keep-last' | 'only-unique' = 'keep-first'
): T[] {
  if (mode === 'keep-first') {
    const seen = new Set<K>()
    return arr.filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  }

  if (mode === 'keep-last') {
    const seen = new Set<K>()
    const out: T[] = []
    // Recorremos de derecha a izquierda para mantener la última aparición
    for (let i = arr.length - 1; i >= 0; i--) {
      const it = arr[i]
      if (!seen.has(it.id)) {
        seen.add(it.id)
        out.push(it)
      }
    }
    return out.reverse()
  }

  // mode === 'only-unique'
  const counts = new Map<K, number>()
  for (const it of arr) counts.set(it.id, (counts.get(it.id) ?? 0) + 1)
  return arr.filter((it) => counts.get(it.id) === 1)
}

export function setIfNot(map: Map<any, any>): { get: (key: any) => any } {
  return {
    get: (key: any) => {
      if (!map.has(key)) {
        map.set(key, {})
      }
      return map.get(key)
    }
  }
}

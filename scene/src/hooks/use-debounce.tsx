import { ReactEcs } from '@dcl/react-ecs'
import useEffect = ReactEcs.useEffect
import useState = ReactEcs.useState
import { timers } from '@dcl-sdk/utils'

export function useDebounce(value: any, delay: number = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = timers.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      timers.clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

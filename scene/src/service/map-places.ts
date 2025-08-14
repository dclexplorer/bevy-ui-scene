import { Coords } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const state: {
  places: Record<string, any>
  totalPlaces: number
  done: boolean
} = {
  done: false,
  places: {},
  totalPlaces: Number.MAX_SAFE_INTEGER
}

export type Place = {
  id: string
  title: string
  positions: string[] // e.g., ["-97,-95","-98,-95"]
  base_position: string
  [key: string]: any
}

export const getPlacesAroundParcel = (parcel: Coords, parcelRadius: number) => {
  const radiusSq = parcelRadius * parcelRadius

  return Object.values(getLoadedMapPlaces()).filter((place: Place) => {
    return (
      place.positions?.length ? place.positions : [place.base_position]
    ).some((pos) => {
      const [x, y] = pos.split(',').map(Number)
      const dx = x - parcel.x
      const dy = y - parcel.y
      return dx * dx + dy * dy <= radiusSq
    })
  })
}

export const getPlacesBetween = (coords1: Coords, coords2: Coords): Place[] => {
  return Object.keys(state.places)
    .filter((placeKey) => {
      const place = state.places[placeKey]
      const [x, y] = place.base_position.split(',')
      if (
        x >= coords1.x &&
        x <= coords2.x &&
        y >= coords1.y &&
        y <= coords2.y
      ) {
        return true
      }
    })
    .map((placeKey) => state.places[placeKey])
}

export const getLoadedMapPlaces = (): Record<string, Place> => state.places

export const fromParcelCoordsToPosition = (
  { x, y }: Coords,
  options?: { parcelSize?: number; height?: number }
): { x: number; y: number; z: number } => {
  const size = options?.parcelSize ?? 16 // metros por parcela
  const height = options?.height ?? 190 // Y fija (altura)

  return Vector3.create(x * size + size / 2, height, y * size + size / 2)
}

export const loadCompleteMapPlaces = async () => {
  let offset = 0
  const LIMIT = 500
  if (state.done) return state.places

  while (Object.keys(state.places).length < state.totalPlaces) {
    // TODO set ENV zone, org, etc.
    const response = await fetch(
      `https://places.decentraland.org/api/places?offset=${offset}&limit=${LIMIT}&categories=poi`
    ).then((r) => r.json())
    const { data, ok, total } = response
    state.totalPlaces = total
    state.places = { ...state.places, ...data }
    offset += 500
  }
  console.log(
    'Object.keys(state.places).length',
    Object.keys(state.places).length
  )
  console.log(
    'found genesis',
    Object.values(state.places).find((p) => p.title.includes('Genesis'))
  )
  state.done = true

  return state.places
}
export function fromStringToCoords(str: string) {
  const [x, y] = str.split(',').map((n) => Number(n))
  return { x, y }
}

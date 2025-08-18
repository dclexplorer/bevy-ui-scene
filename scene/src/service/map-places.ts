import { type Coords } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { getRealm } from '~system/Runtime'

export type Place = {
  id: string
  title: string
  positions: string[] // e.g., ["-97,-95","-98,-95"]
  base_position: string
  [key: string]: any
}

const state: {
  places: Record<string, Place>
  totalPlaces: number
  done: boolean
} = {
  done: false,
  places: {},
  totalPlaces: Number.MAX_SAFE_INTEGER
}

export const getPlacesAroundParcel = (
  parcel: Coords,
  parcelRadius: number
): Place[] => {
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
      const [x, y] = place.base_position.split(',').map((n) => Number(n))
      if (
        x >= coords1.x &&
        x <= coords2.x &&
        y >= coords1.y &&
        y <= coords2.y
      ) {
        return true
      }
      return false
    })
    .map((placeKey) => state.places[placeKey])
}

export const getLoadedMapPlaces = (): Record<string, Place> => state.places

export const fromParcelCoordsToPosition = (
  { x, y }: Coords,
  options?: { parcelSize?: number; height?: number }
): { x: number; y: number; z: number } => {
  const size = options?.parcelSize ?? 16 // metros por parcela
  const height = options?.height ?? 200 // Y fija (altura)

  return Vector3.create(x * size + size / 2, height, y * size + size / 2)
}

export const loadCompleteMapPlaces = async (): Promise<
  Record<string, Place>
> => {
  let offset = 0
  const LIMIT = 500
  if (state.done) return state.places
  const realm = await getRealm({})
  const realmBaseUrl = realm?.realmInfo?.baseUrl ?? ''
  const isZone = realmBaseUrl.includes('.zone')
  if (realm.realmInfo?.realmName.endsWith('.eth')) {
    return state.places
  }
  while (Object.keys(state.places).length < state.totalPlaces) {
    const response = await fetch(
      `https://places.decentraland.${
        isZone ? 'zone' : 'org'
      }/api/places?offset=${offset}&limit=${LIMIT}&categories=poi`
    ).then(async (r) => await r.json())
    const { data, total } = response
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
export function fromStringToCoords(str: string): Coords {
  const [x, y] = str.split(',').map((n) => Number(n))
  return { x, y }
}

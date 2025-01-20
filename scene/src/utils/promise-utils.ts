// import { getPlayer } from '@dcl/sdk/src/players'
import type { PhotoFromApi } from 'src/ui-classes/photos/Photos.types'
import type {
  EventFromApi,
  PlaceFromApi
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
// import { getRealm } from '~system/Runtime'
// import { signedFetch } from '~system/SignedFetch'

type EventsResponse = {
  ok: boolean
  data: EventFromApi[]
}

type PlacesResponse = {
  ok: boolean
  total: number
  data: PlaceFromApi[]
}

type PhotosResponse = {
  images: PhotoFromApi[]
  maxImages: number
}

export async function fetchEvents(coords: string[]): Promise<EventFromApi[]> {
  const param = coords.map(coord => `positions[]=${coord}`).join('&')
  try {
    const response: Response = await fetch(
      `https://events.decentraland.org/api/events/?${param}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const events: EventsResponse = (await response.json()) as EventsResponse
    console.log('EVENTOS CARGADOS')
    return events.data
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

export async function fetchPhotos(placeId: string, limit:number ): Promise<PhotoFromApi[]> {
  try {
    const response: Response = await fetch(
      `https://camera-reel-service.decentraland.org/api/places/${placeId}/images?limit=${limit}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const photos: PhotosResponse = (await response.json()) as PhotosResponse
    return photos.images
  } catch (error) {
    console.error('Error fetching photos:', error)
    throw error
  }
}

export async function fetchPhotosQuantity(placeId: string): Promise<number> {
  try {
    const response: Response = await fetch(
      `https://camera-reel-service.decentraland.org/api/places/${placeId}/images`
    )
    if (!response.ok) {
      return 20
    }
    const photos: PhotosResponse = (await response.json()) as PhotosResponse
    return photos.maxImages
  } catch (error) {
    console.error('Error fetching photos:', error)
    return 20
  }
}

export async function fetchPlaceId(
  x: number,
  y: number
): Promise<PlaceFromApi> {
  try {
    const response: Response = await fetch(
      `https://places.decentraland.org/api/places/?positions=${x + ',' + y}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const place: PlacesResponse = (await response.json()) as PlacesResponse
    return place.data[0]
  } catch (error) {
    console.error('Error fetching place:', error)
    throw error
  }
}

// export async function main(): Promise<void> {
//   const user = getPlayer()
//   const realm = await getRealm({})
//   if (user?.userId === null || realm?.baseUrl === null) return
//   const response = await signedFetch({
//     url: 'https://rewards.decentraland.org/api/rewards',
//     init: {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         campaign_key: '[DISPENSER_KEY]',
//         beneficiary: user.userId,
//         catalyst: realm.baseUrl,
//       }),
//     },
//   })

//   if (!response || !response.body) {
//     throw new Error('Invalid response')
//   }
//   let json = await JSON.parse(response.body)
// }
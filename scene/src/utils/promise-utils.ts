// import { getPlayer } from '@dcl/sdk/src/players'
import type {
  PhotoFromApi,
  PhotoMetadataResponse,
  WearableData,
  WearableResponse
} from 'src/ui-classes/photos/Photos.types'
import type {
  EventFromApi,
  PlaceFromApi
} from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
import { EMPTY_PHOTO_METADATA, EMPTY_WEARABLE_DATA } from './constants'
import { formatURN } from './ui-utils'
import { signedFetch } from '~system/SignedFetch'

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
  const param = coords.map((coord) => `positions[]=${coord}`).join('&')
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

export async function fetchPhotos(
  placeId: string,
  limit: number
): Promise<PhotoFromApi[]> {
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

export async function fetchPhotoMetadata(
  photoId: string
): Promise<PhotoMetadataResponse> {
  try {
    const response: Response = await fetch(
      `https://camera-reel-service.decentraland.org/api/images/${photoId}/metadata`
    )
    if (!response.ok) {
      return EMPTY_PHOTO_METADATA
    }

    const photoMetadata: PhotoMetadataResponse =
      (await response.json()) as PhotoMetadataResponse
    return photoMetadata
  } catch (error) {
    console.error('Error fetching photos:', error)
    return EMPTY_PHOTO_METADATA
  }
}

export async function fetchWearable(urn: string): Promise<WearableData> {
  try {
    const response: Response = await fetch(
      `https://marketplace-api.decentraland.org/v1/items?contractAddress=${
        formatURN(urn).contractAddress
      }&itemId=${formatURN(urn).itemId}`
    )
    if (!response.ok) {
      return EMPTY_WEARABLE_DATA
    }
    const wearableData: WearableResponse =
      (await response.json()) as WearableResponse

    if (wearableData.total === 0) {
      return EMPTY_WEARABLE_DATA
    }
    return wearableData.data[0]
  } catch (error) {
    console.error('Error fetching photos:', error)
    return EMPTY_WEARABLE_DATA
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

export type PatchFavoritesResponse = {
  ok: boolean
  data: {
    favorites: number
    user_favorite: boolean
  }
}

export async function updateFavoriteStatus(
  placeId: string,
  isFavorite: boolean
): Promise<PatchFavoritesResponse> {
  const url = `https://places.decentraland.org/places/${placeId}/favorites?favorites=${isFavorite}`

  try {
    const response = await signedFetch({
      url,
      init: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    })

    if (response.ok === false) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data: PatchFavoritesResponse = JSON.parse(response.body)
    console.log('LOGGED DATA:', { data })
    return data
  } catch (error) {
    console.error('Error updating favorite status:', error)
    throw new Error('Failed to update favorite status')
  }
}

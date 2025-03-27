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
import { CATALYST_BASE_URL_FALLBACK, EMPTY_PHOTO_METADATA } from './constants'
import type { FormattedURN } from './definitions'
import { BevyApi } from 'src/bevy-api'
import type { KernelFetchRespose } from 'src/bevy-api/interface'
import { getRealm } from '~system/Runtime'

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

export async function fetchWearable(
  urn: FormattedURN
): Promise<WearableData | null> {
  try {
    console.log(
      'FETCHING WEARABLE contractAddress = ',
      urn.contractAddress,
      ' - ItemId = ',
      urn.itemId
    )
    const response: Response = await fetch(
      `https://marketplace-api.decentraland.org/v1/items?contractAddress=${urn.contractAddress}&itemId=${urn.itemId}`
    )
    if (!response.ok) {
      return null
    }
    const wearableData: WearableResponse =
      (await response.json()) as WearableResponse

    if (wearableData.total === 0) {
      return null
    }
    console.log({ wearableData })
    return wearableData.data[0]
  } catch (error) {
    console.error('Error fetching photos:', error)
    return null
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
): Promise<KernelFetchRespose> {
  const url = `https://places.decentraland.org/api/places/${placeId}/favorites`

  const patchData = {
    favorites: isFavorite
  }

  try {
    const response = await BevyApi.kernelFetch({
      url,
      init: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
      }
    })
    return response
  } catch (error) {
    console.error('Error updating favorite status:', error)
    throw new Error('Failed to update favorite status')
  }
}

export async function fetchJsonOrTryFallback(URL: string): Promise<any> {
  const realmBaseURL =
    (await getRealm({})).realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
  try {
    return await (await fetch(URL)).json()
  } catch (error) {
    return await (
      await fetch(URL.replace(realmBaseURL, CATALYST_BASE_URL_FALLBACK))
    ).json()
  }
}

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
import { EMPTY_PHOTO_METADATA } from './constants'
import type { FormattedURN } from './definitions'
import { BevyApi } from 'src/bevy-api'
import type { KernelFetchRespose } from 'src/bevy-api/interface'
import { type Vector3 } from '@dcl/ecs-math'
import { store } from 'src/state/store'
import { cleanFavToSend, cleanLikeToSend } from 'src/state/sceneInfo/actions'

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

export async function fetchPlaceFromCoords(
  coords: Vector3
): Promise<PlaceFromApi> {
  try {
    const response: Response = await fetch(
      `https://places.decentraland.org/api/places/?positions=${
        coords.x + ',' + coords.z
      }`
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

export async function updateFavoriteStatus(): Promise<void> {
  const favStatus = store.getState().scene.sceneInfoCardFavToSend
  if (favStatus === undefined) return

  const url = `https://places.decentraland.org/api/places/${favStatus.placeId}/favorites`
  const patchData = {
    favorites: favStatus.isFav
  }

  try {
    await BevyApi.kernelFetch({
      url,
      init: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
      }
    })
    store.dispatch(cleanFavToSend(undefined))
  } catch (error) {
    console.error('Error updating favorite status:', error)
    throw new Error('Failed to update favorite status')
  }
}

export async function updateLikeStatus(): Promise<void> {
  const likeStatus = store.getState().scene.sceneInfoCardLikeToSend
  if (likeStatus === undefined) return

  let arg: boolean | null
  switch (likeStatus.isLiked) {
    case 'like':
      arg = true
      break
    case 'dislike':
      arg = false
      break
    default:
      arg = null
      break
  }

  const url = `https://places.decentraland.org/api/places/${likeStatus.placeId}/likes`
  const patchData = {
    like: arg
  }

  try {
    await BevyApi.kernelFetch({
      url,
      init: {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
      }
    })
    store.dispatch(cleanLikeToSend(undefined))
  } catch (error) {
    console.error('Error updating like status:', error)
    throw new Error('Failed to update like status')
  }
}

export async function getFavoritesFromApi(): Promise<PlaceFromApi[]> {
  const responseFavs: KernelFetchRespose = await BevyApi.kernelFetch({
    url: `https://places.decentraland.org/api/places?only_favorites=true&with_realms_detail=true`
  })
  if (!responseFavs.ok) {
    throw new Error(`HTTP error! Status: ${responseFavs.status}`)
  }
  const favs = JSON.parse(responseFavs.body)
  return favs.data
}

export async function getPlaceFromApi(id: string): Promise<PlaceFromApi> {
  const responsePlace: KernelFetchRespose = await BevyApi.kernelFetch({
    url: `https://places.decentraland.org/api/places/${id}`
  })
  if (!responsePlace.ok) {
    throw new Error(`HTTP error! Status: ${responsePlace.status}`)
  }
  const place = JSON.parse(responsePlace.body)
  return place.data
}

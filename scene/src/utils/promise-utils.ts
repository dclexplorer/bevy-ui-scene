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
import type {FormattedURN, URN} from './definitions'
import { BevyApi } from 'src/bevy-api'
import type { KernelFetchRespose } from 'src/bevy-api/interface'
import type {WearableCategory} from "../service/wearable-categories";
import type {CatalystWearable, CatalystWearableMap} from "./wearables-definitions";

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

export type WearablesPageResponse = any;
type WearableCatalogPageParams = {
  pageNum: number
  pageSize: number
  address: string
  wearableCategory: WearableCategory | null
  includeBase: boolean
  includeOnChain: boolean
}

export async function fetchWearablesPage({pageNum, pageSize, wearableCategory, address}:any):Promise<WearablesPageResponse>{
  try {
    const wearableCatalogPageURL = getWearableCatalogPageURL({
      pageNum,
      pageSize,
      address,
      wearableCategory,
      includeBase: true,
      includeOnChain: true
    });
    const wearablesPageResponse:any = await fetch(wearableCatalogPageURL);

    return wearablesPageResponse.json();
  }catch(error) {
    console.error('wearablesPage Error fetching:', error)
    throw error
  }


  function getWearableCatalogPageURL({pageNum, pageSize, address, wearableCategory, includeBase, includeOnChain}:WearableCatalogPageParams):string {
    // TODO use realm BaseURL ?
    let str:string = `https://peer.decentraland.org/explorer/${address}/wearables?pageNum=${pageNum}&pageSize=${pageSize}`;
    if(wearableCategory !== null){
      str += `&category=${wearableCategory}`
    }
    if(includeBase){
      str += `&collectionType=base-wearable`
    }
    if(includeOnChain){
      str += `&collectionType=on-chain`
    }
    return str;
  }

}

export const catalystWearableMap:CatalystWearableMap = {};

export async function fetchWearablesData(...wearableURNs:URN[]):Promise<CatalystWearable[]>{
  if(wearableURNs.every((wearableURN)=>catalystWearableMap[wearableURN])){
    return wearableURNs.map(wearableURN => (catalystWearableMap[wearableURN]))
  }
  try {
    const baseURL = `https://peer.decentraland.org/lambdas/collections/wearables`;
    const url = `${baseURL}?${wearableURNs.map((urn:URN) => {
      const urnWithoutTokenId = getURNWithoutTokenId(urn)
      return `wearableId=${urnWithoutTokenId}`;
    }).join('&')}`;
    const response = await fetch(url);
    const wearables = (await response.json()).wearables;
    wearables.forEach((wearable:CatalystWearable) => {
      catalystWearableMap[wearable.id] = wearable;
    })
    return wearables;
  }catch(error) {
    console.error("fetchWearablesData error", error);
    return []
  }
}

export function getURNWithoutTokenId(urn:URN):URN{
  // TODO add unit test?
  return (urn.includes(":off-chain:") || urn.split(":").length < 6 ? urn : urn.replace(/^(.*):[^:]+$/, "$1")) as URN
}
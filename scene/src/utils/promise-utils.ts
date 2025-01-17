import type { EventFromApi, PhotoFromApi, PlaceFromApi } from 'src/ui-classes/scene-info-card/SceneInfoCard.types'

type EventsResponse = {
  ok: boolean
  data: EventFromApi[]
}

type PlacesResponse = {
  ok: boolean
  data: PlaceFromApi[]
}

type PhotosResponse = {
  ok: boolean
  data: PhotoFromApi[]
}

export async function fetchEvents(): Promise<EventFromApi[]> {
  try {
    const response: Response = await fetch(
      'https://events.decentraland.org/api/events/'
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const events: EventsResponse = (await response.json()) as EventsResponse
    console.log('Fetched events: ', events.data)
    return events.data
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

export async function fetchPhotos(placeId: string): Promise<PhotoFromApi[]> {
  try {
    const response: Response = await fetch(
      `https://camera-reel-service.decentraland.org/api/places/${placeId}/images`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const photos: PhotosResponse = (await response.json()) as PhotosResponse
    return photos.data
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

export async function fetchPlaceId(x: number, y: number): Promise<Place> {
  try {
    const response: Response = await fetch(
      `https://places.decentraland.org/api/places/?positions=${x+','+y}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  
    const place: PlacesResponse= (await response.json()) as PlacesResponse
    return place.data[0].id
  } catch (error) {
    console.error('Error fetching place:', error)
    throw error
  }
  }
  
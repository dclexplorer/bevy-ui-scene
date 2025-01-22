export type PhotoFromApi = {
  id: string
  url: string
  thumbnailUrl: string
  isPublic: boolean
  dateTime: number
}

type SceneLocation = {
  x: string
  y: string
}

export type VisiblePerson = {
  userName: string
  userAddress: string
  wearables: string[]
  isGuest: boolean
}

type SceneMetadata = {
  name: string
  location: SceneLocation
}

export type Metadata = {
  userName: string
  userAddress: string
  dateTime: string
  realm: string
  scene: SceneMetadata
  visiblePeople: VisiblePerson[]
  placeId: string
}

export type PhotoMetadataResponse = {
  id: string
  url: string
  thumbnailUrl: string
  isPublic: boolean
  metadata: Metadata
}

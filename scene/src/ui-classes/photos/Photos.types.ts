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

export type WearableResponse = {
  data: WearableData[]
  total: number
}

export type WearableData = {
  id: string
  name: string
  thumbnail: string
  url: string
  category: string
  contractAddress: string
  itemId: string
  rarity: string
  price: string
  available: string
  isOnSale: boolean
  creator: string
  tradeId: string | null
  beneficiary: string | null
  createdAt: string
  updatedAt: string
  reviewedAt: string
  soldAt: string
  data: {
    wearable: {
      bodyShapes: string[]
      category: string
      description: string
      rarity: string
      isSmart: boolean
    }
  }
  network: string
  chainId: number
  urn: string
  picks: {
    itemId: string
    count: number
  }
  utility: string | null
}

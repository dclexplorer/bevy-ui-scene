export type PlaceType =
  | 'all'
  | 'favorite' // compat
  | 'favorites'
  | 'art'
  | 'crypto'
  | 'social'
  | 'game'
  | 'shop'
  | 'education'
  | 'music'
  | 'fashion'
  | 'casino'
  | 'sports'
  | 'business'
export type FilterDefinition = {
  label: string
  spriteName: string
  id: PlaceType
}

export const MAP_FILTER_DEFINITIONS: ReadonlyArray<FilterDefinition> = [
  {
    id: 'all',
    label: 'All',
    spriteName: 'MapPins'
  },
  {
    id: 'favorites',
    label: 'Favorites',
    spriteName: 'Favourite'
  },
  {
    id: 'art',
    label: 'Art',
    spriteName: 'Art'
  },
  {
    id: 'crypto',
    label: 'Crypto',
    spriteName: 'Crypto'
  },
  {
    id: 'social',
    label: 'Social',
    spriteName: 'Social'
  },
  {
    id: 'game',
    label: 'Game',
    spriteName: 'Games'
  },
  {
    id: 'shop',
    label: 'Shop',
    spriteName: 'Shop'
  },
  {
    id: 'education',
    label: 'Education',
    spriteName: 'Education'
  },
  {
    id: 'music',
    label: 'Music',
    spriteName: 'Music'
  },
  {
    id: 'fashion',
    label: 'Fashion',
    spriteName: 'Fashion'
  },
  {
    id: 'casino',
    label: 'Casino',
    spriteName: 'Casino'
  },
  {
    id: 'sports',
    label: 'Sports',
    spriteName: 'Sports'
  },
  {
    id: 'business',
    label: 'Business',
    spriteName: 'Business'
  }
]

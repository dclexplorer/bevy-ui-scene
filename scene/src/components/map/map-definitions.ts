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
  | 'poi'
  | 'event'
  | 'parkour'
  | 'live'

export type FilterDefinition = {
  label: string
  spriteName: string | null
  id: PlaceType
}

export const MAP_FILTER_DEFINITIONS: ReadonlyArray<FilterDefinition> = [
  {
    id: 'all',
    label: 'All',
    spriteName: 'MapPins'
  },
  {
    id: 'poi',
    label: 'POIs',
    spriteName: 'POI'
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
  },
  {
    id: 'parkour',
    label: 'Parkour',
    spriteName: 'Games'
  },
  {
    id: 'live',
    label: 'Live',
    spriteName: 'Live'
  }
]

export const categories = [
  { name: 'poi', count: 57, i18n: { en: '📍 Point of Interest' } },
  { name: 'featured', count: 5, i18n: { en: '✨ Featured' } },
  { name: 'game', count: 367, i18n: { en: '🎮 Game' } },
  { name: 'casino', count: 19, i18n: { en: '♣️ Casino' } },
  { name: 'social', count: 428, i18n: { en: '👥 Social' } },
  { name: 'music', count: 274, i18n: { en: '🎵 Music' } },
  { name: 'art', count: 783, i18n: { en: '🎨 Art' } },
  { name: 'fashion', count: 79, i18n: { en: '👠 Fashion' } },
  { name: 'crypto', count: 328, i18n: { en: '🪙 Crypto' } },
  { name: 'education', count: 207, i18n: { en: '📚 Education' } },
  { name: 'shop', count: 240, i18n: { en: '🛍️ Shop' } },
  { name: 'sports', count: 31, i18n: { en: '⚽️ Sports' } },
  { name: 'business', count: 36, i18n: { en: '🏢 Business' } },
  { name: 'parkour', count: 4, i18n: { en: '🏃 Parkour' } }
]

export const mapSymbolPerPlaceCategory: Record<string, string> = {
  poi: 'PinPOI',
  art: 'PinArt',
  busness: 'PinBusiness',
  casino: 'PinCasino',
  crypto: 'PinCrypto',
  education: `PinEducation`,
  fashion: 'PinFashion',
  favourite: 'PinFavourite',
  game: 'PinGames',
  music: 'PinMusic',
  parkour: 'PinGames',
  social: 'PinSocial',
  shop: 'PinShop',
  sports: 'PinSports',
  live: 'PinLive'
}

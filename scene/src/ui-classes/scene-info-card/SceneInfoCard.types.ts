export type DclEvent = {
  id: number
  title: string
  date: number
  interestedPeople: number
  interested: boolean
}

export type EventFromApi = {
  id: string
  name: string
  image: string
  description: string
  start_at: string
  finish_at: string
  coordinates: [number, number]
  user: string
  approved: boolean
  created_at: string
  updated_at: string
  total_attendees: number
  latest_attendees: string[]
  url: string
  scene_name: string | null
  user_name: string
  rejected: boolean
  trending: boolean
  server: string | null
  estate_id: number | null
  estate_name: string | null
  x: number
  y: number
  all_day: boolean
  recurrent: boolean
  recurrent_frequency: string | null
  recurrent_weekday_mask: number | null
  recurrent_month_mask: number | null
  recurrent_interval: number | null
  recurrent_count: number | null
  recurrent_until: string | null
  duration: number | null
  recurrent_dates: string[]
  recurrent_setpos: number | null
  recurrent_monthday: number | null
  highlighted: boolean
  next_start_at: string | null
  next_finish_at: string | null
  categories: string[]
  schedules: any[] // Ajusta esto si conoces la estructura de los objetos dentro del arreglo
  approved_by: string | null
  rejected_by: string | null
  world: boolean
  attending: boolean
  position: [number, number]
  live: boolean
  [key: string]: any
}

export type CategoryFromApi =
  | 'art'
  | 'business'
  | 'casino'
  | 'crypto'
  | 'education'
  | 'fashion'
  | 'game'
  | 'music'
  | 'poi'
  | 'shop'
  | 'social'
  | 'sports'

export type PlaceFromApi = {
  id: string
  title: string
  description: string | null
  image: string
  owner: string | null
  positions: string[]
  base_position: string
  contact_name: string
  contact_email: string | null
  content_rating: string
  disabled: boolean
  disabled_at: string | null
  created_at: string
  updated_at: string
  favorites: number
  likes: number
  dislikes: number
  categories: CategoryFromApi[]
  like_rate: number | null
  highlighted: boolean
  highlighted_image: string | null
  world: boolean
  world_name: string | null
  deployed_at: string
  textsearch: string
  like_score: number | null
  user_favorite: boolean
  user_like: boolean
  user_dislike: boolean
  user_count: number
  user_visits: number
  [key: string]: any
}

export type FavPayload = { placeId: string; isFav: boolean } | undefined

export type LikePayload =
  | {
      placeId: string
      isLiked: 'like' | 'dislike' | 'null'
    }
  | undefined

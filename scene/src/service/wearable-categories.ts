export type WearableCategory =
  | 'helmet'
  | 'eyewear'
  | 'earring'
  | 'feet'
  | 'lower_body'
  | 'hat'
  | 'upper_body'
  | 'hair'
  | 'top_head'
  | 'skin'
  | 'hands_wear'
  | 'mask'
  | 'eyes'
  | 'facial_hair'
  | 'tiara'
  | 'mouth'
  | 'eyebrows'
  | 'body_shape'

type CategoryColorDefiniton = { key: string; name: string }
export const CATEGORY_COLOR_DEFINITIONS: Record<
  string,
  CategoryColorDefiniton
> = {
  hairColor: { key: 'hairColor', name: 'hair color' },
  skinColor: { key: 'skinColor', name: 'skin color' },
  eyesColor: { key: 'eyesColor', name: 'eyes color' }
}

export const WEARABLE_CATEGORY_DEFINITIONS: {
  [k in WearableCategory]: {
    id: WearableCategory
    label: string
    hasColor?: true
    baseColorKey?: string
  }
} = {
  body_shape: {
    id: 'body_shape',
    label: 'Body Shape',
    hasColor: true,
    baseColorKey: 'skinColor'
  },
  hair: { id: 'hair', label: 'Hair', baseColorKey: 'hairColor' },
  eyebrows: { id: 'eyebrows', label: 'Eyebrows', baseColorKey: 'hairColor' },
  eyes: { id: 'eyes', label: 'Eye', hasColor: true, baseColorKey: 'eyesColor' },
  mouth: { id: 'mouth', label: 'Mouth' },
  facial_hair: {
    id: 'facial_hair',
    label: 'Facial',
    baseColorKey: 'hairColor'
  },
  upper_body: { id: 'upper_body', label: 'Upper Body' },
  hands_wear: { id: 'hands_wear', label: 'Hands Wear' },
  lower_body: { id: 'lower_body', label: 'Lower Body' },
  feet: { id: 'feet', label: 'Feet' },
  hat: { id: 'hat', label: 'Hat' },
  eyewear: { id: 'eyewear', label: 'Eyewear' },
  earring: { id: 'earring', label: 'earring' },
  mask: { id: 'mask', label: 'Mask' },
  tiara: { id: 'tiara', label: 'Tiara' },
  top_head: { id: 'top_head', label: 'Top Head' },
  helmet: { id: 'helmet', label: 'Helmet' },
  skin: { id: 'skin', label: 'Skin' }
}

export function categoryHasColor(category: WearableCategory | null): boolean {
  if (!category) return false
  return !!WEARABLE_CATEGORY_DEFINITIONS[category].baseColorKey ?? false
}

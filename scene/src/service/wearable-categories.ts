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
export const WEARABLE_CATEGORY_DEFINITIONS: {
  [k in WearableCategory]: { id: WearableCategory; label: string }
} = {
  body_shape: { id: 'body_shape', label: 'Body Shape' },
  hair: { id: 'hair', label: 'Hair' },
  eyebrows: { id: 'eyebrows', label: 'Eyebrows' },
  eyes: { id: 'eyes', label: 'Eye' },
  mouth: { id: 'mouth', label: 'Mouth' },
  facial_hair: { id: 'facial_hair', label: 'Facial' },
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

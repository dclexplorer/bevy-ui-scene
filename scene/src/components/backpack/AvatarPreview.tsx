import {
  CameraLayers,
  CameraLayer,
  engine,
  TextureCamera,
  Transform,
  AvatarShape,
  type Entity,
  type Orthographic,
  type Perspective
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { getPlayer } from '@dcl/sdk/src/players'
import {
  type EquippedEmote,
  type URNWithoutTokenId
} from '../../utils/definitions'
import {
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from '../../service/categories'
import { type PBAvatarBase } from '../../bevy-api/interface'
import { getItemsWithTokenId } from '../../utils/urn-utils'
import { updateBackpackStateAction } from '../../state/backpack/actions'
import { store } from '../../state/store'

export type AvatarPreview = {
  avatarEntity: Entity
  cameraEntity: Entity
}

const CAMERA_SIZE = { WIDTH: 1600, HEIGHT: 1800 }

const avatarPreview: AvatarPreview = {
  avatarEntity: engine.RootEntity,
  cameraEntity: engine.RootEntity
}

export const getAvatarCamera: () => Entity = () => avatarPreview.cameraEntity
export const getAvatarPreviewEntity: () => Entity = () =>
  avatarPreview.avatarEntity
export const setAvatarPreviewRotation = (rotation: Quaternion): void => {
  Transform.getMutable(avatarPreview.avatarEntity).rotation = rotation
}

export type OrthographicMode = {
  $case: 'orthographic'
  orthographic: Orthographic
}
export type PerspectiveMode = {
  $case: 'perspective'
  perspective: Perspective
}
export const setAvatarPreviewZoomFactor = (zoomFactor: number): void => {
  const mode: OrthographicMode = TextureCamera.getMutable(
    avatarPreview.cameraEntity
  )?.mode as OrthographicMode

  mode.orthographic.verticalRange = zoomFactor * 10 + 10 * 0.3
}

export const getAvatarPreviewQuaternion = (): Quaternion => {
  return Transform.get(avatarPreview.avatarEntity).rotation
}

export const playPreviewEmote = (emoteURN: EquippedEmote): void => {
  store.dispatch(
    updateBackpackStateAction({
      reproducingEmotePreview: emoteURN
    })
  )
}

export const AVATAR_CAMERA_POSITION: Record<string, Vector3> = {
  BODY: Vector3.create(8, 1.8, 0),
  TOP: Vector3.create(8, 2.8, 0),
  FEET: Vector3.create(8, 1.6, 0),
  UPPER_BODY: Vector3.create(8, 2.5, 0),
  PANTS: Vector3.create(8, 1.75, 0)
}
export const AVATAR_CAMERA_ZOOM: Record<string, number> = {
  BODY: 0.28,
  TOP: 0.08,
  FEET: 0.15,
  UPPER_BODY: 0.17,
  PANTS: 0.3
}
export const CATEGORY_CAMERA: Record<string, Vector3> = {
  [WEARABLE_CATEGORY_DEFINITIONS.body_shape.id]: AVATAR_CAMERA_POSITION.BODY,
  [WEARABLE_CATEGORY_DEFINITIONS.hair.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.eyebrows.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.eyes.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.mouth.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.facial_hair.id]: AVATAR_CAMERA_POSITION.TOP,

  [WEARABLE_CATEGORY_DEFINITIONS.upper_body.id]:
    AVATAR_CAMERA_POSITION.UPPER_BODY,
  [WEARABLE_CATEGORY_DEFINITIONS.hands_wear.id]: AVATAR_CAMERA_POSITION.PANTS,
  [WEARABLE_CATEGORY_DEFINITIONS.lower_body.id]: AVATAR_CAMERA_POSITION.PANTS,
  [WEARABLE_CATEGORY_DEFINITIONS.feet.id]: AVATAR_CAMERA_POSITION.FEET,

  [WEARABLE_CATEGORY_DEFINITIONS.hat.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.eyewear.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.earring.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.mask.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.tiara.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.top_head.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.helmet.id]: AVATAR_CAMERA_POSITION.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.skin.id]: AVATAR_CAMERA_POSITION.BODY
}
export const CATEGORY_CAMERA_ZOOM: Record<string, number> = {
  [WEARABLE_CATEGORY_DEFINITIONS.body_shape.id]: AVATAR_CAMERA_ZOOM.BODY,
  [WEARABLE_CATEGORY_DEFINITIONS.hair.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.eyebrows.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.eyes.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.mouth.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.facial_hair.id]: AVATAR_CAMERA_ZOOM.TOP,

  [WEARABLE_CATEGORY_DEFINITIONS.upper_body.id]: AVATAR_CAMERA_ZOOM.UPPER_BODY,
  [WEARABLE_CATEGORY_DEFINITIONS.hands_wear.id]: AVATAR_CAMERA_ZOOM.PANTS,
  [WEARABLE_CATEGORY_DEFINITIONS.lower_body.id]: AVATAR_CAMERA_ZOOM.PANTS,
  [WEARABLE_CATEGORY_DEFINITIONS.feet.id]: AVATAR_CAMERA_ZOOM.FEET,

  [WEARABLE_CATEGORY_DEFINITIONS.hat.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.eyewear.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.earring.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.mask.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.tiara.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.top_head.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.helmet.id]: AVATAR_CAMERA_ZOOM.TOP,
  [WEARABLE_CATEGORY_DEFINITIONS.skin.id]: AVATAR_CAMERA_ZOOM.BODY
}

export const setAvatarPreviewCameraToWearableCategory = (
  category: WearableCategory | null
): void => {
  console.error('REPLACE CODE', category)

  /* Transform.getMutable(avatarPreview.cameraEntity).position =
    getCameraPositionPerCategory(category) */
}

export function updateAvatarPreview(
  wearables: URNWithoutTokenId[],
  avatarBase: PBAvatarBase,
  forceRender: WearableCategory[] = []
): void {
  const mutableAvatarShape = AvatarShape.getMutable(avatarPreview.avatarEntity)
  mutableAvatarShape.wearables = getItemsWithTokenId(wearables)
  mutableAvatarShape.bodyShape = avatarBase.bodyShapeUrn
  mutableAvatarShape.hairColor = avatarBase.hairColor
  mutableAvatarShape.eyeColor = avatarBase.eyesColor
  mutableAvatarShape.skinColor = avatarBase.skinColor
  mutableAvatarShape.forceRender = forceRender
}

export function createAvatarPreview(): boolean {
  if (avatarPreview.cameraEntity !== engine.RootEntity) return false
  const avatarEntity: Entity = (avatarPreview.avatarEntity = engine.addEntity())
  const cameraEntity = (avatarPreview.cameraEntity = engine.addEntity())
  const playerData = getPlayer()

  AvatarShape.create(avatarEntity, {
    bodyShape: playerData?.avatar?.bodyShapeUrn,
    emotes: [],
    expressionTriggerId: undefined,
    expressionTriggerTimestamp: undefined,
    eyeColor: playerData?.avatar?.eyesColor,
    hairColor: playerData?.avatar?.hairColor,
    id: playerData?.userId ?? '',
    name: undefined,
    skinColor: playerData?.avatar?.skinColor,
    talking: false,
    wearables: playerData?.wearables ?? []
  })

  CameraLayers.create(avatarEntity, {
    layers: [1]
  })
  CameraLayer.create(cameraEntity, {
    layer: 1,
    directionalLight: false,
    showAvatars: false,
    showSkybox: false,
    showFog: false,
    ambientBrightnessOverride: 5
  })

  TextureCamera.create(cameraEntity, {
    width: CAMERA_SIZE.WIDTH,
    height: CAMERA_SIZE.HEIGHT,
    layer: 1,
    clearColor: Color4.create(0.4, 0.4, 1.0, 0),
    mode: {
      $case: 'orthographic',
      orthographic: { verticalRange: 6 }
    },
    volume: 1
  })

  Transform.create(avatarEntity, {
    position: { x: 8, y: 0, z: 8 },
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    scale: { x: 2, y: 2, z: 2 }
  })

  Transform.create(cameraEntity, {
    position: AVATAR_CAMERA_POSITION.BODY,
    rotation: Quaternion.fromEulerDegrees(4, 0, 0)
  })
  return true
}

export function getCameraPositionPerCategory(
  category: WearableCategory | null
): Vector3 {
  if (category === null) return AVATAR_CAMERA_POSITION.BODY
  return CATEGORY_CAMERA[category]
}
export function getCameraZoomPerCategory(
  category: WearableCategory | null
): number {
  if (category === null) return AVATAR_CAMERA_ZOOM.BODY

  return CATEGORY_CAMERA_ZOOM[category]
}

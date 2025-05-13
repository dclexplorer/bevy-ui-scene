import { store } from '../../state/store'
import type {
  OutfitDefinition,
  OutfitsMetadata
} from '../../utils/outfit-definitions'
import { type AvatarPreview } from './AvatarPreview'
import {
  AvatarShape,
  CameraLayer,
  CameraLayers,
  engine,
  TextureCamera,
  Transform
} from '@dcl/sdk/ecs'
import { BASE_MALE_URN } from '../../utils/urn-utils'
import {
  EYE_COLOR_PRESETS,
  HAIR_COLOR_PRESETS,
  SKIN_COLOR_PRESETS
} from '../color-palette'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

const SLOTS: any[] = new Array(10).fill(null) // TODO duplicated code

const slotAvatars: AvatarPreview[] = []

export const getSlotAvatar = (slotIndex: number): AvatarPreview =>
  slotAvatars[slotIndex]

export const updateOutfitAvatar = (
  slotIndex: number,
  slot: OutfitDefinition
): void => {
  const mutableAvatarShape = AvatarShape.getMutable(
    slotAvatars[slotIndex].avatarEntity
  )

  mutableAvatarShape.wearables = slot.wearables
  mutableAvatarShape.bodyShape = slot.bodyShape
  mutableAvatarShape.hairColor = slot.hair.color
  mutableAvatarShape.eyeColor = slot.eyes.color
  mutableAvatarShape.skinColor = slot.skin.color
  mutableAvatarShape.forceRender = slot.forceRender
}

export const outfitsCameraEntity = engine.addEntity()
const AVATAR_WIDTH = 4
const CAMERA_SIZE = {
  WIDTH: AVATAR_WIDTH * 10,
  HEIGHT: AVATAR_WIDTH * 1
}
const CAMERA_SIZE_FACTOR = 100
TextureCamera.create(outfitsCameraEntity, {
  width: CAMERA_SIZE.WIDTH * CAMERA_SIZE_FACTOR,
  height: CAMERA_SIZE.HEIGHT * CAMERA_SIZE_FACTOR,
  layer: 2,
  clearColor: Color4.create(0.4, 0.4, 1.0, 0),
  mode: {
    $case: 'orthographic',
    orthographic: { verticalRange: 8 }
  }
})
CameraLayer.create(outfitsCameraEntity, {
  layer: 2,
  directionalLight: false,
  showAvatars: false,
  showSkybox: false,
  showFog: false,
  ambientBrightnessOverride: 5
})

Transform.create(outfitsCameraEntity, {
  position: Vector3.create((AVATAR_WIDTH * 10) / 2, 2),
  rotation: Quaternion.fromEulerDegrees(4, 0, 0)
})
export const initOutfitAvatars = (): void => {
  const backpackState = store.getState().backpack
  const outfitsMetadata = backpackState.outfitsMetadata as OutfitsMetadata
  const viewSlots: Array<OutfitDefinition | null> = [...SLOTS] // TODO duplicated code
  outfitsMetadata.outfits.forEach((outfitMetadata) => {
    viewSlots[outfitMetadata.slot] = outfitMetadata.outfit
  })

  viewSlots.forEach((slot, index) => {
    const layer = 2
    slotAvatars[index] = {
      avatarEntity: engine.addEntity(),
      cameraEntity: outfitsCameraEntity
    }

    const { avatarEntity } = slotAvatars[index]

    AvatarShape.create(avatarEntity, {
      bodyShape: slot?.bodyShape ?? BASE_MALE_URN,
      emotes: [],
      expressionTriggerId: undefined,
      expressionTriggerTimestamp: undefined,
      eyeColor: slot?.eyes.color ?? EYE_COLOR_PRESETS[0],
      hairColor: slot?.hair.color ?? HAIR_COLOR_PRESETS[0],
      id: '',
      name: undefined,
      skinColor: slot?.skin.color ?? SKIN_COLOR_PRESETS[0],
      talking: false,
      wearables: slot?.wearables ?? []
    })
    CameraLayers.create(avatarEntity, {
      layers: [layer]
    })

    const position = {
      x: AVATAR_WIDTH / 2 + index * AVATAR_WIDTH,
      y: 0,
      z: 8
    }

    Transform.create(avatarEntity, {
      position,
      rotation: Quaternion.fromEulerDegrees(0, 180, 0), // TODO it would be good to rotate the outfitAvatar when avatarPreview is rotated
      scale: { x: 1, y: 1, z: 1 }
    })
  })
}

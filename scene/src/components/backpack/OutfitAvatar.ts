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
  Material,
  MeshCollider,
  MeshRenderer,
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

const AVATAR_FRAME_SIZE = 4
const MAX_CAMERA_SIZE = 2048
const cameraPosition = Vector3.create(
  (AVATAR_FRAME_SIZE * 4) / 2,
  (AVATAR_FRAME_SIZE * 3) / 2 + 0.5,
  0
)

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

    const avatarWrapperEntity = engine.addEntity()

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

    CameraLayers.create(avatarWrapperEntity, {
      layers: [layer]
    })

    const avatarPosition = {
      x: AVATAR_FRAME_SIZE / 2 + Math.floor(index % 4) * AVATAR_FRAME_SIZE,
      y: 2 * AVATAR_FRAME_SIZE - Math.floor(index / 4) * AVATAR_FRAME_SIZE,
      z: 8
    }

    Transform.create(avatarWrapperEntity, {
      position: avatarPosition,
      rotation: Quaternion.fromEulerDegrees(0, 180, 0) // TODO it would be good to rotate the outfitAvatar when avatarPreview is rotated?
    })

    const AVATAR_SCALE = 1.6
    Transform.create(avatarEntity, {
      parent: avatarWrapperEntity,
      scale: Vector3.create(AVATAR_SCALE, AVATAR_SCALE, AVATAR_SCALE)
    })

    const boxEntity = engine.addEntity()
    MeshRenderer.setBox(boxEntity)
    const platform = engine.addEntity()

    // MeshRenderer.setPlane(platform)
    MeshCollider.setPlane(platform)
    Transform.create(platform, { parent: avatarWrapperEntity })

    Material.setPbrMaterial(boxEntity, {
      albedoColor: Color4.Red(),
      metallic: 0.8,
      roughness: 0.1
    })
    Transform.create(boxEntity, {
      parent: avatarWrapperEntity,
      scale: { x: 0.1, y: 0.1, z: 0.1 }
    })
  })
}

TextureCamera.create(outfitsCameraEntity, {
  width: MAX_CAMERA_SIZE,
  height: MAX_CAMERA_SIZE * (3 / 4),
  layer: 2,
  clearColor: Color4.create(0.4, 0.4, 1.0, 0.3),
  mode: {
    $case: 'orthographic',
    orthographic: { verticalRange: AVATAR_FRAME_SIZE * 3 }
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
  position: cameraPosition,
  rotation: Quaternion.fromEulerDegrees(4, 0, 0)
})

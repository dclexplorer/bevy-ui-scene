import { store } from '../../state/store'
import type { OutfitDefinition } from '../../utils/outfit-definitions'
import { AVATAR_CAMERA_POSITION, type AvatarPreview } from './AvatarPreview'
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
import { Color4, Quaternion } from '@dcl/sdk/math'

const SLOTS: any[] = new Array(10).fill(null) // TODO duplicated code

const slotAvatars: AvatarPreview[] = []
const CAMERA_SIZE = { WIDTH: 138 * 4, HEIGHT: 252 * 4 }

export const getSlotAvatar = (slotIndex: number): AvatarPreview =>
  slotAvatars[slotIndex]

export const initOutfitAvatars = (): void => {
  const backpackState = store.getState().backpack
  const outfitsMetadata = backpackState.outfitsMetadata
  const viewSlots: Array<OutfitDefinition | null> = [...SLOTS] // TODO duplicated code
  outfitsMetadata.outfits.forEach((outfitMetadata) => {
    viewSlots[outfitMetadata.slot] = outfitMetadata.outfit
  })
  viewSlots.forEach((slot, index) => {
    slotAvatars[index] = {
      avatarEntity: engine.addEntity(),
      cameraEntity: engine.addEntity()
    }
    const { avatarEntity, cameraEntity } = slotAvatars[index]
    AvatarShape.create(avatarEntity, {
      bodyShape: BASE_MALE_URN,
      emotes: [],
      expressionTriggerId: undefined,
      expressionTriggerTimestamp: undefined,
      eyeColor: EYE_COLOR_PRESETS[0],
      hairColor: HAIR_COLOR_PRESETS[0],
      id: '',
      name: undefined,
      skinColor: SKIN_COLOR_PRESETS[0],
      talking: false,
      wearables: [BASE_MALE_URN]
    })
    CameraLayers.create(avatarEntity, {
      layers: [2]
    })
    CameraLayer.create(cameraEntity, {
      layer: 2,
      directionalLight: false,
      showAvatars: false,
      showSkybox: false,
      showFog: false,
      ambientBrightnessOverride: 5
    })

    TextureCamera.create(cameraEntity, {
      width: CAMERA_SIZE.WIDTH,
      height: CAMERA_SIZE.HEIGHT,
      layer: 2,
      clearColor: Color4.create(0.4, 0.4, 1.0, 1),
      mode: {
        $case: 'perspective',
        perspective: { fieldOfView: 1 }
      }
    })

    Transform.create(avatarEntity, {
      position: { x: 8, y: 0, z: 8 },
      rotation: Quaternion.fromEulerDegrees(0, 180, 0), // TODO it would be good to rotate the outfitAvatar when avatarPreview is rotated
      scale: { x: 2, y: 2, z: 2 }
    })

    Transform.create(cameraEntity, {
      position: AVATAR_CAMERA_POSITION.BODY,
      rotation: Quaternion.fromEulerDegrees(4, 0, 0)
    })
  })
}

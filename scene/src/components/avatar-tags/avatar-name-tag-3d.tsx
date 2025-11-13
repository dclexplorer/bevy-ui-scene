import { createOrGetAvatarsTracker } from '../../service/avatar-tracker'
import {
  Billboard,
  engine,
  executeTask,
  Material,
  MaterialTransparencyMode,
  MeshRenderer,
  PlayerIdentityData,
  Transform,
  UiCanvas
} from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/players'
import { type Entity } from '@dcl/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { getTagElement } from './tag-element'
import { COLOR } from '../color-palette'
import { GetPlayerDataRes } from '../../utils/definitions'

export function initAvatarTags(): void {
  const avatarTracker = createOrGetAvatarsTracker()
  avatarTracker.onEnterScene((player) => {
    // TODO create tag only for the entered player
    createTag(player)
  })
  avatarTracker.onLeaveScene((userId) => {})
}

function createTag(player: GetPlayerDataRes): void {
  let avatarEntity: Entity | undefined
  for (const [entity, data] of engine.getEntitiesWith(PlayerIdentityData)) {
    if (data.address === player.userId) {
      avatarEntity = entity
    }
  }
  const tagWrapperEntity = engine.addEntity()
  Billboard.create(tagWrapperEntity, {})
  MeshRenderer.setPlane(tagWrapperEntity)
  Transform.create(tagWrapperEntity, {
    parent: avatarEntity,
    position: Vector3.create(0, 2.8, -0.1),
    scale: Vector3.create(2, 1, 1)
  })

  UiCanvas.create(tagWrapperEntity, {
    width: 400,
    height: 200,
    color: Color4.Clear()
  })
  ReactEcsRenderer.setTextureRenderer(
    tagWrapperEntity,
    getTagElement({ player })
  )
  Material.setPbrMaterial(tagWrapperEntity, {
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
    texture: {
      tex: {
        $case: 'uiTexture',
        uiTexture: {
          uiCanvasEntity: tagWrapperEntity
        }
      }
    },
    emissiveTexture: {
      tex: {
        $case: 'uiTexture',
        uiTexture: {
          uiCanvasEntity: tagWrapperEntity
        }
      }
    },
    emissiveColor: COLOR.WHITE,
    emissiveIntensity: 0.2
  })
}

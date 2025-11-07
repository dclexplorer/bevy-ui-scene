import { createOrGetAvatarsTracker } from '../../service/avatar-tracker'
import {
  Billboard,
  engine,
  Material,
  MeshRenderer,
  PlayerIdentityData,
  TextureFilterMode,
  TextureWrapMode,
  Transform,
  UiCanvas
} from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/players'
import { Entity } from '@dcl/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { getTagElement } from './tag-element'

const avatarTagMap = new Map<
  string,
  {
    avatarEntity: Entity
    tagEntity: Entity
  }
>()

export function initAvatarTags() {
  const avatarTracker = createOrGetAvatarsTracker()
  avatarTracker.onEnterScene((userId) => {
    createTags()
  })
  avatarTracker.onLeaveScene((userId) => {
    console.log('onLeaveScene', userId)
  })
  createTags()
}

function createTags() {
  for (const [avatarEntity, data] of engine.getEntitiesWith(
    PlayerIdentityData
  )) {
    if (avatarTagMap.has(data.address)) continue

    console.log('creating tag')
    const tagWrapperEntity = engine.addEntity()
    avatarTagMap.set(data.address, {
      avatarEntity,
      tagEntity: tagWrapperEntity
    })
    Billboard.create(tagWrapperEntity, {})
    MeshRenderer.setPlane(tagWrapperEntity)
    Transform.create(tagWrapperEntity, {
      parent: avatarEntity,
      position: Vector3.create(0, 2.2, -0.1),
      scale: Vector3.create(2, 1, 1)
    })

    UiCanvas.create(tagWrapperEntity, {
      width: 400,
      height: 200,
      color: Color4.Clear()
    })
    // ReactEcsRenderer.setUiRenderer(TagElement)
    const player = getPlayer({ userId: data.address })
    if (!player) continue
    ReactEcsRenderer.setTextureRenderer(
      tagWrapperEntity,
      getTagElement({ player })
    )
    Material.setBasicMaterial(tagWrapperEntity, {
      alphaTexture: {
        tex: {
          $case: 'uiTexture',
          uiTexture: {
            uiCanvasEntity: tagWrapperEntity
          }
        }
      },
      texture: {
        tex: {
          $case: 'uiTexture',
          uiTexture: {
            uiCanvasEntity: tagWrapperEntity
          }
        }
      }
    })
  }
}

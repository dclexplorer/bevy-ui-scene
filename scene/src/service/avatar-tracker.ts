import {
  engine,
  Entity,
  Transform,
  pointerEventsSystem,
  MeshCollider,
  MeshRenderer,
  Material,
  InputAction,
  PBPointerEventsResult
} from '@dcl/sdk/ecs'
import { onEnterScene, onLeaveScene, getPlayer } from '@dcl/sdk/players'
import { Color4 } from '@dcl/sdk/math'
import { PBAvatarBase, PBAvatarEquippedData } from '@dcl/ecs/dist/components'
import { TransformType } from '@dcl/ecs'
type GetPlayerDataRes = {
  entity: Entity
  name: string
  isGuest: boolean
  userId: string
  avatar?: PBAvatarBase
  wearables: PBAvatarEquippedData['wearableUrns']
  emotes: PBAvatarEquippedData['emoteUrns']
  forceRender: PBAvatarEquippedData['forceRender']
  position: TransformType['position'] | undefined
}
export const createOrGetAvatarsTracker = () => {
  const callbacks: Record<string, Array<(userId: string) => void>> = {
    onClick: [],
    onMouseOver: []
  }

  const avatarProxies: Record<string, Entity> = {}

  onEnterScene((player) => {
    //TODO REVIEW: consider excluding own player avatar
    if (player.isGuest) {
      return
    }

    if (!avatarProxies[player.userId]) {
      const proxy = createAvatarProxy(player.userId)
      avatarProxies[player.userId] = proxy
    }
  })

  onLeaveScene((userId) => {
    const proxy = avatarProxies[userId]
    if (proxy) {
      engine.removeEntity(proxy)
      delete avatarProxies[userId]
    }
  })
  let timer = 0
  engine.addSystem((dt) => {
    timer += dt
    if (timer < 0.2) return
    timer = 0
    for (const userId in avatarProxies) {
      const playerData: GetPlayerDataRes | null = getPlayer({ userId })
      if (playerData?.position) {
        const transform = Transform.getMutable(avatarProxies[userId])
        transform.position = playerData.position
      }
    }
  })

  return {
    onClick,
    onMouseOver
  }

  function onClick(fn: (userId: string) => void) {
    callbacks.onClick.push(fn)
    return () => {
      callbacks.onClick = callbacks.onClick.filter((f) => f !== fn)
    }
  }

  function onMouseOver(fn: (userId: string) => void) {
    callbacks.onMouseOver.push(fn)
    return () => {
      callbacks.onMouseOver = callbacks.onMouseOver.filter((f) => f !== fn)
    }
  }

  function createAvatarProxy(userId: string): Entity {
    const wrapper = engine.addEntity()
    const entity = engine.addEntity()
    Transform.create(wrapper, {})
    Transform.create(entity, {
      position: { x: 0, y: 1, z: 0 },
      scale: { x: 0.5, y: 1.8, z: 0.5 },
      parent: wrapper
    })

    MeshRenderer.setBox(entity)
    MeshCollider.setBox(entity)

    Material.setPbrMaterial(entity, {
      albedoColor: Color4.create(1, 1, 1, 0)
    })

    pointerEventsSystem.onPointerDown(
      {
        entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: 'View Passport'
        }
      },
      (event: PBPointerEventsResult) => {
        callbacks.onClick.forEach((fn) => fn(userId))
      }
    )

    pointerEventsSystem.onPointerHoverEnter(
      {
        entity
      },
      (event: PBPointerEventsResult) => {
        callbacks.onMouseOver.forEach((fn) => fn(userId))
      }
    )

    return wrapper
  }
}

import {
  engine,
  type Entity,
  Transform,
  pointerEventsSystem,
  MeshCollider,
  MeshRenderer,
  Material,
  InputAction,
  type PBPointerEventsResult,
  PlayerIdentityData
} from '@dcl/sdk/ecs'
import { onEnterScene, onLeaveScene, getPlayer } from '@dcl/sdk/players'
import { Color4 } from '@dcl/sdk/math'
import {
  type PBAvatarBase,
  type PBAvatarEquippedData,
  PBPlayerIdentityData
} from '@dcl/ecs/dist/components'
import { type TransformType } from '@dcl/ecs'

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

export const createOrGetAvatarsTracker = (): {
  onClick: (fn: (userId: string) => void) => () => void
  onMouseOver: (fn: (userId: string) => void) => () => void
  onMouseLeave: (fn: (userId: string) => void) => () => void
  dispose: () => void
} => {
  const callbacks: Record<string, Array<(userId: string) => void>> = {
    onClick: [],
    onMouseOver: [],
    onMouseLeave: []
  }

  const avatarProxies = new Map<string, Entity>()
  for (const [, data] of engine.getEntitiesWith(PlayerIdentityData)) {
    const playerIdentity: PBPlayerIdentityData = data
    if (
      !avatarProxies.has(playerIdentity.address) &&
      playerIdentity.address !== getPlayer()?.userId
    ) {
      const proxy = createAvatarProxy(playerIdentity.address, `Show Profile`)
      avatarProxies.set(playerIdentity.address, proxy)
    }
  }
  onEnterScene((player) => {
    if (player.userId === getPlayer()?.userId) {
      return
    }

    if (!avatarProxies.has(player.userId)) {
      const proxy = createAvatarProxy(player.userId)
      avatarProxies.set(player.userId, proxy)
    }
  })

  onLeaveScene(disposeAvatarProxy)

  function disposeAvatarProxy(userId: string) {
    const proxy = avatarProxies.get(userId)
    if (proxy) {
      pointerEventsSystem.removeOnPointerDown(proxy)
      engine.removeEntity(proxy)
      avatarProxies.delete(userId)
    }
  }

  let timer = 0
  engine.addSystem((dt) => {
    timer += dt
    if (timer < 0.2) return
    timer = 0
    for (const [userId, proxyEntity] of avatarProxies.entries()) {
      const playerData: GetPlayerDataRes | null = getPlayer({ userId })
      if (playerData?.position) {
        const transform = Transform.getMutable(proxyEntity)
        transform.position = playerData.position
      }
    }
  })

  return {
    onClick,
    onMouseOver,
    onMouseLeave,
    dispose
  }

  function dispose(): void {
    ;[...avatarProxies.keys()].forEach((userId) => {
      disposeAvatarProxy(userId)
    })
    callbacks.onClick = callbacks.onMouseOver = callbacks.onMouseLeave = []
  }

  function onClick(fn: (userId: string) => void): () => void {
    callbacks.onClick.push(fn)
    return () => {
      callbacks.onClick = callbacks.onClick.filter((f) => f !== fn)
    }
  }

  function onMouseOver(fn: (userId: string) => void): () => void {
    callbacks.onMouseOver.push(fn)
    return () => {
      callbacks.onMouseOver = callbacks.onMouseOver.filter((f) => f !== fn)
    }
  }

  function onMouseLeave(fn: (userId: string) => void): () => void {
    callbacks.onMouseLeave.push(fn)
    return () => {
      callbacks.onMouseLeave = callbacks.onMouseLeave.filter((f) => f !== fn)
    }
  }

  function createAvatarProxy(userId: string, hoverText?: string): Entity {
    const wrapper = engine.addEntity()
    const entity = engine.addEntity()
    Transform.create(wrapper, {})

    Transform.create(entity, {
      position: { x: 0, y: 1, z: 0 },
      scale: { x: 1, y: 2.1, z: 1 },
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
          hoverText
        }
      },
      (event: PBPointerEventsResult) => {
        callbacks.onClick.forEach((fn) => {
          fn(userId)
        })
      }
    )

    pointerEventsSystem.onPointerHoverEnter(
      {
        entity
      },
      (event: PBPointerEventsResult) => {
        callbacks.onMouseOver.forEach((fn) => {
          fn(userId)
        })
      }
    )

    pointerEventsSystem.onPointerHoverLeave(
      {
        entity
      },
      (event: PBPointerEventsResult) => {
        callbacks.onMouseLeave.forEach((fn) => {
          fn(userId)
        })
      }
    )

    return wrapper
  }
}

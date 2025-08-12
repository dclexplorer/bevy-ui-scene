import { Transform, engine } from '@dcl/sdk/ecs'
import { BevyApi } from '../bevy-api'
import { type LiveSceneInfo } from '../bevy-api/interface'

export function getPlayerParcel(): { x: number; y: number } {
  const playerEntity = engine.PlayerEntity
  const transform = Transform.get(playerEntity)

  const worldX = transform.position.x
  const worldZ = transform.position.z

  const parcelX = Math.floor(worldX / 16)
  const parcelY = Math.floor(worldZ / 16)

  return { x: parcelX, y: parcelY }
}

export async function getCurrentScene(
  liveSceneInfo?: LiveSceneInfo[]
): Promise<LiveSceneInfo | undefined> {
  const _liveSceneInfo =
    liveSceneInfo ??
    ((await BevyApi.liveSceneInfo()) ?? []).filter(filterSelectableScenes)
  const currentParcel = getPlayerParcel()
  const currentScene = _liveSceneInfo.find((s) =>
    s.parcels.find((p) => p.x === currentParcel.x && p.y === currentParcel.y)
  )
  if (!currentScene && _liveSceneInfo?.length) {
    return _liveSceneInfo.reduce((closestScene, scene) => {
      const closestDistance = getClosestParcelDistance(
        currentParcel,
        closestScene.parcels
      )
      const currentDistance = getClosestParcelDistance(
        currentParcel,
        scene.parcels
      )
      return currentDistance < closestDistance ? scene : closestScene
    })
  }

  return currentScene

  function getClosestParcelDistance(
    from: { x: number; y: number },
    parcels: Array<{ x: number; y: number }>
  ): number {
    return Math.min(
      ...parcels.map((p) => Math.hypot(p.x - from.x, p.y - from.y))
    )
  }
}

export function filterSelectableScenes(sceneInfo: LiveSceneInfo): boolean {
  return sceneInfo.title !== 'UI Scene' && !sceneInfo.title.includes('Road at')
}

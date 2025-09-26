import { Transform, engine, type Coords } from '@dcl/sdk/ecs'
import { BevyApi } from '../bevy-api'
import { type LiveSceneInfo } from '../bevy-api/interface'
import { type Vector3 } from '@dcl/sdk/math'
const state: {
  playerParcel: Coords
} = {
  playerParcel: { x: 0, y: 0 }
}
export function getVector3Parcel(position: Vector3): Coords {
  const worldX = position.x
  const worldZ = position.z

  const x = Math.floor(worldX / 16)
  const y = Math.floor(worldZ / 16)
  return {
    x,
    y
  }
}
export function getPlayerParcel(): { x: number; y: number } {
  const playerEntity = engine.PlayerEntity
  const transform = Transform.get(playerEntity)

  const { x, y } = getVector3Parcel(transform.position)

  if (state.playerParcel.x === x && state.playerParcel.y === y) {
    return state.playerParcel
  } else {
    state.playerParcel = { x, y }
  }
  return state.playerParcel
}

export async function getCurrentScene(
  liveSceneInfo?: LiveSceneInfo[],
  fallbackToClosest: boolean = true
): Promise<LiveSceneInfo | undefined> {
  const _liveSceneInfo =
    liveSceneInfo ??
    ((await BevyApi.liveSceneInfo()) ?? []).filter(filterSelectableScenes)
  const currentParcel = getPlayerParcel()
  const currentScene = _liveSceneInfo.find((s) =>
    s.parcels.find((p) => p.x === currentParcel.x && p.y === currentParcel.y)
  )
  if (!currentScene && _liveSceneInfo?.length && fallbackToClosest) {
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

  return currentScene ?? undefined

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

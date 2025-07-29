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
): Promise<LiveSceneInfo> {
  const _liveSceneInfo =
    liveSceneInfo ??
    (await BevyApi.liveSceneInfo()).filter(filterSelectableScenes)
  const currentParcel = getPlayerParcel()
  const currentScene = _liveSceneInfo.find((s) =>
    s.parcels.find((p) => p.x === currentParcel.x && p.y === currentParcel.y)
  )
  if (!currentScene) {
    //TODO REVIEW TO IMPROVE: look for the closer one
    return _liveSceneInfo[0]
  }
  return currentScene as LiveSceneInfo
}

export function filterSelectableScenes(sceneInfo: LiveSceneInfo) {
  return (
    sceneInfo.title !== 'UI Scene' && sceneInfo.title.indexOf('Road at') === -1
  )
}

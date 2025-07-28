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
  const _liveSceneInfo = liveSceneInfo ?? (await BevyApi.liveSceneInfo())
  const currentParcel = getPlayerParcel()
  const currentScene = _liveSceneInfo.find((s) =>
    s.parcels.find((p) => p.x === currentParcel.x && p.y !== currentParcel.y)
  )
  return currentScene as LiveSceneInfo
}

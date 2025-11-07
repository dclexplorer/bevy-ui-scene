import {
  createOrGetAvatarsTracker,
  getPlayerAvatarEntities
} from '../../service/avatar-tracker'
import { ReactEcs, UiEntity } from '@dcl/react-ecs'
import useState = ReactEcs.useState
import { Entity } from '@dcl/ecs'
import { worldToScreenPx } from '../../service/perspective-to-screen'
import { engine, executeTask, Transform } from '@dcl/sdk/ecs'
import { sleep } from '../../utils/dcl-utils'
import { truncateWithoutBreakingWords } from '../../utils/ui-utils'
import useEffect = ReactEcs.useEffect
import { memoizeFirstArg } from '../../utils/function-utils'
import { FOV } from '../../ui-classes/main-hud/big-map/big-map-view'
import { getViewportHeight, getViewportWidth } from '../../service/canvas-ratio'
import { COLOR } from '../color-palette'
import { Vector3 } from '@dcl/sdk/math'
const UP_TO_HEAD = Vector3.create(0, 2.3, 0)
export function AvatarNameTagElements() {
  const avatarTracker = createOrGetAvatarsTracker()
  const [avatarEntities, setAvatarEntities] = useState<Entity[]>([])
  const [avatarTags, setAvatarTags] = useState<
    {
      position: { top: number; left: number; onScreen: boolean } | undefined
      name: string
    }[]
  >([])
  useEffect(() => {
    avatarTracker.onEnterScene((userId) => {
      setAvatarEntities(getPlayerAvatarEntities(true))
    })
    avatarTracker.onLeaveScene((userId) => {
      setAvatarEntities(getPlayerAvatarEntities(true))
    })

    setAvatarEntities(getPlayerAvatarEntities(true))
  }, [])

  useEffect(() => {
    const _avatarTags = avatarEntities.map((avatarEntity) => {
      const position = worldToScreenPx(
        Vector3.add(Transform.get(avatarEntity).position, UP_TO_HEAD),
        Transform.get(engine.CameraEntity).position,
        Transform.get(engine.CameraEntity).rotation,
        FOV,
        getViewportWidth(),
        getViewportHeight(),
        {
          fovIsHorizontal: false,
          forwardIsNegZ: false
        }
      )

      return {
        position,
        name: 'AVATAR_NAME'
      }
    })

    setAvatarTags(_avatarTags)
  }, [
    avatarEntities,
    Transform.get(engine.CameraEntity).position,
    Transform.get(engine.CameraEntity).rotation
  ])
  return (
    <UiEntity>
      {avatarTags.map(({ position, name }) => (
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position,
            width: 10,
            height: 10
          }}
          uiBackground={{
            color: COLOR.YELLOW
          }}
        />
      ))}
    </UiEntity>
  )
}

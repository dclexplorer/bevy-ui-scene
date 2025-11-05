import { UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { AvatarPreviewElement2 } from './AvatarPreviewElement2'
import { getPlayer } from '@dcl/sdk/players'
import useEffect = ReactEcs.useEffect
import { getContentScaleRatio } from '../../service/canvas-ratio'
import Icon from '../icon/Icon'

export function UserAvatarPreviewElement({
  uiTransform,
  userId,
  allowZoom = false,
  allowRotation = true
}: {
  uiTransform: UiTransformProps
  userId: string
  allowZoom?: boolean
  allowRotation?: boolean
}): ReactElement {
  const [avatarShapeDefinition, setAvatarShapeDefinition] =
    ReactEcs.useState<any>(getAvatarShaopeDEfinitionFromPlayer({ userId }))
  useEffect(() => {
    setAvatarShapeDefinition(getAvatarShaopeDEfinitionFromPlayer({ userId }))
  }, [userId])

  return (
    <AvatarPreviewElement2
      userId={userId}
      avatarShapeDefinition={avatarShapeDefinition}
      allowZoom={allowZoom}
      allowRotation={allowRotation}
      uiTransform={{
        ...uiTransform
      }}
    />
  )
}

function getAvatarShaopeDEfinitionFromPlayer({ userId }: { userId: string }) {
  const player = getPlayer({ userId })
  return {
    id: userId,
    emotes: [],
    forceRender: player?.forceRender ?? [],
    bodyShape: player?.avatar?.bodyShapeUrn,
    eyeColor: player?.avatar?.eyesColor,
    hairColor: player?.avatar?.hairColor,
    skinColor: player?.avatar?.skinColor,
    wearables: (player?.wearables.filter((i: any) => i) ?? []) as string[]
  }
}

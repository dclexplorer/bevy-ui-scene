import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { AvatarPreviewElement2 } from './AvatarPreviewElement2'
import { getPlayer } from '@dcl/sdk/players'
import useEffect = ReactEcs.useEffect
import { type PBAvatarShape } from '@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_shape.gen'

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
    ReactEcs.useState<PBAvatarShape>(
      getAvatarShapeDefinitionFromPlayer({ userId })
    )
  useEffect(() => {
    setAvatarShapeDefinition(getAvatarShapeDefinitionFromPlayer({ userId }))
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

function getAvatarShapeDefinitionFromPlayer({
  userId
}: {
  userId: string
}): PBAvatarShape {
  const player = getPlayer({ userId })
  return {
    id: userId,
    emotes: [],
    forceRender: player?.forceRender ?? [],
    bodyShape: player?.avatar?.bodyShapeUrn,
    eyeColor: player?.avatar?.eyesColor,
    hairColor: player?.avatar?.hairColor,
    skinColor: player?.avatar?.skinColor,
    wearables: player?.wearables.filter((i: any) => i) ?? []
  }
}

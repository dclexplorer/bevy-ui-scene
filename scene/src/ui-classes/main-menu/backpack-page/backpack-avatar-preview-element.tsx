import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { AvatarPreviewElement2 } from '../../../components/backpack/AvatarPreviewElement2'
import { getPlayer } from '@dcl/sdk/players'
import { store } from '../../../state/store'
import { PBAvatarShape } from '@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_shape.gen'
import useEffect = ReactEcs.useEffect
import useState = ReactEcs.useState
import { WearableCategory } from '../../../service/categories'

export function BackpackAvatarPreviewElement(): ReactElement {
  const [avatarShapeDefinition, setAvatarShapeDefinition] =
    useState<PBAvatarShape>(getAvatarShapeFromBackpackStore())
  useEffect(() => {
    setAvatarShapeDefinition(getAvatarShapeFromBackpackStore())
  }, [
    store.getState().backpack.equippedWearables,
    store.getState().backpack.forceRender,
    store.getState().backpack.outfitSetup.base
  ])
  const [activeWearableCategory, setActiveWearableCategory] =
    useState<WearableCategory | null>(
      store.getState().backpack.activeWearableCategory
    )
  useEffect(() => {
    setActiveWearableCategory(store.getState().backpack.activeWearableCategory)
  }, [store.getState().backpack.activeWearableCategory])
  return (
    <AvatarPreviewElement2
      avatarShapeDefinition={avatarShapeDefinition}
      uiTransform={{}}
      userId={getPlayer()?.userId ?? ''}
      allowZoom={false}
      allowRotation={true}
      cameraCategory={activeWearableCategory}
    />
  )
}

function getAvatarShapeFromBackpackStore(): PBAvatarShape {
  return {
    wearables: store.getState().backpack.equippedWearables,
    eyeColor: store.getState().backpack.outfitSetup.base.eyesColor,
    hairColor: store.getState().backpack.outfitSetup.base.hairColor,
    skinColor: store.getState().backpack.outfitSetup.base.skinColor,
    bodyShape: store.getState().backpack.outfitSetup.base.bodyShapeUrn,
    forceRender: store.getState().backpack.forceRender,
    id: store.getState().hud.profileData.userId,
    emotes: store.getState().backpack.equippedEmotes
  }
}

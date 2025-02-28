import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import {ROUNDED_TEXTURE_BACKGROUND} from "../../utils/constants";

function FriendItem(props: {
  // Events
  onMouseDown?: Callback
  // Shape
  uiTransform?: UiTransformProps
  backgroundColor?: Color4
  // Text
  userId: string
  fontSize: number
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  const player = getPlayer({ userId: props.userId })
  const playerName = player?.avatar?.name ?? 'userId not found'
  const playerFound: boolean = player !== null

  return (
    <UiEntity
      uiTransform={{
        margin: props.fontSize * 0.3,
        alignItems: 'center',
        flexDirection: 'row',
        ...props.uiTransform
      }}
      uiBackground={{
          ...ROUNDED_TEXTURE_BACKGROUND,
        color: props.backgroundColor ?? { ...Color4.White(), a: 0.01 }
      }}
      onMouseDown={props.onMouseDown}
    >
      {/* AVATAR */}
      <UiEntity
        uiTransform={{
          width: props.fontSize * 2,
          height: props.fontSize * 2,
          margin: { left: props.fontSize }
        }}
        uiBackground={
          playerFound
            ? { avatarTexture: { userId: props.userId } }
            : getBackgroundFromAtlas({
                atlasName: 'icons',
                spriteName: 'DdlIconColor'
              })
        }
      />
      {/* TEXT */}
      <UiEntity
        uiTransform={{
          width: 'auto',
          height: 'auto'
        }}
        uiText={{
          value: playerName,
          fontSize: props.fontSize,
          color: Color4.White(),
          textAlign: 'middle-left'
        }}
      />
    </UiEntity>
  )
}

export default FriendItem

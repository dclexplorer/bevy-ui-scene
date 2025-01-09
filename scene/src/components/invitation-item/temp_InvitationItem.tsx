import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { ALMOST_WHITE } from '../../utils/constants'
import {
  getBackgroundFromAtlas,
  truncateWithoutBreakingWords
} from '../../utils/ui-utils'
import { type Invitation } from '../friend-invitation/FriendInvitation.types'

function InvitationItem(props: {
  // Events
  onMouseDown?: Callback
  // Shape
  uiTransform?: UiTransformProps
  backgroundColor?: Color4
  // Text
  invitation: Invitation
  fontSize: number
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  const player = getPlayer({ userId: props.invitation.id })
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
        color: props.backgroundColor ?? { ...Color4.White(), a: 0.01 },
        textureMode: 'nine-slices',
        texture: {
          src: 'assets/images/backgrounds/rounded.png'
        },
        textureSlices: {
          top: 0.5,
          bottom: 0.5,
          left: 0.5,
          right: 0.5
        }
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
            ? { avatarTexture: { userId: props.invitation.id } }
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
          height: 'auto',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexGrow: 1
        }}
      >
        <UiEntity
          uiTransform={{
            width: 'auto',
            height: props.fontSize
          }}
          uiText={{
            value: playerName,
            fontSize: props.fontSize,
            color: Color4.White(),
            textAlign: 'middle-left'
          }}
        />
        <UiEntity
          uiTransform={{
            width: 'auto',
            height: props.fontSize
          }}
          uiText={{
            value: truncateWithoutBreakingWords(props.invitation.message, 20),
            fontSize: props.fontSize,
            color: { ...ALMOST_WHITE, a: 0.2 },
            textAlign: 'middle-left'
          }}
        />
      </UiEntity>
      <UiEntity
        uiTransform={{
          width: 'auto',
          height: 'auto'
        }}
        uiText={{
          value: props.invitation.date,
          fontSize: props.fontSize,
          color: { ...ALMOST_WHITE, a: 0.2 },
          textAlign: 'middle-left'
        }}
      />
    </UiEntity>
  )
}

export default InvitationItem

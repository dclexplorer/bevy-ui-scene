import { getPlayer } from '@dcl/sdk/src/players'

import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

import ReactEcs, {
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { LAVANDER, ALMOST_WHITE } from '../../utils/constants'
import type { Message } from '../../utils/definitions'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'

function ChatMessage(props: {
  uiTransform?: UiTransformProps
  message: Message
  fontSize?: number
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  const myPlayer = getPlayer()
  if (myPlayer === null) {
    return null
  }
  const playerName = getPlayer({ userId: props.message.from })?.avatar?.name

  return (
    <UiEntity
      uiTransform={{
        height: 'auto',
        width: '100%',
        flexDirection:
          props.message.from === myPlayer.userId ? 'row-reverse' : 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: { bottom: 2, top: 2 },
        ...props.uiTransform
      }}
    >
      <UiEntity
        uiTransform={{
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
          margin:
            props.message.from === myPlayer.userId
              ? { left: canvasInfo.width * 0.005 }
              : { right: canvasInfo.width * 0.005 }
        }}
        uiBackground={
          props.message.from === 'dcl'
            ? getBackgroundFromAtlas({
                atlasName: 'icons',
                spriteName: 'DdlIconColor'
              })
            : { avatarTexture: { userId: props.message.from } }
        }
      />

      <UiEntity
        uiTransform={{
          width: 'auto',
          maxWidth: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 5,
          flexDirection: 'column'
        }}
        uiBackground={{
          color: { ...Color4.Black(), a: 0.4 },
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
      >
        <Label
          uiTransform={{
            width: 'auto',
            maxWidth: canvasInfo.width * 0.09,
            height: props.fontSize ?? 14
          }}
          value={
            props.message.from === 'dcl' ? 'DCL System:' : playerName + ':'
          }
          fontSize={props.fontSize ?? 14}
          color={props.message.from === 'dcl' ? Color4.Green() : LAVANDER}
          textAlign="middle-left"
        />
        {/* TEXT */}
        <Label
          uiTransform={{
            width: 'auto',
            maxWidth: canvasInfo.width * 0.09,
            height: 'auto'
          }}
          value={props.message.text}
          fontSize={props.fontSize ?? 14}
          color={ALMOST_WHITE}
          textWrap="wrap"
          textAlign="middle-left"
        />
      </UiEntity>
    </UiEntity>
  )
}

export default ChatMessage

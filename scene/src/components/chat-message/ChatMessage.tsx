import { getPlayer } from '@dcl/sdk/src/players'

import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

import ReactEcs, {
  type Key,
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { ALMOST_WHITE, ZERO_ADDRESS } from '../../utils/constants'
import { BORDER_RADIUS_F, getBackgroundFromAtlas } from '../../utils/ui-utils'
import {
  CHAT_SIDE,
  type ChatMessageDefinition,
  type ChatMessageRepresentation
} from './ChatMessage.types'
import { getAddressColor } from '../../ui-classes/main-hud/chat-and-logs/ColorByAddress'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { COLOR } from '../color-palette'
import { memoize } from '../../utils/function-utils'
import { ButtonIcon } from '../button-icon'

const state: { hoveringMessageID: number; openMessageMenu: boolean } = {
  hoveringMessageID: 0,
  openMessageMenu: false
}
const _getAddressColor = memoize(getAddressColor)

function ChatMessage(props: {
  uiTransform?: UiTransformProps
  message: ChatMessageRepresentation
  key?: Key
  onMessageMenu: (id: number) => void
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  const myPlayer = getPlayer()
  if (myPlayer === null) {
    return null
  }
  const defaultFontSize = getCanvasScaleRatio() * 36
  const playerName = props.message.name
  const addressColor = _getAddressColor(props.message.sender_address) as Color4

  const side = props.message.side
  const messageMargin = 12 * getCanvasScaleRatio()

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        flexDirection: side === CHAT_SIDE.RIGHT ? 'row-reverse' : 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: {
          bottom: messageMargin,
          top: messageMargin
        },
        borderRadius: getCanvasScaleRatio() * BORDER_RADIUS_F * 4,
        borderColor: COLOR.BLACK_TRANSPARENT,
        borderWidth: 0,
        ...props.uiTransform
      }}
      onMouseEnter={() => {
        state.hoveringMessageID = props.message.timestamp
      }}
      onMouseLeave={() => {
        if (state.hoveringMessageID !== 0) {
          state.hoveringMessageID = 0
        }
      }}
    >
      <UiEntity
        uiTransform={{
          width: getCanvasScaleRatio() * 64,
          height: getCanvasScaleRatio() * 64,
          justifyContent: 'center',
          alignItems: 'center',
          margin:
            props.message.sender_address === myPlayer.userId
              ? { left: canvasInfo.width * 0.005 }
              : { right: canvasInfo.width * 0.005 },
          borderRadius: 999,
          borderWidth: getCanvasScaleRatio() * 3,
          borderColor: addressColor
        }}
        uiBackground={{
          color: { ...addressColor, a: 0.3 }
        }}
      >
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
          uiBackground={
            isSystemMessage(props.message)
              ? getBackgroundFromAtlas({
                  atlasName: 'icons',
                  spriteName: 'DdlIconColor'
                })
              : props.message.isGuest
              ? {
                  ...getBackgroundFromAtlas({
                    atlasName: 'icons', // TODO review to use guest real avatar profile image, for which avatarTexture don't work, review how unity explorer does for guests
                    spriteName: 'Members'
                  }),
                  color: COLOR.WHITE_OPACITY_2
                }
              : {
                  textureMode: 'stretch',
                  avatarTexture: {
                    userId: props.message.sender_address
                  }
                }
          }
        />
      </UiEntity>

      <UiEntity
        uiTransform={{
          width: '70%',
          maxWidth: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 5,
          flexDirection: 'column',
          borderRadius: 10,
          ...(props.message.hasMentionToMe
            ? {
                borderWidth: getCanvasScaleRatio() * 10,
                borderColor: COLOR.MESSAGE_MENTION
              }
            : {
                borderWidth: getCanvasScaleRatio() * 1,
                borderColor: COLOR.BLACK_TRANSPARENT
              })
        }}
        uiBackground={{
          color: props.message.hasMentionToMe
            ? COLOR.MESSAGE_MENTION_BACKGROUND
            : {
                ...Color4.Black(),
                a: isSystemMessage(props.message) ? 0.2 : 0.8
              }
        }}
      >
        {!isSystemMessage(props.message) && (
          <Label
            uiTransform={{
              width: '100%',
              height: defaultFontSize
            }}
            value={`<b>${playerName}</b>`}
            fontSize={defaultFontSize}
            color={
              isSystemMessage(props.message)
                ? Color4.Gray()
                : (getAddressColor(props.message.sender_address) as Color4)
            }
            textAlign={`middle-left`}
          />
        )}
        {/* TEXT */}
        <Label
          uiTransform={{
            width: '100%'
          }}
          value={
            isSystemMessage(props.message)
              ? `<i>${props.message.message}</i>`
              : decorateNamesWithLinkColor(props.message.message)
          }
          fontSize={defaultFontSize}
          color={ALMOST_WHITE}
          textWrap="wrap"
          textAlign={`middle-left`}
        />
        <Label
          uiTransform={{
            width: '100%',
            height: getCanvasScaleRatio() * 30
          }}
          value={formatTimestamp(props.message.timestamp)}
          fontSize={defaultFontSize * 0.7}
          color={COLOR.INACTIVE}
          textWrap="wrap"
          textAlign={`middle-left`}
        />
        {
          <ButtonIcon
            onMouseDown={() => {
              props.onMessageMenu(props.message.timestamp)
            }}
            uiTransform={{
              positionType: 'absolute',
              position: { right: '1%', top: '5%' },
              width: getCanvasScaleRatio() * 48,
              height: getCanvasScaleRatio() * 48,
              margin: { right: getCanvasScaleRatio() * 10 },
              display:
                state.hoveringMessageID === props.message.timestamp
                  ? 'flex'
                  : 'none',
              pointerFilter: 'block'
            }}
            icon={{ atlasName: 'icons', spriteName: 'Menu' }}
            iconSize={getCanvasScaleRatio() * 32}
          />
        }
      </UiEntity>
    </UiEntity>
  )
}

const formatTimestamp = memoize((timestamp: number): string => {
  const date = new Date(timestamp)

  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
})

export default ChatMessage

export function isSystemMessage(messageData: ChatMessageDefinition): boolean {
  return messageData.sender_address === ZERO_ADDRESS
}

export function decorateNamesWithLinkColor(message: string): string {
  // 00B1FE
  return message.replace(/(@\w+)/g, `<color=#00B1FE>$1</color>`)
}

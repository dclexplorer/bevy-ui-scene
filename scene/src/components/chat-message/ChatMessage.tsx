import { getPlayer } from '@dcl/sdk/src/players'

import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

import ReactEcs, {
  type Key,
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import {
  ALMOST_WHITE,
  ROUNDED_TEXTURE_BACKGROUND,
  ZERO_ADDRESS
} from '../../utils/constants'
import { BORDER_RADIUS_F, getBackgroundFromAtlas } from '../../utils/ui-utils'
import {
  type ChatMessageDefinition,
  type ChatMessageRepresentation
} from './ChatMessage.types'
import { getAddressColor } from '../../ui-classes/main-hud/chat-and-logs/ColorByAddress'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { COLOR } from '../color-palette'
import { memoize } from '../../utils/function-utils'
enum SIDE {
  LEFT,
  RIGHT
}

function ChatMessage(props: {
  uiTransform?: UiTransformProps
  message: ChatMessageRepresentation
  fontSize?: number
  key?: Key
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  const myPlayer = getPlayer()
  if (myPlayer === null) {
    return null
  }
  const defaultFontSize = getCanvasScaleRatio() * 36
  const playerName = props.message.name
  const addressColor = getAddressColor(props.message.sender_address) as Color4

  const side =
    props.message.sender_address === myPlayer.userId ? SIDE.RIGHT : SIDE.LEFT
  const align = side === SIDE.LEFT ? 'left' : 'right'
  const messageMargin = 12 * getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        flexDirection: side === SIDE.RIGHT ? 'row-reverse' : 'row',
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
              : {
                  textureMode: 'stretch',
                  avatarTexture: { userId: props.message.sender_address }
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
          flexDirection: 'column'
        }}
        uiBackground={{
          ...ROUNDED_TEXTURE_BACKGROUND,
          color: {
            ...Color4.Black(),
            a: isSystemMessage(props.message) ? 0.2 : 0.4
          }
        }}
      >
        {!isSystemMessage(props.message) && (
          <Label
            uiTransform={{
              width: '100%',
              height: props.fontSize ?? defaultFontSize
            }}
            value={`<b>${playerName}</b>`}
            fontSize={props.fontSize ?? defaultFontSize}
            color={
              isSystemMessage(props.message)
                ? Color4.Gray()
                : (getAddressColor(props.message.sender_address) as Color4)
            }
            textAlign={`middle-${align}`}
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
              : props.message.message
          }
          fontSize={props.fontSize ?? defaultFontSize}
          color={ALMOST_WHITE}
          textWrap="wrap"
          textAlign={`middle-${align}`}
        />
        <Label
          uiTransform={{
            width: '100%',
            height: getCanvasScaleRatio() * 30
          }}
          value={formatTimestamp(props.message.timestamp)}
          fontSize={props.fontSize ?? defaultFontSize * 0.7}
          color={COLOR.INACTIVE}
          textWrap="wrap"
          textAlign={`middle-${align}`}
        />
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

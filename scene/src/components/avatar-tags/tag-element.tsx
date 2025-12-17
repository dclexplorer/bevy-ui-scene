import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../color-palette'
import useEffect = ReactEcs.useEffect
import { type GetPlayerDataRes } from '../../utils/definitions'
import { getAddressColor } from '../../ui-classes/main-hud/chat-and-logs/ColorByAddress'
import { getViewportHeight } from '../../service/canvas-ratio'
import { requestAndSetPlayerComposedData } from '../../service/chat-members'
import useState = ReactEcs.useState
import { executeTask } from '@dcl/sdk/ecs'
import { type RGBAColor } from '../../bevy-api/interface'
import { onNewMessage } from '../../ui-classes/main-hud/chat-and-logs/ChatsAndLogs'
import { type ChatMessageRepresentation } from '../chat-message/ChatMessage.types'
import { sleep } from '../../utils/dcl-utils'
import { Column, Row } from '../layout'
import { truncateWithoutBreakingWords } from '../../utils/ui-utils'
import Icon from '../icon/Icon'
import { getHudFontSize } from '../../ui-classes/main-hud/scene-info/SceneInfo'
import { store } from '../../state/store'
import { getPlayer } from '@dcl/sdk/players'
import { isSingleEmoji } from '../chat-message/ChatMessage'
const TIME_TO_HIDE_MESSAGE = 5000
export function getTagElement({
  player
}: {
  player: GetPlayerDataRes
}): () => ReactElement {
  return function TagElement(): ReactElement {
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          justifyContent: 'center',
          alignSelf: 'center'
        }}
      >
        <TagContent player={player} />
      </UiEntity>
    )
  }
}

function TagContent({ player }: { player: GetPlayerDataRes }): ReactElement {
  const [playerName, setPlayerName] = useState<string>(
    player.name
      ? `<b>${player.name}</b>#${player.userId.substring(
          player.userId.length - 4,
          player.userId.length
        )}`
      : '???'
  )
  const [nameColor, setNameColor] = useState<RGBAColor>(
    COLOR.TEXT_COLOR_LIGHT_GREY
  )
  const [voiceIconFrame, setVoiceIconFrame] = useState<number>(1)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [hasClaimedName, setHasClaimedName] = useState<boolean>(false)
  const [chatMessage, setChatMessage] =
    useState<ChatMessageRepresentation | null>(null)
  const [messageToHide, setMessageToHide] =
    useState<ChatMessageRepresentation | null>(null)
  const defaultFontSize = getHudFontSize(getViewportHeight()).NORMAL
  const messageMargin = defaultFontSize / 3
  useEffect(() => {
    executeTask(async () => {
      const { profileData } = await requestAndSetPlayerComposedData({
        userId: player.userId
      })
      if (profileData?.avatars[0].hasClaimedName) {
        setHasClaimedName(true)
        setPlayerName(`<b>${player.name}</b>`)
        setNameColor(getAddressColor(player.userId))
      }
    })
    onNewMessage((message: ChatMessageRepresentation) => {
      if (message.player?.userId === player.userId) {
        executeTask(async () => {
          setChatMessage(message)
          await sleep(TIME_TO_HIDE_MESSAGE)
          setMessageToHide(message)
        })
      }
    })
  }, [])

  useEffect(() => {
    setIsSpeaking(!!store.getState().hud.playerVoiceStateMap[player.userId])
  }, [store.getState().hud.playerVoiceStateMap])

  useEffect(() => {
    if (player.userId === getPlayer()?.userId) {
      setIsSpeaking(store.getState().hud.micEnabled)
    }
  }, [store.getState().hud.micEnabled])

  useEffect(() => {
    executeTask(async () => {
      await sleep(100)
      if (isSpeaking) {
        if (voiceIconFrame < 3) {
          setVoiceIconFrame(voiceIconFrame + 1)
        } else {
          setVoiceIconFrame(1)
        }
      }
    })
  }, [isSpeaking, voiceIconFrame])

  useEffect(() => {
    if (messageToHide) {
      if (messageToHide === chatMessage) {
        setChatMessage(null)
      }
    }
  }, [messageToHide])
  const fontSize = getHudFontSize(getViewportHeight()).NORMAL
  return (
    <Column
      uiTransform={{
        borderRadius: getViewportHeight() * 0.025,
        borderWidth: messageMargin / 2,
        alignSelf: 'flex-start',
        padding: {
          top: 5,
          bottom: 5,
          left: 10,
          right: 10
        },
        ...(chatMessage?.hasMentionToMe
          ? {
              borderColor: COLOR.MESSAGE_MENTION
            }
          : {
              borderColor: COLOR.BLACK_TRANSPARENT
            })
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_8
      }}
    >
      <Row>
        {isSpeaking && (
          <Icon
            icon={{
              atlasName: 'icons',
              spriteName: `voice-${voiceIconFrame}`
            }}
            uiTransform={{
              flexGrow: 0,
              flexShrink: 0,
              width: fontSize,
              height: fontSize,
              margin: { left: fontSize }
            }}
          />
        )}
        <UiEntity
          uiTransform={{
            alignSelf: 'flex-start'
          }}
          uiText={{
            outlineColor: COLOR.WHITE,
            outlineWidth: 1,
            value: playerName,
            fontSize,
            color: nameColor,
            textAlign: 'top-left'
          }}
        />
        {hasClaimedName && (
          <Icon
            iconSize={getViewportHeight() * 0.025}
            icon={{ spriteName: 'Verified', atlasName: 'icons' }}
          />
        )}
      </Row>
      {chatMessage && (
        <UiEntity
          uiTransform={{
            maxWidth: getViewportHeight() * 0.3,
            margin: { top: -getViewportHeight() * 0.01 }
          }}
          uiText={{
            textAlign: 'top-left',
            textWrap: 'wrap',
            value: truncateWithoutBreakingWords(chatMessage.message, 120),
            fontSize: isSingleEmoji(chatMessage?.message ?? '')
              ? getViewportHeight() * 0.05
              : getViewportHeight() * 0.02
          }}
        />
      )}
    </Column>
  )
}

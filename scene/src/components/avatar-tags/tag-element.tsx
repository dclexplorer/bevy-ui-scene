import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../color-palette'
import useEffect = ReactEcs.useEffect
import { GetPlayerDataRes } from '../../utils/definitions'
import { getAddressColor } from '../../ui-classes/main-hud/chat-and-logs/ColorByAddress'
import {
  getContentScaleRatio,
  getViewportHeight
} from '../../service/canvas-ratio'
import { ChatMessage } from '../chat-message'
import { requestAndSetPlayerComposedData } from '../../service/chat-members'
import useState = ReactEcs.useState
import { executeTask } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/players'
import { RGBAColor } from '../../bevy-api/interface'
import { Color4 } from '@dcl/sdk/math'
import { onNewMessage } from '../../ui-classes/main-hud/chat-and-logs/ChatsAndLogs'
import { ChatMessageRepresentation } from '../chat-message/ChatMessage.types'
import { sleep } from '../../utils/dcl-utils'
import { Column } from '../layout'
import { truncateWithoutBreakingWords } from '../../utils/ui-utils'
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
          alignSelf: 'flex-end'
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
      : ''
  )
  const [nameColor, setNameColor] = useState<RGBAColor>(
    COLOR.TEXT_COLOR_LIGHT_GREY
  )
  const [chatMessage, setChatMessage] =
    useState<ChatMessageRepresentation | null>(null)
  const [messageToHide, setMessageToHide] =
    useState<ChatMessageRepresentation | null>(null)
  useEffect(() => {
    executeTask(async () => {
      const { playerData, profileData } = await requestAndSetPlayerComposedData(
        { userId: player.userId }
      )
      if (profileData?.avatars[0].hasClaimedName) {
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
    if (messageToHide) {
      if (messageToHide === chatMessage) {
        setChatMessage(null)
      }
    }
  }, [messageToHide])
  return (
    <Column
      uiTransform={{
        borderRadius: getViewportHeight() * 0.025,
        borderWidth: 1,
        borderColor: COLOR.BLACK_TRANSPARENT,
        alignSelf: 'flex-start',
        padding: {
          top: 5,
          bottom: 5,
          left: 10,
          right: 10
        }
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_8
      }}
    >
      <UiEntity
        uiTransform={{
          alignSelf: 'flex-start'
        }}
        uiText={{
          outlineColor: COLOR.WHITE,
          outlineWidth: 1,
          value: playerName,
          fontSize: getViewportHeight() * 0.025,
          color: nameColor,
          textAlign: 'top-left'
        }}
      />
      {chatMessage && (
        <UiEntity
          uiTransform={{
            maxWidth: getViewportHeight() * 0.3,
            margin: { top: -getViewportHeight() * 0.025 }
          }}
          uiText={{
            textAlign: 'top-left',
            textWrap: 'wrap',
            value: truncateWithoutBreakingWords(chatMessage.message, 120),
            fontSize: getViewportHeight() * 0.025
          }}
        />
      )}
    </Column>
  )
}

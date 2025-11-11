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
          justifyContent: 'center'
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
  }, [])
  return (
    <UiEntity
      uiTransform={{
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLOR.BLACK_TRANSPARENT,
        alignSelf: 'center',
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
      uiText={{
        outlineColor: COLOR.WHITE,
        outlineWidth: 1,
        value: playerName,
        fontSize: getViewportHeight() * 0.03,
        color: nameColor,
        textAlign: 'middle-center'
      }}
    >
      {/*    <ChatMessage message={"Hello"} onMessageMenu={()=>void} />*/}
    </UiEntity>
  )
}

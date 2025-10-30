import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { Column, Row } from '../../../components/layout'
import useEffect = ReactEcs.useEffect
import { store } from '../../../state/store'
import type { AppState } from '../../../state/types'
import {
  HUD_ACTION,
  type UpdateHudAction,
  updateHudStateAction
} from '../../../state/hud/actions'
import { getPlayersInScene } from '~system/Players'
import { getPlayer } from '@dcl/sdk/src/players'
import { executeTask } from '@dcl/sdk/ecs'
import {
  NAME_MENTION_REGEXP,
  SUGGESTION_NAME_MENTION_REGEXP
} from '../../../components/chat-message/ChatMessage'
import { COLOR } from '../../../components/color-palette'
import { getViewportHeight } from '../../../service/canvas-ratio'
import { getNameWithHashPostfix } from './ChatsAndLogs'
import { namedUsersData } from './named-users-data-service'
import { getHudFontSize } from '../scene-info/SceneInfo'

export const ChatMentionSuggestions = () => {
  const [suggestedNames, setSuggestedNames] = ReactEcs.useState<string[]>([])
  useEffect(() => {
    setSuggestedNames(store.getState().hud.chatInputMentionSuggestions)
  }, [store.getState().hud.chatInputMentionSuggestions])

  useEffect(() => {
    const [lastMatch] =
      store.getState().hud.chatInput?.match(SUGGESTION_NAME_MENTION_REGEXP) ??
      []
    const otherMatches =
      store
        .getState()
        .hud.chatInput?.match(NAME_MENTION_REGEXP)
        ?.filter((m: string) => m !== lastMatch)
        .map((m) => m.replace('@', '')) ?? []

    if (lastMatch) {
      getSuggestedNames(lastMatch.replace('@', '')).then((suggestedNames) => {
        store.dispatch(
          updateHudStateAction({
            chatInputMentionSuggestions: suggestedNames.filter(
              (s) => !otherMatches.includes(s)
            )
          })
        )
      })
    } else if (suggestedNames?.length) {
      store.dispatch(
        updateHudStateAction({
          chatInputMentionSuggestions: []
        })
      )
    }
  }, [store.getState().hud.chatInput])

  return (
    <Column
      uiTransform={{
        width: '100%',
        flexGrow: 1,
        flexDirection: 'column-reverse',
        positionType: 'absolute',
        position: {
          bottom: getViewportHeight() * 0.04
        }
      }}
      uiBackground={{ color: COLOR.DARK_OPACITY_2 }}
    >
      {suggestedNames.map((suggestedName, index) => {
        return (
          <Row
            uiTransform={{
              width: '100%',
              borderColor: index === 0 ? COLOR.WHITE : COLOR.BLACK_TRANSPARENT,
              borderRadius: getHudFontSize(getViewportHeight()).NORMAL,
              borderWidth: 1
            }}
            key={suggestedName}
            uiBackground={{ color: COLOR.DARK_OPACITY_5 }}
          >
            <UiEntity
              uiText={{
                value: index === 0 ? `<b>${suggestedName}</b>` : suggestedName
              }}
            />
          </Row>
        )
      })}
    </Column>
  )
}

async function getSuggestedNames(matchText: string): Promise<string[]> {
  // TODO filter those names that are already mentioned in the message
  return (await getPlayersInScene({})).players
    .map(({ userId }) => getPlayer({ userId }))
    .filter(
      (player) =>
        player?.name.toLowerCase().startsWith(matchText.toLowerCase()) &&
        player?.userId !== getPlayer()?.userId
    )
    .map((player) => {
      if (
        namedUsersData.has(player?.name.toLowerCase() ?? '') ||
        namedUsersData.has(
          getNameWithHashPostfix(
            player?.name ?? '',
            player?.userId ?? ''
          ).toLowerCase()
        )
      ) {
        const hasClaimedName =
          namedUsersData.get(player?.name?.toLowerCase() ?? '')?.profileData
            ?.avatars[0].hasClaimedName ??
          namedUsersData.get(
            getNameWithHashPostfix(
              player?.name ?? '',
              player?.userId ?? ''
            ).toLowerCase()
          )?.profileData?.avatars[0].hasClaimedName

        return hasClaimedName
          ? player?.name
          : getNameWithHashPostfix(
              player?.name ?? '',
              player?.userId ?? ''
            ).toLowerCase()
      } else {
        return player?.name
      }
    })
    .filter((i) => i)
    .sort((a, b) => a!.localeCompare(b!)) as string[]
}

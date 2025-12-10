import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { Column, Row } from '../../../components/layout'
import useEffect = ReactEcs.useEffect
import { store } from '../../../state/store'
import { updateHudStateAction } from '../../../state/hud/actions'

import {
  EMOJI_MENTION_REGEXP,
  SUGGESTION_EMOJI_REGEXP
} from '../../../components/chat-message/ChatMessage'
import { COLOR } from '../../../components/color-palette'
import { getViewportHeight } from '../../../service/canvas-ratio'
import { getHudFontSize } from '../scene-info/SceneInfo'
import emojiCompleteList from './emojis_complete.json'
import { memoize } from '../../../utils/function-utils'
const EMOJI_EXPRESSIONS = emojiCompleteList.emojis.reduce(
  (acc, current) => [...acc, current.expression] as string[],
  [] as string[]
)
const MAX_LIST = 10

const getEmojiFromExpression = memoize(_getEmojiFromExpression)
export const ChatEmojiSuggestions = (): ReactElement => {
  const [suggestedEmojis, setSuggestedEmojis] = ReactEcs.useState<string[]>([])
  useEffect(() => {
    setSuggestedEmojis(store.getState().hud.chatInputEmojiSuggestions)
  }, [store.getState().hud.chatInputEmojiSuggestions])

  useEffect(() => {
    const [lastMatch] =
      store.getState().hud.chatInput?.match(SUGGESTION_EMOJI_REGEXP) ?? []

    const otherMatches =
      store
        .getState()
        .hud.chatInput?.match(EMOJI_MENTION_REGEXP)
        ?.filter((m: string) => m !== lastMatch)
        .map((m) => m.replace(':', '').replace(':', '')) ?? []

    if (
      lastMatch &&
      countCharInString(lastMatch, ':') === 1 &&
      !suggestedEmojis.includes(lastMatch.replace(':', '').replace(':', '')) &&
      !/:\w*:/.test(lastMatch)
    ) {
      getSuggestedEmojis(lastMatch.replace(':', '').replace(':', ''))
        .then((_suggestedEmojis) => {
          store.dispatch(
            updateHudStateAction({
              chatInputEmojiSuggestions: _suggestedEmojis
                .filter((s) => !otherMatches.includes(s))
                .map((i) => `${getEmojiFromExpression(i)} ${i}`)
                .slice(0, MAX_LIST)
            })
          )
        })
        .catch(console.error)
    } else if (suggestedEmojis?.length) {
      store.dispatch(
        updateHudStateAction({
          chatInputEmojiSuggestions: []
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
      {suggestedEmojis.map((suggestedName, index) => {
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

async function getSuggestedEmojis(matchText: string): Promise<string[]> {
  // TODO filter those names that are already mentioned in the message
  console.log('matchText', matchText)
  return Array.from(
    new Set(
      EMOJI_EXPRESSIONS.sort((a, b) =>
        (a as string).localeCompare(b as string)
      ) as string[]
    )
  ).filter(
    (expression) =>
      expression.toLowerCase().startsWith(`:${matchText}`.toLowerCase()) // TODO REVIEW to improve not only startsWith
  )
}

function _getEmojiFromExpression(expression: string) {
  return (
    emojiCompleteList.emojis.find((emoji) => emoji.expression === expression)
      ?.emoji ?? ''
  )
}

function countCharInString(str: string, char: string) {
  return str.split(char).length - 1
}

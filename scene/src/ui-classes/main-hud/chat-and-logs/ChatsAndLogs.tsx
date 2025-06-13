import {
  engine,
  executeTask,
  PointerLock,
  PrimaryPointerInfo,
  UiCanvasInformation,
  UiScrollResult,
  UiTransform
} from '@dcl/sdk/ecs'
import { Color4, Vector2 } from '@dcl/sdk/math'
import ReactEcs, {
  Input,
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { ChatMessage } from '../../../components/chat-message'

import {
  ALMOST_WHITE,
  ROUNDED_TEXTURE_BACKGROUND
} from '../../../utils/constants'
import { BevyApi } from '../../../bevy-api'
import {
  CHAT_SIDE,
  type ChatMessageDefinition,
  type ChatMessageRepresentation
} from '../../../components/chat-message/ChatMessage.types'
import { isTruthy, memoize } from '../../../utils/function-utils'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { listenSystemAction } from '../../../service/system-actions-emitter'
import { setUiFocus, copyToClipboard } from '~system/RestrictedActions'
import { isSystemMessage } from '../../../components/chat-message/ChatMessage'
import { COLOR } from '../../../components/color-palette'
import { type ReactElement } from '@dcl/react-ecs'
import Icon from '../../../components/icon/Icon'
import {
  getChatMembers,
  initChatMembersCount
} from '../../../service/chat-members'
import { store } from '../../../state/store'
import { filterEntitiesWith, sleep } from '../../../utils/dcl-utils'
import { type PBUiCanvasInformation } from '@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/ui_canvas_information.gen'
import {
  HUD_ACTION,
  type UpdateHudAction,
  updateHudStateAction
} from '../../../state/hud/actions'
import { type AppState } from '../../../state/types'
import { getUserData } from '~system/UserIdentity'
type Box = {
  position: { x: number; y: number }
  size: { x: number; y: number }
}

const BUFFER_SIZE = 40

const state: {
  mouseX: number
  mouseY: number
  messageMenuPositionTop: number
  messageMenuTimestamp: number
  open: boolean
  unreadMessages: number
  autoScrollSwitch: number
  newMessages: ChatMessageRepresentation[]
  shownMessages: ChatMessageRepresentation[]
  addingNewMessages: boolean
  cameraPointerLocked: boolean
  hoveringChat: boolean
  chatBox: Box
} = {
  mouseX: 0,
  mouseY: 0,
  messageMenuPositionTop: 0,
  messageMenuTimestamp: 0,
  open: true,
  unreadMessages: 0,
  autoScrollSwitch: 0,
  newMessages: [],
  shownMessages: [],
  addingNewMessages: false,
  cameraPointerLocked: false,
  hoveringChat: false,
  chatBox: { position: { x: 0, y: 0 }, size: { x: 0, y: 0 } }
}

export default class ChatAndLogs {
  constructor() {
    const colorBlack = Color4.Black()
    console.log('colorBlack', colorBlack)
    colorBlack.a = 0.5
    console.log('colorBlack2', colorBlack)
    console.log('Color4.Black()', Color4.Black())

    this.listenMessages().catch(console.error)
    this.listenMouseHover()
    listenSystemAction('Chat', (pressed) => {
      if (pressed) {
        // TODO we should not focus if the input already has the focus, need  a way to check if it's already focused
        focusChatInput()
      }
    })

    initChatMembersCount().catch(console.error)

    store.subscribe((action, previousState: AppState) => {
      if (
        action.type === HUD_ACTION.UPDATE_HUD_STATE &&
        (action as UpdateHudAction).payload.chatOpen &&
        !previousState.hud.chatOpen
      ) {
        state.unreadMessages = 0
        scrollToBottom()
      }
    })
  }

  isOpen(): boolean {
    return store.getState().hud.chatOpen
  }

  getUnreadMessages(): number {
    return state.unreadMessages
  }

  async listenMessages(): Promise<void> {
    const awaitChatStream = async (
      stream: ChatMessageDefinition[]
    ): Promise<void> => {
      for await (const chatMessage of stream) {
        if (chatMessage.message.indexOf('␑') === 0) return
        this.pushMessage(chatMessage).catch(console.error)
        if (!this.isOpen()) {
          state.unreadMessages++
        }
      }
    }

    await awaitChatStream(await BevyApi.getChatStream())
  }

  listenMouseHover(): void {
    PointerLock.onChange(engine.CameraEntity, (pointerLock) => {
      if (!pointerLock) return
      state.cameraPointerLocked = pointerLock.isPointerLocked
    })

    store.subscribe((action) => {
      // TODO check action store / type
      state.chatBox.position.x = store.getState().viewport.width * 0.03
      state.chatBox.position.y = store.getState().viewport.height * 0.2
      state.chatBox.size.x = store.getState().viewport.width * 0.26
      state.chatBox.size.y = store.getState().viewport.height * 0.8
    })

    engine.addSystem(() => {
      const { screenCoordinates } = PrimaryPointerInfo.get(engine.RootEntity)
      state.mouseX = screenCoordinates?.x ?? 0
      state.mouseY = screenCoordinates?.y ?? 0
      if (!screenCoordinates) return
      state.hoveringChat =
        !state.cameraPointerLocked &&
        isVectorInBox(screenCoordinates, state.chatBox)
    })
  }

  async pushMessage(message: ChatMessageDefinition): Promise<void> {
    if (state.shownMessages.length >= BUFFER_SIZE) {
      state.shownMessages.shift()
    }
    const playerData = getPlayer({ userId: message.sender_address })
    const name = isSystemMessage(message)
      ? ``
      : playerData?.name ??
        (await getUserData({ userId: message.sender_address }))?.data
          ?.displayName ??
        `Unknown*`
    const chatMessage: ChatMessageRepresentation = {
      ...message,
      timestamp:
        state.shownMessages[state.shownMessages.length - 1]?.timestamp ===
        Date.now()
          ? Date.now() + 1
          : Date.now(),
      name,
      side: getNextMessageSide(state.shownMessages),
      hasMentionToMe: messageHasMentionToMe(message.message),
      isGuest: playerData ? playerData.isGuest : true
    }

    console.log('chatMessage', chatMessage)

    if (getChatScroll() !== null && (getChatScroll()?.y ?? 0) < 1) {
      state.newMessages.push(chatMessage)
    } else {
      state.shownMessages.push(chatMessage)
      scrollToBottom()
    }

    function getNextMessageSide(
      messages: ChatMessageRepresentation[]
    ): CHAT_SIDE {
      // TODO FIX: this is not working well
      const previousMessage: ChatMessageRepresentation =
        messages[messages.length - 1]

      return isTruthy(previousMessage) &&
        previousMessage.sender_address !== message.sender_address
        ? getSwitchedSide(previousMessage)
        : CHAT_SIDE.RIGHT

      function getSwitchedSide(message: ChatMessageRepresentation): CHAT_SIDE {
        return message.side === CHAT_SIDE.LEFT
          ? CHAT_SIDE.RIGHT
          : CHAT_SIDE.LEFT
      }
    }
  }

  checkScrollToAppendMessages(): void {
    if (
      !state.addingNewMessages &&
      state.newMessages.length &&
      getChatScroll()?.y === 1
    ) {
      state.addingNewMessages = true
      state.shownMessages.push(
        state.newMessages.shift() as ChatMessageRepresentation
      )
      executeTask(async () => {
        await sleep(30)
        state.addingNewMessages = false
      })
    }
  }

  onMessageMenu(timestamp: number): void {
    if (state.messageMenuTimestamp === timestamp) {
      state.messageMenuTimestamp = 0
      return
    }
    state.messageMenuTimestamp = timestamp
    state.messageMenuPositionTop =
      state.mouseY -
      (UiCanvasInformation.getOrNull(engine.RootEntity)?.height ?? 0) * 0.25
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    this.checkScrollToAppendMessages()
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column',
          borderRadius: 10,
          borderColor: COLOR.BLACK_TRANSPARENT,
          borderWidth: 0
        }}
        uiBackground={{
          color: state.hoveringChat
            ? COLOR.DARK_OPACITY_5
            : COLOR.BLACK_TRANSPARENT
        }}
      >
        {state.hoveringChat && HeaderArea()}

        {ChatArea({
          messages: state.shownMessages,
          onMessageMenu: this.onMessageMenu
        })}

        {InputArea()}
        {ShowNewMessages()}
        {MessageSubMenu({ canvasInfo })}
      </UiEntity>
    )
  }
}

function MessageSubMenu({
  canvasInfo
}: {
  canvasInfo: PBUiCanvasInformation
}): ReactElement | null {
  if (!state.messageMenuTimestamp) return null

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: {
          left:
            canvasInfo.width *
            (0.188 +
              (state.shownMessages.find(
                (m) => m.timestamp === state.messageMenuTimestamp
              )?.side ?? 0) *
                0.019),
          top: state.messageMenuPositionTop
        },
        width: canvasInfo.width * 0.1,
        height: '5%',
        flexShrink: 0,
        flexGrow: 1,
        zIndex: 2,
        borderWidth: 0,
        borderRadius: 10,
        borderColor: COLOR.DARK_OPACITY_9,
        padding: '1%'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_9
      }}
    >
      <UiEntity
        uiTransform={{
          borderWidth: 1,
          borderRadius: getCanvasScaleRatio() * 18,
          borderColor: COLOR.MENU_ITEM_BACKGROUND,
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: { left: '2%' }
        }}
        uiBackground={{
          color: COLOR.MENU_ITEM_BACKGROUND
        }}
        onMouseDown={() => {
          try {
            const textToCopy =
              state.shownMessages.find(
                (m) => m.timestamp === state.messageMenuTimestamp
              )?.message ?? ''
            copyToClipboard({
              text: textToCopy
            }).catch(console.error)
          } catch (error) {}

          state.messageMenuTimestamp = 0
        }}
      >
        <Icon
          icon={{ spriteName: 'CopyIcon', atlasName: 'icons' }}
          iconSize={getCanvasScaleRatio() * 32}
        />
        <UiEntity
          uiText={{ value: 'COPY', fontSize: getCanvasScaleRatio() * 32 }}
        />
      </UiEntity>
    </UiEntity>
  )
}

function ShowNewMessages(): ReactElement | null {
  if (!state.newMessages.length) return null
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { right: '-10%', bottom: '6%' },
        borderRadius: 10,
        borderColor: COLOR.BLACK_TRANSPARENT,
        borderWidth: 0,
        height: '10%',
        width: '10%',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_7
      }}
      onMouseDown={scrollToBottom}
    >
      <Label
        value={`+${state.newMessages.length}`}
        fontSize={getCanvasScaleRatio() * 48}
      />
      <Icon
        iconSize={20}
        icon={{ spriteName: 'DownArrow', atlasName: 'icons' }}
      />
    </UiEntity>
  )
}

function HeaderArea(): ReactElement {
  const fontSize = getCanvasScaleRatio() * 48
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: '-5%' },
        width: '100%',
        height: '4%',
        padding: { top: '4%', bottom: '-1%', left: 0, right: 0 },
        justifyContent: 'flex-start',
        flexShrink: 0,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: COLOR.BLACK_TRANSPARENT,
        borderWidth: 1,
        zIndex: 2
      }}
      uiBackground={{
        color: COLOR.TEXT_COLOR
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute',
          position: { top: '70%' },
          zIndex: 2
        }}
        uiBackground={{
          color: COLOR.TEXT_COLOR
        }}
      />
      <Icon
        uiTransform={{ margin: { left: '4%' }, zIndex: 3 }}
        iconSize={28}
        icon={{ spriteName: 'DdlIconColor', atlasName: 'icons' }}
      />
      <Label
        uiTransform={{ zIndex: 3 }}
        value={'Nearby'}
        fontSize={fontSize}
        color={COLOR.INACTIVE}
      />
      <UiEntity
        uiTransform={{
          alignSelf: 'flex-end',
          width: '60%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 3
        }}
      >
        <Icon
          iconSize={getCanvasScaleRatio() * 48}
          icon={{ spriteName: 'Members', atlasName: 'icons' }}
        />
        <Label
          uiTransform={{ position: { left: '-4%' } }}
          value={getChatMembers().length.toString()}
          fontSize={fontSize}
        />
      </UiEntity>
      <UiEntity
        uiTransform={{
          alignSelf: 'flex-end',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 2,
          width: getCanvasScaleRatio() * 64,
          height: getCanvasScaleRatio() * 64,
          position: { top: '60%', right: '1%' },
          borderRadius: 10,
          borderColor: COLOR.BLACK_TRANSPARENT,
          borderWidth: 0
        }}
        uiBackground={{ color: COLOR.DARK_OPACITY_5 }}
        onMouseDown={() => {
          store.dispatch(
            updateHudStateAction({ chatOpen: !store.getState().hud.chatOpen })
          )
        }}
      >
        <Icon
          uiTransform={{
            positionType: 'absolute',
            zIndex: 9,
            position: { top: -5 * getCanvasScaleRatio() }
          }}
          iconSize={getCanvasScaleRatio() * 48}
          icon={{ spriteName: 'DownArrow', atlasName: 'icons' }}
        />
        <Icon
          uiTransform={{
            positionType: 'absolute',
            zIndex: 10,
            position: { top: 5 * getCanvasScaleRatio() }
          }}
          iconSize={getCanvasScaleRatio() * 48}
          icon={{ spriteName: 'DownArrow', atlasName: 'icons' }}
        />
      </UiEntity>
    </UiEntity>
  )
}

function InputArea(): ReactElement | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  const inputFontSize = getCanvasScaleRatio() * 36

  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: canvasInfo.height * 0.05,
        flexGrow: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: {
          top: canvasInfo.height * 0.005,
          bottom: canvasInfo.height * 0.005
        },
        padding: 5
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: { ...Color4.Black(), a: 0.4 }
      }}
    >
      <Input
        uiTransform={{
          elementId: 'chat-input',
          padding: { left: '1%' },
          width: '100%',
          height: '100%',
          alignContent: 'center'
        }}
        textAlign="middle-center"
        fontSize={inputFontSize}
        color={ALMOST_WHITE}
        placeholder="Press ENTER to chat"
        placeholderColor={{ ...ALMOST_WHITE, a: 0.6 }}
        onSubmit={sendChatMessage}
      />
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
        onMouseDown={() => {
          focusChatInput()
        }}
      />
    </UiEntity>
  )
}

const getScrollVector = memoize(_getScrollVector)

function ChatArea({
  messages,
  onMessageMenu
}: {
  messages: ChatMessageRepresentation[]
  onMessageMenu: (timestampKey: number) => void
}): ReactElement {
  const scrollPosition = getScrollVector(
    store.getState().viewport.height * 0.7 - state.autoScrollSwitch
  )

  return (
    <UiEntity
      uiTransform={{
        elementId: 'chat-area',
        width: '100%',
        display: store.getState().hud.chatOpen ? 'flex' : 'none',
        flexDirection: 'column',
        alignSelf: 'flex-end',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: getChatMaxHeight(), // the rest of the sibling in parent container
        overflow: 'scroll',
        scrollVisible: state.hoveringChat ? 'vertical' : 'hidden',
        scrollPosition,
        padding: { left: '3%', right: '8%' }
      }}
    >
      {messages.map((message) => (
        <ChatMessage
          message={message}
          key={message.timestamp}
          onMessageMenu={onMessageMenu}
        />
      ))}
    </UiEntity>
  )
}

function sendChatMessage(value: string): void {
  BevyApi.sendChat(value, 'Nearby')

  executeTask(async () => {
    await sleep(0)
    scrollToBottom()
  })
}

function scrollToBottom(): void {
  state.autoScrollSwitch = state.autoScrollSwitch ? 0 : 1
}

function focusChatInput(): void {
  setUiFocus({ elementId: 'chat-input' }).catch(console.error)
  store.dispatch(updateHudStateAction({ chatOpen: true }))
  scrollToBottom()
}

function _getScrollVector(positionY: number): Vector2 {
  return Vector2.create(0, positionY)
}

function getChatMaxHeight(): number {
  return store.getState().viewport.height * 0.7
}

function getChatScroll(): Vector2 | null {
  const filteredEntities = filterEntitiesWith(
    ([, uiTransformResult]): boolean => {
      return (uiTransformResult as UiTransformProps).elementId === 'chat-area'
    },
    UiTransform,
    UiScrollResult
  )

  const foundEntity = filteredEntities[0]
  if (foundEntity === undefined) return null
  const [, , userScrollPosition] = foundEntity ?? []
  return (userScrollPosition as any).value as Vector2
}

function isVectorInBox(point: Vector2, box: Box): boolean {
  const { x, y } = point
  const { position, size } = box

  return (
    x >= position.x &&
    x <= position.x + size.x &&
    y >= position.y &&
    y <= position.y + size.y
  )
}
export function messageHasMentionToMe(message: string): boolean {
  return message.includes(`@${getPlayer()?.name}`)
}

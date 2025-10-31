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
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { ChatMessage } from '../../../components/chat-message'

import {
  MAX_ZINDEX,
  ONE_ADDRESS,
  ROUNDED_TEXTURE_BACKGROUND,
  ZERO_ADDRESS
} from '../../../utils/constants'
import { BevyApi } from '../../../bevy-api'
import {
  CHAT_SIDE,
  type ChatMessageDefinition,
  type ChatMessageRepresentation,
  MESSAGE_TYPE
} from '../../../components/chat-message/ChatMessage.types'
import {
  memoize,
  memoizeFirstArg,
  setIfNot
} from '../../../utils/function-utils'
import { getViewportHeight } from '../../../service/canvas-ratio'
import { listenSystemAction } from '../../../service/system-actions-emitter'
import {
  changeRealm,
  copyToClipboard,
  setUiFocus,
  teleportTo
} from '~system/RestrictedActions'
import {
  decorateMessageWithLinks,
  isSystemMessage,
  NAME_MENTION_REGEXP
} from '../../../components/chat-message/ChatMessage'
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
import { type PermissionUsed } from '../../../bevy-api/permission-definitions'
import { Checkbox } from '../../../components/checkbox'
import { VIEWPORT_ACTION } from '../../../state/viewport/actions'
import { ChatInput } from './chat-input'
import { getPlayersInScene } from '~system/Players'
import { getHudFontSize } from '../scene-info/SceneInfo'
import { cleanMapPlaces } from '../../../service/map-places'
import { fetchProfileData } from '../../../utils/passport-promise-utils'
import { getHudBarWidth, getUnsafeAreaWidth } from '../MainHud'
import { ChatMentionSuggestions } from './chat-mention-suggestions'
import {
  type ComposedPlayerData,
  namedUsersData
} from './named-users-data-service'

type Box = {
  position: { x: number; y: number }
  size: { x: number; y: number }
}

const BUFFER_SIZE = 40
const CHAT_WORLD_REGEXP = /^\/changerealm\s[\w.]+\.eth\s*$/
const state: {
  mouseX: number
  mouseY: number
  messageMenuPositionTop: number
  messageMenuTimestamp: number
  unreadMessages: number
  autoScrollSwitch: number
  newMessages: ChatMessageRepresentation[]
  shownMessages: ChatMessageRepresentation[]
  addingNewMessages: boolean
  cameraPointerLocked: boolean
  hoveringChat: boolean
  chatBox: Box
  inputFontSizeWorkaround: boolean
  headerMenuOpen: boolean
  filterMessages: {
    [MESSAGE_TYPE.USER]: boolean
    [MESSAGE_TYPE.SYSTEM]: boolean
    [MESSAGE_TYPE.SYSTEM_FEEDBACK]: boolean
  }
} = {
  mouseX: 0,
  mouseY: 0,
  messageMenuPositionTop: 0,
  messageMenuTimestamp: 0,
  unreadMessages: 0,
  autoScrollSwitch: 0,
  newMessages: [],
  shownMessages: [],
  addingNewMessages: false,
  cameraPointerLocked: false,
  hoveringChat: false,
  chatBox: { position: { x: 0, y: 0 }, size: { x: 0, y: 0 } },
  inputFontSizeWorkaround: false,
  headerMenuOpen: false,
  filterMessages: {
    [MESSAGE_TYPE.USER]: false,
    [MESSAGE_TYPE.SYSTEM]: true,
    [MESSAGE_TYPE.SYSTEM_FEEDBACK]: false
  }
}

export default class ChatAndLogs {
  pushMessage = pushMessage
  constructor() {
    this.listenMessages().catch(console.error)
    this.listenMouseHover()
    listenSystemAction('Chat', (pressed) => {
      if (pressed) {
        focusChatInput(true)
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

    // state.inputFontSizeWorkaround = true
    executeTask(async () => {
      // TODO on initialization, chat input doesn't apply the defined fontSize unless we show it with delay or we resize window
      await sleep(100)
      state.inputFontSizeWorkaround = true
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

    const awaitUsedPermissionStream = async (
      stream: PermissionUsed[]
    ): Promise<void> => {
      for await (const usedPermission of stream) {
        const sceneName =
          (await BevyApi.liveSceneInfo()).find(
            (s) => s.hash === usedPermission.scene
          )?.title || 'Unknown Scene'
        const usedPermissionMessage: ChatMessageDefinition = {
          sender_address: ZERO_ADDRESS,
          channel: 'Nearby',
          message: `"${sceneName}" scene ${
            usedPermission.wasAllowed ? 'allowed' : 'denied'
          } permission "${usedPermission.ty}" ${
            usedPermission.additional ? `(${usedPermission.additional})` : ''
          }`
        }
        this.pushMessage(usedPermissionMessage).catch(console.error)
      }
    }

    awaitChatStream(await BevyApi.getChatStream()).catch(console.error)
    awaitUsedPermissionStream(await BevyApi.getPermissionUsedStream()).catch(
      console.error
    )
  }

  listenMouseHover(): void {
    PointerLock.onChange(engine.CameraEntity, (pointerLock) => {
      if (!pointerLock) return
      state.cameraPointerLocked = pointerLock.isPointerLocked
    })

    store.subscribe((action) => {
      const SAFE_SUBMENU = 1.05
      if (action.type === VIEWPORT_ACTION.UPDATE_VIEWPORT) {
        state.chatBox.position.x = getHudBarWidth()
        state.chatBox.position.y = 0
        state.chatBox.size.x =
          (getUnsafeAreaWidth() - getHudBarWidth()) * SAFE_SUBMENU
        state.chatBox.size.y = store.getState().viewport.height
      }
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
      (UiCanvasInformation.getOrNull(engine.RootEntity)?.height ?? 0) * 0.39
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
}): ReactElement[] | null {
  const fontSize = getHudFontSize(getViewportHeight()).NORMAL
  if (!state.messageMenuTimestamp) return null

  return [
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: '-100%', left: '-100%' },
        width: canvasInfo.width * 2,
        height: canvasInfo.height * 2,
        zIndex: MAX_ZINDEX - 2
      }}
      uiBackground={{
        color: COLOR.BLACK_TRANSPARENT
      }}
      onMouseDown={() => {
        state.messageMenuTimestamp = 0
      }}
    />,
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: {
          left:
            canvasInfo.height *
            (0.3 +
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
        zIndex: MAX_ZINDEX - 1,
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
          borderRadius: fontSize,
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
          iconSize={fontSize}
        />
        <UiEntity
          uiText={{
            value: 'COPY',
            fontSize: getHudFontSize(getViewportHeight()).NORMAL
          }}
        />
      </UiEntity>
    </UiEntity>
  ]
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
        fontSize={getHudFontSize(getViewportHeight()).NORMAL}
      />
      <Icon
        iconSize={20}
        icon={{ spriteName: 'DownArrow', atlasName: 'icons' }}
      />
    </UiEntity>
  )
}

function HeaderArea(): ReactElement {
  const fontSize = getHudFontSize(getViewportHeight()).NORMAL

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
        borderRadius: fontSize,
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
        uiTransform={{ margin: { left: '4%' }, zIndex: 3, flexShrink: 0 }}
        iconSize={fontSize * 1.5}
        icon={{ spriteName: 'DdlIconColor', atlasName: 'icons' }}
      />
      <Label
        uiTransform={{
          zIndex: 3,
          width: '100%'
        }}
        textAlign={'top-left'}
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
          iconSize={fontSize}
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
          alignSelf: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 2,
          width: fontSize * 2,
          height: fontSize * 2,
          flexShrink: 0,
          margin: { right: '2%' }
        }}
        uiBackground={{ color: COLOR.TEXT_COLOR }}
      >
        <Icon
          uiTransform={{
            zIndex: 10,
            positionType: 'absolute',
            position: { top: '20%' }
          }}
          iconSize={fontSize * 1.2}
          icon={{ spriteName: 'Menu', atlasName: 'icons' }}
          onMouseDown={() => {
            state.headerMenuOpen = !state.headerMenuOpen

            if (state.headerMenuOpen) {
              state.chatBox.size.x =
                store.getState().viewport.width * 0.26 +
                (state.headerMenuOpen
                  ? store.getState().viewport.width * 0.12
                  : 0)
            }
          }}
        />
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { left: '220%', top: '50%' },
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
            alignSelf: 'flex-start',
            padding: '10%',
            opacity: state.headerMenuOpen ? 1 : 0
          }}
          uiBackground={{
            color: state.headerMenuOpen
              ? COLOR.DARK_OPACITY_5
              : COLOR.BLACK_TRANSPARENT
          }}
        >
          <Checkbox
            uiTransform={{
              alignSelf: 'flex-start'
            }}
            onChange={(value) => {
              state.filterMessages[MESSAGE_TYPE.USER] = !value
              scrollToBottom()
            }}
            value={!state.filterMessages[MESSAGE_TYPE.USER]}
            label={'Show user messages'}
          />
          <Checkbox
            uiTransform={{
              alignSelf: 'flex-start'
            }}
            onChange={(value) => {
              state.filterMessages[MESSAGE_TYPE.SYSTEM] = !value
              scrollToBottom()
            }}
            value={!state.filterMessages[MESSAGE_TYPE.SYSTEM]}
            label={'Show engine messages'}
          />
          <Checkbox
            uiTransform={{
              alignSelf: 'flex-start'
            }}
            onChange={(value) => {
              state.filterMessages[MESSAGE_TYPE.SYSTEM_FEEDBACK] = !value
              scrollToBottom()
            }}
            value={!state.filterMessages[MESSAGE_TYPE.SYSTEM_FEEDBACK]}
            label={'Show system messages'}
          />
        </UiEntity>
      </UiEntity>
      <UiEntity
        uiTransform={{
          alignSelf: 'flex-end',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 2,
          width: fontSize * 2,
          height: fontSize * 2,
          position: { top: '50%', right: '1%' },
          padding: '3%',
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
            position: { top: -0.15 * fontSize }
          }}
          iconSize={fontSize * 1.5}
          icon={{ spriteName: 'DownArrow', atlasName: 'icons' }}
        />
        <Icon
          uiTransform={{
            positionType: 'absolute',
            zIndex: 10,
            position: { top: 0.15 * fontSize }
          }}
          iconSize={fontSize * 1.5}
          icon={{ spriteName: 'DownArrow', atlasName: 'icons' }}
        />
      </UiEntity>
    </UiEntity>
  )
}

function InputArea(): ReactElement {
  const inputFontSize = getHudFontSize(getViewportHeight()).NORMAL

  return (
    <UiEntity
      uiTransform={{
        width: '96%',
        alignSelf: 'center',
        height: inputFontSize * 2,
        flexGrow: 0,
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: {
          top: store.getState().viewport.height * 0.005,
          bottom: store.getState().viewport.height * 0.005
        },
        position: { bottom: inputFontSize * 0.1 },
        padding: inputFontSize * 0.4
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: { ...Color4.Black(), a: 0.4 }
      }}
    >
      <ChatMentionSuggestions />
      {state.inputFontSizeWorkaround && (
        <ChatInput inputFontSize={inputFontSize} onSubmit={sendChatMessage} />
      )}
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
          key={message.id ?? message.timestamp}
          onMessageMenu={onMessageMenu}
        />
      ))}
    </UiEntity>
  )
}

function sendChatMessage(value: string): void {
  try {
    if (value?.trim()) {
      if (value.startsWith('/goto')) {
        executeTask(async () => {
          const [, coords] = value.trim().split(' ')
          const [x, y] = coords.split(',')

          if (!isNaN(Number(x)) && !isNaN(Number(y))) {
            await teleportTo({
              worldCoordinates: { x: Number(x), y: Number(y) }
            })
          } else if (x && !y) {
            const { acceptingUsers } = await fetch(
              `https://worlds-content-server.decentraland.org/world/${x}/about`
            ).then(async (res) => await res.json())

            if (acceptingUsers) {
              await changeRealm({
                realm: x
              })
            } else {
              pushMessage({
                message: `Invalid world name <b>${x}</b>`,
                sender_address: ONE_ADDRESS,
                channel: 'Nearby'
              }).catch(console.error)
            }
          }
        })
      } else if (value.startsWith('/help')) {
        pushMessage({
          message: `
<b>/help</b> - show this help message
<b>/goto</b> x,y - teleport to world x,y
<b>/goto</b> world_name.dcl.eth - teleport to realm world_name.dcl.eth
<b>/reload</b> - reloads the current scene`,
          sender_address: ONE_ADDRESS,
          channel: 'Nearby'
        }).catch(console.error)
      } else {
        BevyApi.sendChat(value, 'Nearby')
      }
    }

    if (value.startsWith('/')) {
      executeTask(async () => {
        await sleep(0)
        setUiFocus({ elementId: '' }).catch(console.error)
      })
    }

    executeTask(async () => {
      await sleep(0)
      scrollToBottom()
    })
  } catch (error: any) {
    pushMessage({
      sender_address: ONE_ADDRESS,
      message: `Error: ${error}`,
      channel: 'Nearby'
    }).catch(console.error)
    console.error('sendChatMessage error', error)
  }
}

function scrollToBottom(): void {
  state.autoScrollSwitch = state.autoScrollSwitch ? 0 : 1
}

export function focusChatInput(uiFocus: boolean = false): void {
  try {
    if (uiFocus) setUiFocus({ elementId: 'chat-input' }).catch(console.error)
    store.dispatch(updateHudStateAction({ chatOpen: true }))
    scrollToBottom()
  } catch (error) {
    console.error('focusChatInput error', error)
  }
}

function _getScrollVector(positionY: number): Vector2 {
  return Vector2.create(0, positionY)
}

function getChatMaxHeight(): number {
  if (store.getState().hud.minimapOpen) {
    return getViewportHeight() * 0.58
  } else {
    return getViewportHeight() * 0.83
  }
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
  return (
    message
      .toLowerCase()
      .includes(
        getNameWithHashPostfix(
          getPlayer()?.name ?? '',
          getPlayer()?.userId ?? ''
        )?.toLowerCase() ?? ''
      ) || message.toLowerCase().includes(getPlayer()?.name ?? '')
  )
}

const _getNameWithHashPostfix = (
  name: string,
  address: string
): `${string}#${string}` => {
  return `${name}#${address
    .substring(address.length - 4, address.length)
    .toLowerCase()}`
}

export const getNameWithHashPostfix: (
  n: string,
  address: string
) => `${string}#${string}` | undefined = memoizeFirstArg(
  _getNameWithHashPostfix
)

async function pushMessage(message: ChatMessageDefinition): Promise<void> {
  console.log('pushMessage', JSON.stringify(message))
  const messageType = isSystemMessage(message)
    ? message.sender_address === ZERO_ADDRESS
      ? MESSAGE_TYPE.SYSTEM
      : MESSAGE_TYPE.SYSTEM_FEEDBACK
    : MESSAGE_TYPE.USER
  if (state.filterMessages[messageType]) {
    return
  }

  if (state.shownMessages.length >= BUFFER_SIZE) {
    state.shownMessages.shift()
  }

  // El profileData de todos los usuarios mencionados : PROBLEM ?

  const playerData = getPlayer({ userId: message.sender_address })

  const now = Date.now()
  const timestamp =
    state.shownMessages[state.shownMessages.length - 1]?.timestamp === now
      ? state.shownMessages[state.shownMessages.length - 1]?.timestamp + 1
      : now

  const decoratedChatMessage: ChatMessageRepresentation = {
    ...message,
    _originalMessage: message.message,
    id: Math.random(),
    timestamp,
    name: isSystemMessage(message)
      ? getSystemName(message.sender_address)
      : getNameWithHashPostfix(
          playerData?.name || `Unknown*`,
          message.sender_address
        ) ?? '',
    side:
      message.sender_address === getPlayer()?.userId
        ? CHAT_SIDE.RIGHT
        : CHAT_SIDE.LEFT,
    hasMentionToMe: messageHasMentionToMe(message.message),
    isGuest: playerData ? playerData.isGuest : true,
    messageType,
    player: getPlayer({ userId: message.sender_address }),
    message: decorateMessageWithLinks(message.message),
    mentionedPlayers: {}
  }

  decorateAsyncMessageData(decoratedChatMessage).catch(console.error)

  if (getChatScroll() !== null && (getChatScroll()?.y ?? 0) < 1) {
    state.newMessages.push(decoratedChatMessage)
  } else {
    state.shownMessages.push(decoratedChatMessage)
    scrollToBottom()
  }

  if (CHAT_WORLD_REGEXP.test(message.message)) {
    cleanMapPlaces()
  }

  async function decorateAsyncMessageData(
    message: ChatMessageRepresentation
  ): Promise<void> {
    extendMessageMentionedUsers(message).catch(console.error)
  }
}

function getSystemName(address: string): string {
  if (address === ONE_ADDRESS) return ''
  if (address === ZERO_ADDRESS) return ''
  return ''
}

async function extendMessageMentionedUsers(
  message: ChatMessageRepresentation
): Promise<void> {
  const mentionMatches = message._originalMessage.match(NAME_MENTION_REGEXP)
  const mentionMatchesAndSenderName = [
    ...(mentionMatches ?? []),
    message.name.split('#')[0]
  ]

  const playersInScene = (await getPlayersInScene({})).players.map(
    ({ userId }) => getPlayer({ userId })
  )

  for (const mentionMatchOrSenderName of mentionMatchesAndSenderName ?? []) {
    const nameKey = mentionMatchOrSenderName.replace('@', '').toLowerCase()
    setIfNot(namedUsersData).get(nameKey)

    playersInScene.forEach((player) => {
      if (
        player !== undefined &&
        nameKey ===
          (getNameWithHashPostfix(
            player?.name ?? '',
            player?.userId ?? ''
          )?.toLowerCase() ?? '')
      ) {
        const namedUserData = namedUsersData.get(nameKey)
        if (namedUserData !== undefined) {
          namedUserData.playerData = getPlayer({
            userId: player?.userId ?? ''
          })
          namedUsersData.set(
            getNameWithHashPostfix(
              player?.name ?? '',
              player?.userId ?? ''
            )?.toLowerCase() ?? '',
            namedUsersData.get(nameKey) as ComposedPlayerData
          )
          checkProfileData()
        }
      } else if (
        player !== undefined &&
        nameKey === player?.name.toLowerCase()
      ) {
        const composePlayerData = setIfNot(namedUsersData).get(nameKey)
        composePlayerData.playerData = player

        checkProfileData()
      }
      function checkProfileData(): void {
        const composePlayerData = setIfNot(namedUsersData).get(nameKey)
        if (setIfNot(namedUsersData).get(nameKey).profileData) {
          decorateMessageNameAndLinks(message, composePlayerData)
        } else {
          executeTask(async () => {
            composePlayerData.profileData = await fetchProfileData({
              userId: player?.userId ?? '',
              useCache: true
            })
            decorateMessageNameAndLinks(message, composePlayerData)
            console.log('decoratedMessageAsync', message)
          })
        }
      }
      function decorateMessageNameAndLinks(
        message: ChatMessageRepresentation,
        composeData: ComposedPlayerData
      ): void {
        const [avatarData] = composeData.profileData?.avatars ?? []
        if (
          message.name ===
            getNameWithHashPostfix(
              composeData.playerData?.name ?? '',
              composeData.playerData?.userId ?? ''
            ) &&
          avatarData.hasClaimedName
        ) {
          message.name = message.name.split('#')[0]
        }
        message.message = decorateMessageWithLinks(message._originalMessage)
      }
    })
  }

  message.message = decorateMessageWithLinks(message._originalMessage)
}

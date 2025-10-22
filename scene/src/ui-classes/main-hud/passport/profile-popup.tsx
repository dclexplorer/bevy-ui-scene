import type { Popup } from '../../../components/popup-stack'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import { getContentScaleRatio } from '../../../service/canvas-ratio'
import {
  BORDER_RADIUS_F,
  getBackgroundFromAtlas
} from '../../../utils/ui-utils'
import { noop } from '../../../utils/function-utils'
import { store } from '../../../state/store'
import {
  closeLastPopupAction,
  pushPopupAction,
  updateHudStateAction
} from '../../../state/hud/actions'
import { AvatarCircle } from '../../../components/avatar-circle'
import { getPlayer } from '@dcl/sdk/src/players'
import { getAddressColor } from '../chat-and-logs/ColorByAddress'
import { Row } from '../../../components/layout'
import { applyMiddleEllipsis } from '../../../utils/urn-utils'
import { CopyButton } from '../../../components/copy-button'
import { ButtonTextIcon } from '../../../components/button-text-icon'
import { BottomBorder } from '../../../components/bottom-border'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'
import { type GetPlayerDataRes } from '../../../utils/definitions'
import { createOrGetAvatarsTracker } from '../../../service/avatar-tracker'
import {
  engine,
  executeTask,
  PointerLock,
  PrimaryPointerInfo
} from '@dcl/sdk/ecs'
import useEffect = ReactEcs.useEffect
import useState = ReactEcs.useState
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import { focusChatInput } from '../chat-and-logs/ChatsAndLogs'
import { sleep } from '../../../utils/dcl-utils'

export function setupProfilePopups(): void {
  const avatarTracker = createOrGetAvatarsTracker()
  avatarTracker.onClick((userId) => {
    if (!getPlayer({ userId })?.isGuest) {
      // TODO AvatarModifierType.AMT_DISABLE_PASSPORTS

      PointerLock.getMutable(engine.CameraEntity).isPointerLocked = false
      store.dispatch(
        pushPopupAction({
          type: HUD_POPUP_TYPE.PROFILE_MENU,
          data: { player: getPlayer({ userId }) }
        })
      )
    }
  })
}

export const ProfileMenuPopup: Popup = ({ shownPopup }) => {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        zIndex: 999,
        width: '100%',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: { left: '4.1%', top: '0.5%' }
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_2
      }}
      onMouseDown={() => {
        closeDialog()
      }}
    >
      <ProfileContent
        data={
          shownPopup.data as {
            align: string
            userId: string
          }
        }
      />
    </UiEntity>
  )
}

function ProfileContent({
  data
}: {
  data: { align?: string; player?: GetPlayerDataRes }
}): ReactElement | null {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const width = getContentScaleRatio() * 800
  const player = data.player
  useEffect(() => {
    console.log('data', data)
    if (!player) {
      closeDialog()
      return
    }
    if (data.align === 'left') {
      setCoords({
        x: store.getState().viewport.width * 0.045,
        y: store.getState().viewport.height * 0.018
      })
    } else if (data.align === 'right') {
      setCoords({
        x:
          store.getState().viewport.width -
          width -
          store.getState().viewport.width * 0.01,
        y: store.getState().viewport.height * 0.07
      })
    } else {
      const { screenCoordinates } = PrimaryPointerInfo.get(engine.RootEntity)
      const isOnHalfRightOfScreen =
        (screenCoordinates?.x ?? 0) > store.getState().viewport.width / 2
      const isOnHalfBottomOfScreen =
        (screenCoordinates?.y ?? 0) > store.getState().viewport.height / 2

      setCoords({
        x: isOnHalfRightOfScreen
          ? (screenCoordinates?.x ?? 0) - width
          : screenCoordinates?.x ?? 0,
        y: isOnHalfBottomOfScreen
          ? (screenCoordinates?.y ?? 0) - getContentScaleRatio() * 400
          : screenCoordinates?.y ?? 0
      })
    }
  }, [])

  if (!player || coords.x === 0) return null
  return (
    <UiEntity
      uiTransform={{
        width,
        borderRadius: BORDER_RADIUS_F,
        borderWidth: 0,
        borderColor: COLOR.TEXT_COLOR,
        flexDirection: 'column',
        padding: 0,
        positionType: 'absolute',
        position: {
          left: coords.x,
          top: coords.y
        }
      }}
      onMouseDown={noop}
      uiBackground={{
        color: COLOR.BLACK_POPUP_BACKGROUND
      }}
    >
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: '100%',
          margin: { top: '5%' }
        }}
      >
        {ProfileHeader({ player })}
        <Row uiTransform={{ margin: { top: '5%' } }}>
          <BottomBorder
            color={COLOR.WHITE_OPACITY_1}
            uiTransform={{ height: 1 }}
          />
        </Row>
        {player.userId !== getPlayer()?.userId
          ? ProfileButtons({ player })
          : null}
        {/* // TODO Exit / Sign out : OwnProfileButtons({player}) */}
      </UiEntity>
    </UiEntity>
  )
}

function ProfileHeader({
  player
}: {
  player: GetPlayerDataRes
}): ReactElement[] {
  const hasClaimedName = !!(player.name?.length && player.name?.includes('#'))
  return [
    <AvatarCircle
      userId={player.userId}
      circleColor={getAddressColor(player.userId)}
      uiTransform={{
        width: getContentScaleRatio() * 200,
        height: getContentScaleRatio() * 200,
        alignSelf: 'center'
      }}
      isGuest={player.isGuest}
    />,
    <Row
      uiTransform={{
        justifyContent: 'center',
        width: '100%',
        margin: 0,
        padding: 0
      }}
    >
      <UiEntity
        uiTransform={{ margin: 0, padding: 0 }}
        uiText={{
          value: `<b>${player.name}</b>`,
          color: getAddressColor(player.userId),
          fontSize: getContentScaleRatio() * 48
        }}
      />
      {hasClaimedName && (
        <UiEntity
          uiTransform={{
            width: getContentScaleRatio() * 50,
            height: getContentScaleRatio() * 50,
            flexShrink: 0,
            alignSelf: 'center'
          }}
          uiBackground={getBackgroundFromAtlas({
            atlasName: 'icons',
            spriteName: 'Verified'
          })}
        />
      )}
      <CopyButton
        fontSize={getContentScaleRatio() * 42}
        text={player.name}
        elementId={'copy-profile-name-' + player.userId}
        uiTransform={{
          margin: { left: 0 }
        }}
      />
    </Row>,
    ...(!player.isGuest
      ? [
          <Row
            uiTransform={{
              justifyContent: 'center',
              height: getContentScaleRatio() * 36
            }}
          >
            <UiEntity
              uiText={{
                value: applyMiddleEllipsis(player.userId),
                color: COLOR.TEXT_COLOR_LIGHT_GREY,
                fontSize: getContentScaleRatio() * 38
              }}
            />
            <CopyButton
              fontSize={getContentScaleRatio() * 42}
              text={player.userId}
              elementId={'copy-profile-address-' + player.userId}
              uiTransform={{
                margin: { left: 0 }
              }}
            />
          </Row>,
          <UiEntity
            uiTransform={{
              width: '80%',
              borderColor: COLOR.WHITE_OPACITY_1,
              borderWidth: getContentScaleRatio() * 6,
              borderRadius: getContentScaleRatio() * 20,
              alignSelf: 'center',
              margin: { top: '4%' }
            }}
            uiText={{
              value: 'VIEW PASSPORT',
              fontSize: getContentScaleRatio() * 42
            }}
            onMouseDown={() => {
              closeDialog()
              store.dispatch(
                pushPopupAction({
                  type: HUD_POPUP_TYPE.PASSPORT,
                  data: player.userId
                })
              )
            }}
          />
        ]
      : [])
  ]
}

const PROFILE_BUTTON_TRANSFORM: UiTransformProps = {
  width: '80%',
  height: getContentScaleRatio() * 64,
  justifyContent: 'flex-start',
  alignSelf: 'center'
}
function ProfileButtons({
  player
}: {
  player: GetPlayerDataRes
}): ReactElement[] {
  return [
    <ButtonTextIcon
      uiTransform={PROFILE_BUTTON_TRANSFORM}
      value={'<b>Mention</b>'}
      onMouseDown={() => {
        executeTask(async () => {
          closeDialog()
          store.dispatch(
            updateHudStateAction({
              chatInput: store.getState().hud.chatInput + ` @${player.name} `
            })
          )
          await sleep(100)
          focusChatInput(true)
        })
      }}
      icon={{
        atlasName: 'icons',
        spriteName: '@'
      }}
      fontSize={getContentScaleRatio() * 42}
    />
  ]
}

function closeDialog(): void {
  store.dispatch(closeLastPopupAction())
}

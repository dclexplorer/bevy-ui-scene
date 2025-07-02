import type { Popup } from '../../../components/popup-stack'
import ReactEcs, { Button, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import {
  BORDER_RADIUS_F,
  getBackgroundFromAtlas
} from '../../../utils/ui-utils'
import { noop } from '../../../utils/function-utils'
import { store } from '../../../state/store'
import {
  closeLastPopupAction,
  pushPopupAction
} from '../../../state/hud/actions'
import { AvatarCircle } from '../../../components/avatar-circle'
import { getPlayer } from '@dcl/sdk/src/players'
import { getAddressColor } from '../chat-and-logs/ColorByAddress'
import { Row } from '../../../components/layout'
import { applyMiddleEllipsis } from '../../../utils/urn-utils'
import { CopyButton } from '../../../components/copy-button'
import { ButtonTextIcon } from '../../../components/button-text-icon'
import { Color4 } from '@dcl/sdk/math'
import { BottomBorder, TopBorder } from '../../../components/bottom-border'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'
import { logout } from '../../../controllers/ui.controller'

export const ProfileMenuPopup: Popup = ({ shownPopup }) => {
  if (!getPlayer()) return null
  const profileData = store.getState().hud?.profileData
  if (!profileData) return null

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
      <UiEntity
        uiTransform={{
          width: getCanvasScaleRatio() * 1200,
          height: getCanvasScaleRatio() * 1049,
          borderRadius: BORDER_RADIUS_F,
          borderWidth: 0,
          borderColor: COLOR.TEXT_COLOR,
          alignItems: 'center',
          flexDirection: 'column',
          padding: 0,
          positionType: shownPopup.data === 'right' ? 'absolute' : undefined,
          position: {
            right: shownPopup.data === 'right' ? '4%' : undefined,
            top: shownPopup.data === 'right' ? '7%' : undefined
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
          <AvatarCircle
            userId={getPlayer()?.userId as string}
            circleColor={getAddressColor(getPlayer()?.userId as string)}
            uiTransform={{
              width: getCanvasScaleRatio() * 200,
              height: getCanvasScaleRatio() * 200,
              alignSelf: 'center'
            }}
            isGuest={!!getPlayer()?.isGuest}
          />
          <Row uiTransform={{ justifyContent: 'center', width: '100%' }}>
            <UiEntity
              uiText={{
                value: `<b>${getPlayer()?.name}</b>`,
                color: getAddressColor(getPlayer()?.userId as string),
                fontSize: getCanvasScaleRatio() * 48
              }}
            />
            {profileData.hasClaimedName && (
              <UiEntity
                uiTransform={{
                  width: getCanvasScaleRatio() * 50,
                  height: getCanvasScaleRatio() * 50,
                  flexShrink: 0,
                  alignSelf: 'center'
                }}
                uiBackground={getBackgroundFromAtlas({
                  atlasName: 'icons',
                  spriteName: 'Verified'
                })}
              />
            )}
          </Row>
          <UiEntity
            uiText={{
              value: 'WALLET ADDRESS',
              color: COLOR.TEXT_COLOR_GREY,
              fontSize: getCanvasScaleRatio() * 38
            }}
          />
          <Row
            uiTransform={{
              justifyContent: 'center'
            }}
          >
            <UiEntity
              uiText={{
                value: applyMiddleEllipsis(getPlayer()?.userId as string),
                color: COLOR.TEXT_COLOR_LIGHT_GREY,
                fontSize: getCanvasScaleRatio() * 38
              }}
            />
            <CopyButton
              fontSize={getCanvasScaleRatio() * 42}
              text={getPlayer()?.userId as string}
              elementId={'copy-profile-address'}
              uiTransform={{
                margin: { left: 0 }
              }}
            />
          </Row>
          <UiEntity
            uiTransform={{
              width: '80%',
              borderColor: COLOR.WHITE_OPACITY_1,
              borderWidth: getCanvasScaleRatio() * 6,
              borderRadius: getCanvasScaleRatio() * 20,
              alignSelf: 'center',
              margin: { top: '4%' }
            }}
            uiText={{
              value: 'VIEW PROFILE',
              fontSize: getCanvasScaleRatio() * 52
            }}
            onMouseDown={() => {
              closeDialog()
              store.dispatch(
                pushPopupAction({
                  type: HUD_POPUP_TYPE.PASSPORT,
                  data: getPlayer()?.userId
                })
              )
            }}
          />
          <Row uiTransform={{ margin: { top: '5%' } }}>
            <BottomBorder color={COLOR.WHITE_OPACITY_1} />
          </Row>
          <ButtonTextIcon
            onMouseDown={() => {
              closeDialog()
              logout()
            }}
            uiTransform={{
              width: '80%',
              height: getCanvasScaleRatio() * 150,
              justifyContent: 'flex-start',
              alignSelf: 'center'
            }}
            value={'<b>SIGN OUT</b>'}
            fontSize={getCanvasScaleRatio() * 48}
            icon={{
              atlasName: 'icons',
              spriteName: 'LogoutIcon'
            }}
          />

          <ButtonTextIcon
            onMouseDown={() => {
              // TODO BevyApi.exit() ?
            }}
            uiTransform={{
              width: '80%',
              height: getCanvasScaleRatio() * 150,
              justifyContent: 'flex-start',
              alignSelf: 'center'
            }}
            value={'<b>EXIT</b>'}
            fontSize={getCanvasScaleRatio() * 48}
            icon={{
              atlasName: 'icons',
              spriteName: 'ExitIcn'
            }}
            fontColor={Color4.Red()}
            iconColor={Color4.Red()}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}

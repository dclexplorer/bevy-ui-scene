import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { store } from '../state/store'
import { HUD_POPUP_TYPE, type HUDPopup } from '../state/hud/state'
import { PopupUrl } from '../ui-classes/main-hud/popup-url'
import { PopupPassport } from '../ui-classes/main-hud/passport/popup-passport'
import { NameEditPopup } from '../ui-classes/main-hud/passport/name-edit-popup'
import { AddProfileLinkPopup } from '../ui-classes/main-hud/passport/add-profile-link-popup'
import { ProfileMenuPopup } from '../ui-classes/main-hud/passport/profile-popup'
import { ErrorPopup } from '../ui-classes/main-hud/error-popup'
import { NotificationsMenu } from '../ui-classes/main-hud/notifications-menu'
import { PermissionRequestPopup } from '../ui-classes/main-hud/permissions-popups/permission-request-popup'

export type PopupParameters = { shownPopup: HUDPopup }
export type Popup = (
  params: PopupParameters
) => ReactElement | null | ReactElement[]

const popupComponents: Record<number, Popup> = {
  [HUD_POPUP_TYPE.URL as number]: PopupUrl,
  [HUD_POPUP_TYPE.TELEPORT as number]: PopupUrl, // TODO
  [HUD_POPUP_TYPE.PASSPORT as number]: PopupPassport,
  [HUD_POPUP_TYPE.NAME_EDIT as number]: NameEditPopup,
  [HUD_POPUP_TYPE.ADD_LINK as number]: AddProfileLinkPopup,
  [HUD_POPUP_TYPE.PROFILE_MENU as number]: ProfileMenuPopup,
  [HUD_POPUP_TYPE.ERROR as number]: ErrorPopup,
  [HUD_POPUP_TYPE.NOTIFICATIONS_MENU as number]: NotificationsMenu,
  [HUD_POPUP_TYPE.PERMISSION_REQUEST as number]: PermissionRequestPopup
}

export function PopupStack(): ReactElement | null {
  const shownPopups = store.getState().hud.shownPopups
  if (!shownPopups.length) return null
  return (
    <UiEntity uiTransform={{ zIndex: 99999, width: '100%', height: '100%' }}>
      {shownPopups.map(
        (shownPopup: HUDPopup) =>
          popupComponents[shownPopup.type]({ shownPopup }) as ReactElement
      )}
    </UiEntity>
  )
}

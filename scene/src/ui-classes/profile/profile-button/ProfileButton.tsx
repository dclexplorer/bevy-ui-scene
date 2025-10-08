import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { ReactElement } from '@dcl/react-ecs'
import { Row } from '../../../components/layout'
import { AvatarCircle } from '../../../components/avatar-circle'
import { getAddressColor } from '../../main-hud/chat-and-logs/ColorByAddress'
import { getViewportHeight } from '../../../service/canvas-ratio'
import { getPlayer } from '@dcl/sdk/players'
import { getMainMenuHeight } from '../../main-menu/MainMenu'
import { getHudFontSize } from '../../main-hud/scene-info/SceneInfo'
import { COLOR } from '../../../components/color-palette'
import { Color4 } from '@dcl/sdk/math'
import { store } from '../../../state/store'
import { pushPopupAction } from '../../../state/hud/actions'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'
const LIGHT_TRANSPARENT = Color4.create(1, 1, 1, 0.03)
export function ProfileButton(): ReactElement | null {
  const player = getPlayer()
  const avatarSize = getMainMenuHeight() * 0.7

  if (!player) return null

  const showProfilePopup = () => {
    store.dispatch(
      pushPopupAction({
        type: HUD_POPUP_TYPE.PROFILE_MENU,
        data: {
          player
        }
      })
    )
  }
  return (
    <Row
      uiTransform={{
        borderRadius: 999,
        height: avatarSize * 1.1
      }}
      uiBackground={{
        color: LIGHT_TRANSPARENT
      }}
      onMouseDown={() => showProfilePopup()}
    >
      <AvatarCircle
        userId={player.userId}
        circleColor={getAddressColor(player.userId)}
        uiTransform={{
          width: avatarSize,
          height: avatarSize,
          position: { left: avatarSize * 0.1 },
          borderWidth: avatarSize * 0.05
        }}
        isGuest={player.isGuest}
        onMouseDown={() => showProfilePopup()}
      />
      <UiEntity
        uiText={{
          value: player.name,
          fontSize: getHudFontSize(getViewportHeight()).NORMAL
        }}
      />
    </Row>
  )
}

import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../components/color-palette'
import { store } from '../../state/store'
import { updateHudStateAction } from '../../state/hud/actions'
import { getPlayer } from '@dcl/sdk/src/players'
import { HUD_POPUP_TYPE } from '../../state/hud/state'
import { noop } from '../../utils/function-utils'
import { Content } from '../main-menu/backpack-page/BackpackPage'

export function PopupPassport(): ReactElement | null {
  if (store.getState().hud.shownPopup?.type !== HUD_POPUP_TYPE.PASSPORT) {
    return null
  }

  const userId = store.getState().hud.shownPopup?.data as string
  const player = getPlayer({
    userId
  })

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        zIndex: 999,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_9
      }}
      onMouseDown={() => {
        closeDialog()
      }}
    >
      <Content>
        <UiEntity
          uiTransform={{
            width: '80%',
            height: '100%',
            pointerFilter: 'block'
          }}
          onMouseDown={noop}
          uiBackground={{ color: COLOR.RED }}
        />
      </Content>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(updateHudStateAction({ shownPopup: null }))
  }
}

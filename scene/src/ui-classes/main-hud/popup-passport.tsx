import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../components/color-palette'
import { store } from '../../state/store'
import { HUD_ACTION, updateHudStateAction } from '../../state/hud/actions'
import { getPlayer } from '@dcl/sdk/src/players'
import { HUD_POPUP_TYPE } from '../../state/hud/state'
import { noop } from '../../utils/function-utils'
import { Content } from '../main-menu/backpack-page/BackpackPage'
import { AvatarPreviewElement } from '../../components/backpack/AvatarPreviewElement'
import {
  createAvatarPreview,
  updateAvatarPreview
} from '../../components/backpack/AvatarPreview'

export function setupPassportPopup(): void {
  store.subscribe((action, previousState) => {
    if (
      action.type === HUD_ACTION.UPDATE_HUD_STATE &&
      previousState.hud.shownPopup?.type !== HUD_POPUP_TYPE.PASSPORT &&
      store.getState().hud.shownPopup?.type === HUD_POPUP_TYPE.PASSPORT
    ) {
      console.log('PASSPORT')
      createAvatarPreview()
      updateAvatarPreview(
        store.getState().backpack.equippedWearables,
        store.getState().backpack.outfitSetup.base,
        store.getState().backpack.forceRender
      )
    }
  })
}

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
          uiBackground={{
            texture: { src: 'assets/images/passport/background.png' },
            textureMode: 'stretch'
          }}
        >
          <AvatarPreviewElement
            uiTransform={{
              borderWidth: 1,
              borderColor: COLOR.RED,
              borderRadius: 0,
              position: { top: '-18%' }
            }}
          />
        </UiEntity>
      </Content>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(updateHudStateAction({ shownPopup: null }))
  }
}

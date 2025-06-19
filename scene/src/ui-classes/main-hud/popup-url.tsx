import ReactEcs, { Button, UiEntity } from '@dcl/react-ecs'
import { store } from '../../state/store'
import { COLOR } from '../../components/color-palette'
import { closeLastPopupAction } from '../../state/hud/actions'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../utils/ui-utils'
import { noop } from '../../utils/function-utils'
import { HUD_POPUP_TYPE } from '../../state/hud/state'
import Icon from '../../components/icon/Icon'
import { Color4 } from '@dcl/sdk/math'
import { Checkbox } from '../../components/checkbox'
import { openExternalUrl } from '~system/RestrictedActions'
import { type Popup } from '../../components/popup-stack'

const state = {
  rememberDomain: false
}

export const PopupUrl: Popup = ({ shownPopup }) => {
  const URL = shownPopup.data
  if (shownPopup?.type !== HUD_POPUP_TYPE.URL) return null

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
        color: COLOR.DARK_OPACITY_7
      }}
      onMouseDown={() => {
        closeDialog()
      }}
    >
      <UiEntity
        uiTransform={{
          width: getCanvasScaleRatio() * 1200,
          height: getCanvasScaleRatio() * 750,
          borderRadius: BORDER_RADIUS_F,
          borderWidth: 0,
          borderColor: COLOR.WHITE,
          alignItems: 'center',
          flexDirection: 'column',
          padding: '1%'
        }}
        onMouseDown={noop}
        uiBackground={{
          color: COLOR.URL_POPUP_BACKGROUND
        }}
      >
        <Icon
          uiTransform={{
            positionType: 'absolute',
            position: { top: '4%' }
          }}
          icon={{ spriteName: 'Link', atlasName: 'icons' }}
          iconSize={getCanvasScaleRatio() * 96}
          iconColor={COLOR.WHITE}
        />

        <UiEntity
          uiText={{
            value: `<b>Are you sure you want to follow this link?</b>\n\nContinuing will open the link in the browser. Make sure it's a website you trust before proceeding.\n\n<b><color=#22B3F6>${URL}</color></b>`,
            color: COLOR.WHITE,
            textWrap: 'wrap',
            fontSize: getCanvasScaleRatio() * 42
          }}
          uiTransform={{
            margin: { top: '8%' },
            borderRadius: BORDER_RADIUS_F,
            borderWidth: 0,
            borderColor: COLOR.RED,
            width: '90%'
          }}
        />
        <UiEntity
          uiTransform={{
            position: { left: '0%', top: '5%' },
            alignItems: 'space-between',
            justifyContent: 'center'
          }}
        >
          <Button
            uiTransform={{
              margin: '2%',
              width: getCanvasScaleRatio() * 400,
              borderRadius: BORDER_RADIUS_F / 2,
              borderWidth: 0,
              borderColor: Color4.White()
            }}
            value={'CANCEL'}
            variant={'secondary'}
            uiBackground={{ color: COLOR.TEXT_COLOR }}
            color={Color4.White()}
            fontSize={getCanvasScaleRatio() * 28}
            onMouseDown={() => {
              closeDialog()
            }}
          />
          <Button
            uiTransform={{
              margin: '2%',
              width: getCanvasScaleRatio() * 400,
              borderRadius: BORDER_RADIUS_F / 2,
              borderWidth: 0,
              borderColor: Color4.White()
            }}
            value={'CONTINUE'}
            variant={'primary'}
            fontSize={getCanvasScaleRatio() * 28}
            onMouseUp={() => {
              state.rememberDomain = false
              closeDialog()
              openExternalUrl({ url: URL }).catch(console.error)
              // TODO save domain on localStorage or bevy api ? Review with @rob
            }}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            position: { left: '0%', top: '15%' },
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Checkbox
            uiTransform={{
              margin: { right: '1%' }
            }}
            onChange={() => {
              state.rememberDomain = !state.rememberDomain
            }}
            value={state.rememberDomain}
            label={'Always allow links from this domain'}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}

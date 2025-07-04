import ReactEcs, { Button, UiEntity } from '@dcl/react-ecs'
import { store } from '../../state/store'
import { COLOR } from '../../components/color-palette'
import { closeLastPopupAction } from '../../state/hud/actions'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../utils/ui-utils'
import { noop } from '../../utils/function-utils'
import Icon from '../../components/icon/Icon'
import { Color4 } from '@dcl/sdk/math'
import { type Popup } from '../../components/popup-stack'

const state = {
  rememberDomain: false
}

export const ErrorPopup: Popup = ({ shownPopup }) => {
  const message = shownPopup.data

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
          color: COLOR.WHITE
        }}
      >
        <Icon
          uiTransform={{
            positionType: 'absolute',
            position: { top: '4%' }
          }}
          icon={{ spriteName: 'BugIcon', atlasName: 'icons' }}
          iconSize={getCanvasScaleRatio() * 96}
          iconColor={COLOR.RED}
        />

        <UiEntity
          uiText={{
            value: `<b>Error Message:<b/>\n${message}`,
            color: COLOR.RED,
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
            value={'OK'}
            variant={'secondary'}
            uiBackground={{ color: COLOR.TEXT_COLOR }}
            color={Color4.White()}
            fontSize={getCanvasScaleRatio() * 28}
            onMouseDown={() => {
              closeDialog()
            }}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}

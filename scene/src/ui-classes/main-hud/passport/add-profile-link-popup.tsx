import ReactEcs, { Button, UiEntity } from '@dcl/react-ecs'
import type { Popup } from '../../../components/popup-stack'
import { COLOR } from '../../../components/color-palette'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'
import { cloneDeep, noop } from '../../../utils/function-utils'
import { store } from '../../../state/store'
import {
  closeLastPopupAction,
  updateHudStateAction
} from '../../../state/hud/actions'
import { Input } from '@dcl/sdk/react-ecs'
import useState = ReactEcs.useState

export const AddProfileLinkPopup: Popup = ({ shownPopup }) => {
  const fontSize = getCanvasScaleRatio() * 40
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
          height: getCanvasScaleRatio() * 800,

          borderRadius: BORDER_RADIUS_F,
          borderWidth: 0,
          borderColor: COLOR.WHITE,
          alignItems: 'flex-start',
          flexDirection: 'column',
          padding: { top: '3%', left: '3%' }
        }}
        onMouseDown={noop}
        uiBackground={{
          color: COLOR.URL_POPUP_BACKGROUND
        }}
      >
        <AddProfileLinkContent fontSize={fontSize} />
      </UiEntity>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}

function AddProfileLinkContent({ fontSize }: { fontSize: number }) {
  const [title, setTitle] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  return (
    <UiEntity
      uiTransform={{ width: '100%', flexShrink: 0, flexDirection: 'column' }}
    >
      <UiEntity
        uiText={{
          value: '<b>Add Link</b>',
          fontSize: fontSize * 1.2
        }}
      />
      <Input
        fontSize={fontSize}
        uiTransform={{
          height: getCanvasScaleRatio() * 100,
          width: '90%',
          borderColor: COLOR.WHITE,
          borderWidth: 0,
          borderRadius: getCanvasScaleRatio() * 15,
          padding: {
            top: getCanvasScaleRatio() * 24,
            left: getCanvasScaleRatio() * 24
          },
          margin: { top: '5%' }
        }}
        onChange={(title) => { setTitle(title); }}
        placeholder={'Enter Link Title (E.G. Instagram)'}
        uiBackground={{ color: COLOR.WHITE }}
      />
      <Input
        onChange={(url) => { setUrl(url); }}
        fontSize={fontSize}
        uiTransform={{
          height: getCanvasScaleRatio() * 100,
          width: '90%',
          borderColor: COLOR.WHITE,
          borderWidth: 0,
          borderRadius: getCanvasScaleRatio() * 15,
          padding: {
            top: getCanvasScaleRatio() * 24,
            left: getCanvasScaleRatio() * 24
          },
          margin: { top: '5%' }
        }}
        placeholder={'Enter URL'}
        uiBackground={{ color: COLOR.WHITE }}
      />

      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: { top: '10%' },
          width: '90%'
        }}
      >
        <Button
          fontSize={fontSize}
          uiTransform={{
            borderRadius: getCanvasScaleRatio() * 20,
            borderColor: COLOR.BLACK_TRANSPARENT,
            borderWidth: 0,
            width: '40%',
            margin: { right: '5%' },
            height: fontSize * 2.5
          }}
          uiBackground={{
            color: COLOR.DARK_OPACITY_5
          }}
          color={COLOR.WHITE}
          value={'CANCEL'}
          onMouseDown={() => {
            store.dispatch(closeLastPopupAction())
          }}
        />
        <Button
          variant={'primary'}
          fontSize={fontSize}
          uiTransform={{
            width: '40%',
            borderRadius: getCanvasScaleRatio() * 20,
            borderColor: COLOR.BLACK_TRANSPARENT,
            borderWidth: 0,
            height: fontSize * 2.5
          }}
          value={'SAVE'}
          disabled={!(isValidURL(url) && title)}
          onMouseDown={() => {
            const newProfileData = cloneDeep(store.getState().hud.profileData)
            newProfileData.links = newProfileData.links || []
            newProfileData.links.push({ url, title })

            store.dispatch(
              updateHudStateAction({
                profileData: newProfileData
              })
            )
            store.dispatch(closeLastPopupAction())
          }}
        />
      </UiEntity>
    </UiEntity>
  )

  function isValidURL(url: string): boolean {
    const regex = /^https:\/\/[^\s/$.?#].[^\s]*$/i
    return regex.test(url)
  }
}

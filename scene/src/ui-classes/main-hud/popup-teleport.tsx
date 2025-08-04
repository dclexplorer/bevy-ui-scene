import ReactEcs, { Button, UiEntity } from '@dcl/react-ecs'
import { store } from '../../state/store'
import { COLOR } from '../../components/color-palette'
import { closeLastPopupAction } from '../../state/hud/actions'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../utils/ui-utils'
import { noop } from '../../utils/function-utils'
import { HUD_POPUP_TYPE } from '../../state/hud/state'
import Icon from '../../components/icon/Icon'
import { Color4, Vector2 } from '@dcl/sdk/math'
import { Checkbox } from '../../components/checkbox'
import { openExternalUrl } from '~system/RestrictedActions'
import { type Popup } from '../../components/popup-stack'
import { teleportTo } from '~system/RestrictedActions'
import { convertMessageToObject } from '~system/EthereumController'
import { getRealm, getSceneInformation } from '~system/Runtime'
import useEffect = ReactEcs.useEffect
import useState = ReactEcs.useState
import { fetchJsonOrTryFallback } from '../../utils/promise-utils'
import { CATALYST_BASE_URL_FALLBACK } from '../../utils/constants'
import { executeTask } from '@dcl/sdk/ecs'

const state = {
  rememberDomain: false
}

export const PopupTeleport: Popup = ({ shownPopup }) => {
  const URL: string = shownPopup.data as string
  if (shownPopup?.type !== HUD_POPUP_TYPE.TELEPORT) return null
  const [x, y] = URL.replace(' ', '')
    .split(',')
    .map((n) => Number(n))
  const worldCoordinates = { x, y }
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
      <TeleportContent worldCoordinates={worldCoordinates} />
    </UiEntity>
  )
}
function TeleportContent({ worldCoordinates }: { worldCoordinates: Vector2 }) {
  const [sceneTitle, setSceneTitle] = useState<string>('')
  const [sceneThumbnail, setSceneThumbnail] = useState<string | null>(null)
  useEffect(() => {
    executeTask(async () => {
      try {
        const realm = await getRealm({})
        const catalystBaseURl =
          realm.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
        const [result] = await fetchJsonOrTryFallback(
          `${catalystBaseURl}/content/entities/scene?pointer=${worldCoordinates.x},${worldCoordinates.y}`
        )
        setSceneTitle(
          `<b>${result.metadata.display.title}</b>\n${result.metadata.display.description}\n\n`
        )
        const thumbnailFileName = result.metadata.display?.navmapThumbnail
        console.log('thumbnailFileName', thumbnailFileName)
        const fileEntry = result.content.find(
          (f: any) => f.file === thumbnailFileName
        )
        console.log('fileEntry', fileEntry)
        if (fileEntry) {
          setSceneThumbnail(
            `https://peer.decentraland.org/content/contents/${fileEntry.hash}`
          )
        }
      } catch (error) {
        console.error(error)
      }
    })
  }, [])

  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 1200,
        height: getCanvasScaleRatio() * 1400,
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
        icon={{ spriteName: 'WarpIn', atlasName: 'icons' }}
        iconSize={getCanvasScaleRatio() * 96}
        iconColor={COLOR.WHITE}
      />

      <UiEntity
        uiText={{
          value: `\nAre you sure you want to be teleported to <b>${worldCoordinates.x},${worldCoordinates.y}?</b>\n\n${sceneTitle}`,
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
          width: getCanvasScaleRatio() * 1000,
          height: getCanvasScaleRatio() * 600,
          borderRadius: 0,
          borderColor: COLOR.WHITE_OPACITY_1,
          borderWidth: 1,
          flexShrink: 0
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: sceneThumbnail ? { src: sceneThumbnail } : undefined
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
            borderColor: Color4.White(),
            flexShrink: 0,
            height: getCanvasScaleRatio() * 64
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
            borderColor: Color4.White(),
            flexShrink: 0,
            height: getCanvasScaleRatio() * 64
          }}
          value={'CONTINUE'}
          variant={'primary'}
          fontSize={getCanvasScaleRatio() * 28}
          onMouseUp={() => {
            state.rememberDomain = false

            closeDialog()
            teleportTo({ worldCoordinates }).catch(console.error)
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}
function closeDialog(): void {
  store.dispatch(closeLastPopupAction())
}

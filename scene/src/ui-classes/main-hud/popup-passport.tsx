import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../components/color-palette'
import { store } from '../../state/store'
import { HUD_ACTION, updateHudStateAction } from '../../state/hud/actions'
import { getPlayer } from '@dcl/sdk/src/players'
import { HUD_POPUP_TYPE } from '../../state/hud/state'
import { memoize, noop } from '../../utils/function-utils'
import { Content } from '../main-menu/backpack-page/BackpackPage'
import { AvatarPreviewElement } from '../../components/backpack/AvatarPreviewElement'
import {
  createAvatarPreview,
  updateAvatarPreview
} from '../../components/backpack/AvatarPreview'
import { ALMOST_WHITE } from '../../utils/constants'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { copyToClipboard } from '~system/RestrictedActions'
import {
  applyMiddleEllipsis,
  getURNWithoutTokenId
} from '../../utils/urn-utils'
import { type URN, type URNWithoutTokenId } from '../../utils/definitions'
import { waitFor } from '../../utils/dcl-utils'
import { executeTask } from '@dcl/sdk/ecs'
import { type PBAvatarBase } from '../../bevy-api/interface'
import { type WearableCategory } from '../../service/categories'

export function setupPassportPopup(): void {
  store.subscribe((action, previousState) => {
    if (
      action.type === HUD_ACTION.UPDATE_HUD_STATE &&
      previousState.hud.shownPopup?.type !== HUD_POPUP_TYPE.PASSPORT &&
      store.getState().hud.shownPopup?.type === HUD_POPUP_TYPE.PASSPORT
    ) {
      executeTask(async () => {
        const userId: string = store.getState().hud.shownPopup?.data as string
        await waitFor(() => (getPlayer({ userId })?.wearables.length ?? 0) > 0)

        createAvatarPreview()

        const player = getPlayer({ userId })

        const wearables: URNWithoutTokenId[] = (player?.wearables ?? []).map(
          (urn) => getURNWithoutTokenId(urn as URN)
        ) as URNWithoutTokenId[]
        updateAvatarPreview(
          wearables,
          player?.avatar as PBAvatarBase,
          player?.forceRender as WearableCategory[]
        )
      })
    }
  })
}

const COPY_ICON_SIZE = 40
export function PopupPassport(): ReactElement | null {
  if (store.getState().hud.shownPopup?.type !== HUD_POPUP_TYPE.PASSPORT) {
    return null
  }

  // const userId = store.getState().hud.shownPopup?.data as string
  const player = getPlayer()

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
            pointerFilter: 'block',
            flexDirection: 'row'
          }}
          onMouseDown={noop}
          uiBackground={{
            texture: { src: 'assets/images/passport/background.png' },
            textureMode: 'stretch'
          }}
        >
          <AvatarPreviewElement
            uiTransform={{
              position: { top: '-18%' },
              flexShrink: 0,
              flexGrow: 0
            }}
          />
          <UiEntity
            uiTransform={{
              flexDirection: 'column',

              flexGrow: 1
            }}
          >
            <Header>
              {NameRow({
                name: player?.name ?? '',
                fontSize: getCanvasScaleRatio() * 40,
                isGuest: !!player?.isGuest
              })}
              {!player?.isGuest &&
                AddressRow({
                  address: player?.userId ?? '',
                  fontSize: getCanvasScaleRatio() * 28
                })}
            </Header>
          </UiEntity>
        </UiEntity>
      </Content>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(updateHudStateAction({ shownPopup: null }))
  }
}

const _applyMiddleEllipsis = memoize(applyMiddleEllipsis)

function AddressRow({
  address,
  fontSize
}: {
  address: string
  fontSize: number
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <UiEntity
        uiText={{
          value: _applyMiddleEllipsis(address),
          fontSize,
          textAlign: 'middle-left',
          color: COLOR.INACTIVE
        }}
        uiTransform={{
          padding: 0,
          margin: { left: '-5%' }
        }}
      />
      {CopyButton({
        fontSize: getCanvasScaleRatio() * COPY_ICON_SIZE,
        text: address
      })}
    </UiEntity>
  )
}

function NameRow({
  name,
  fontSize,
  isGuest
}: {
  name: string
  fontSize: number
  isGuest: boolean
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <StatusIcon fontSize={fontSize} />
      <UiEntity
        uiText={{ value: name, fontSize, textAlign: 'middle-left' }}
        uiTransform={{
          padding: 0,
          margin: { left: '-5%' }
        }}
      />
      {!isGuest && (
        <UiEntity
          uiTransform={{
            width: fontSize,
            height: fontSize
          }}
          uiBackground={getBackgroundFromAtlas({
            atlasName: 'icons',
            spriteName: 'Verified'
          })}
        />
      )}
      {CopyButton({
        fontSize: getCanvasScaleRatio() * COPY_ICON_SIZE,
        text: name
      })}
    </UiEntity>
  )
}

function CopyButton({
  fontSize,
  text
}: {
  fontSize: number
  text: string
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: fontSize,
        height: fontSize,
        margin: { left: '5%' }
      }}
      uiBackground={{
        ...getBackgroundFromAtlas({
          atlasName: 'icons',
          spriteName: 'CopyIcon'
        }),
        color: { ...ALMOST_WHITE, a: 0.2 }
      }}
      onMouseDown={() => {
        copyToClipboard({ text }).catch(console.error)
      }}
    />
  )
}

function StatusIcon({ fontSize }: { fontSize: number }): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: fontSize * 0.6,
        height: fontSize * 0.6,
        borderRadius: 9999,
        borderWidth: 3 * getCanvasScaleRatio(),
        borderColor: COLOR.WHITE
      }}
      uiBackground={{ color: COLOR.LINK_COLOR }}
    />
  )
}
function Header({ children }: { children?: ReactElement }): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: COLOR.RED,
        borderRadius: 0,
        alignItems: 'flex-start'
      }}
    >
      {children}
    </UiEntity>
  )
}

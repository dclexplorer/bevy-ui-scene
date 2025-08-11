import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import {
  getCanvasScaleRatio,
  getContentHeight,
  getContentWidth
} from '../../../service/canvas-ratio'
import { fetchWearablesData } from '../../../utils/wearables-promise-utils'
import { getPlayer } from '@dcl/sdk/src/players'
import type {
  EquippedEmote,
  URN,
  URNWithoutTokenId
} from '../../../utils/definitions'
import { BevyApi } from '../../../bevy-api'
import {
  createAvatarPreview,
  updateAvatarPreview
} from '../../../components/backpack/AvatarPreview'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../../utils/constants'
import {
  BASE_MALE_URN,
  getURNWithoutTokenId,
  getItemsWithTokenId
} from '../../../utils/urn-utils'
import { store } from '../../../state/store'
import {
  updateAvatarBase,
  updateCacheKey,
  updateEquippedEmotesAction,
  updateEquippedWearables,
  updateLoadedOutfitsMetadataAction,
  updateLoadingPage
} from '../../../state/backpack/actions'
import {
  AvatarPreviewElement,
  setAvatarPreviewZoom
} from '../../../components/backpack/AvatarPreviewElement'
import { saveResetOutfit } from './ItemCatalog'
import { closeColorPicker } from './WearableColorPicker'
import { WearablesCatalog } from './WearablesCatalog'
import { BACKPACK_SECTION } from '../../../state/backpack/state'
import { EmotesCatalog } from './EmotesCatalog'
import { noop } from '../../../utils/function-utils'
import { fetchEmotesData } from '../../../utils/emotes-promise-utils'
import { type SetAvatarData } from '../../../bevy-api/interface'
import { getRealm } from '~system/Runtime'
import { catalystMetadataMap } from '../../../utils/catalyst-metadata-map'

import { BackpackNavBar } from './BackpackNavBar'
import { updatePageGeneric } from './backpack-service'
import { OutfitsCatalog } from './OutfitsCatalog'
import { fetchPlayerOutfitMetadata } from '../../../utils/outfits-promise-utils'
import { waitFor } from '../../../utils/dcl-utils'
import { pushPopupAction } from '../../../state/hud/actions'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'

let originalAvatarJSON: string

export default class BackpackPage {
  public fontSize: number = 16 * getCanvasScaleRatio() * 2

  render(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    const canvasScaleRatio = getCanvasScaleRatio()
    const backpackState = store.getState().backpack

    return (
      <MainContent>
        <BackpackNavBar canvasScaleRatio={canvasScaleRatio} />
        <ResponsiveContent>
          <AvatarPreviewElement />
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
              margin: 40 * canvasScaleRatio,
              padding: {
                top: 80 * canvasScaleRatio
              },
              pointerFilter: 'block'
            }}
            uiBackground={{
              ...ROUNDED_TEXTURE_BACKGROUND,
              color: { ...Color4.Black(), a: 0.35 }
            }}
            onMouseDown={noop}
          >
            {backpackState.activeSection === BACKPACK_SECTION.WEARABLES && (
              <WearablesCatalog />
            )}
            {backpackState.activeSection === BACKPACK_SECTION.EMOTES && (
              <EmotesCatalog />
            )}
            {backpackState.activeSection === BACKPACK_SECTION.OUTFITS && (
              <OutfitsCatalog />
            )}
          </UiEntity>
        </ResponsiveContent>
      </MainContent>
    )
  }

  async saveAvatar(): Promise<void> {
    try {
      const backpackState = store.getState().backpack
      const avatarPayload: SetAvatarData = {
        base: backpackState.outfitSetup.base,
        equip: {
          wearableUrns: getItemsWithTokenId(backpackState.equippedWearables),
          emoteUrns: getItemsWithTokenId(backpackState.equippedEmotes).map(
            nullAsEmptyString
          ) as URN[],
          forceRender: backpackState.forceRender ?? []
        }
      }
      if (avatarHasChanged(avatarPayload)) {
        await BevyApi.setAvatar(avatarPayload).catch((error) => {
          store.dispatch(
            pushPopupAction({
              type: HUD_POPUP_TYPE.ERROR,
              data: error
            })
          )
        })
      }
    } catch (error) {
      console.log('setAvatar error', error)
    }

    function avatarHasChanged(avatarPayload: SetAvatarData): boolean {
      return originalAvatarJSON !== JSON.stringify(avatarPayload)
    }
  }

  async init(): Promise<void> {
    store.dispatch(updateLoadingPage(true))
    store.dispatch(updateCacheKey())
    closeColorPicker()
    if (!createAvatarPreview()) {
      updateAvatarPreview(
        store.getState().backpack.equippedWearables,
        store.getState().backpack.outfitSetup.base,
        store.getState().backpack.forceRender
      )
    }

    await waitFor(() => getPlayer() !== null)
    const player = getPlayer()
    const wearables: URNWithoutTokenId[] = (player?.wearables ?? []).map(
      (urn) => getURNWithoutTokenId(urn as URN)
    ) as URNWithoutTokenId[]
    const playerEmoteURNs = player?.emotes ?? []
    const equippedEmotes: EquippedEmote[] = new Array(10)
      .fill('')
      .map((urn, index) =>
        getURNWithoutTokenId((playerEmoteURNs[index] ?? '') as URN)
      ) as EquippedEmote[]

    await fetchWearablesData(
      (await getRealm({}))?.realmInfo?.baseUrl ??
        'https://peer.decentraland.org'
    )(...(wearables ?? []))
    await fetchEmotesData(...(equippedEmotes ?? []))
    store.dispatch(updateEquippedEmotesAction(equippedEmotes))
    store.dispatch(
      updateEquippedWearables({
        wearables,
        wearablesData: catalystMetadataMap
      })
    )
    store.dispatch(
      updateAvatarBase({
        ...store.getState().backpack.outfitSetup.base,
        name: getPlayer()?.name as string,
        eyesColor: player?.avatar?.eyesColor,
        hairColor: player?.avatar?.hairColor,
        skinColor: player?.avatar?.skinColor,
        bodyShapeUrn:
          (player?.avatar?.bodyShapeUrn as URNWithoutTokenId) ?? BASE_MALE_URN
      })
    )
    saveResetOutfit()
    await updatePageGeneric()

    const backpackState = store.getState().backpack

    originalAvatarJSON = JSON.stringify({
      base: backpackState.outfitSetup.base,
      equip: {
        wearableUrns: getItemsWithTokenId(backpackState.equippedWearables),
        emoteUrns: getItemsWithTokenId(backpackState.equippedEmotes).map(
          nullAsEmptyString
        ) as URN[],
        forceRender: backpackState.forceRender ?? []
      }
    } satisfies SetAvatarData)

    if (!backpackState.outfitsMetadata) {
      store.dispatch(updateLoadingPage(true))
      store.dispatch(
        updateLoadedOutfitsMetadataAction(
          await fetchPlayerOutfitMetadata({ address: player?.userId as string })
        )
      )

      store.dispatch(updateLoadingPage(false))
    }

    setAvatarPreviewZoom()
  }
}

export function MainContent({
  children
}: {
  children?: ReactElement
}): ReactElement {
  return (
    <UiEntity
      onMouseEnter={() => {}}
      uiTransform={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        pointerFilter: 'block'
      }}
      uiBackground={{
        texture: { src: 'assets/images/menu/background.png' },
        textureMode: 'stretch'
      }}
    >
      {children}
    </UiEntity>
  )
}

export function ResponsiveContent({
  children
}: {
  children?: ReactElement
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: getContentWidth(),
        height: getContentHeight() * 1.1,
        pointerFilter: 'block'
      }}
    >
      {children}
    </UiEntity>
  )
}

function nullAsEmptyString(v: any): any {
  if (!v) return ''
  return v
}

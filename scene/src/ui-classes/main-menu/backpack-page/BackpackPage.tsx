import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { NavButton } from '../../../components/nav-button/NavButton'
import {
  getCanvasScaleRatio,
  getContentHeight,
  getContentWidth
} from '../../../service/canvas-ratio'
import {
  fetchWearablesData,
  fetchWearablesPage
} from '../../../utils/wearables-promise-utils'
import { getPlayer } from '@dcl/sdk/src/players'
import type { URN, URNWithoutTokenId } from '../../../utils/definitions'
import { BevyApi } from '../../../bevy-api'
import {
  createAvatarPreview,
  playEmote,
  setAvatarPreviewCameraToWearableCategory,
  setAvatarPreviewZoomFactor
} from '../../../components/backpack/AvatarPreview'
import {
  ROUNDED_TEXTURE_BACKGROUND,
  ZERO_ADDRESS
} from '../../../utils/constants'
import {
  BASE_MALE_URN,
  getURNWithoutTokenId,
  getItemsWithTokenId
} from '../../../utils/urn-utils'
import { store } from '../../../state/store'
import {
  changeSectionAction,
  updateAvatarBase,
  updateCacheKey,
  updateEquippedEmotesAction,
  updateEquippedWearables,
  updateLoadingPage
} from '../../../state/backpack/actions'
import { AvatarPreviewElement } from '../../../components/backpack/AvatarPreviewElement'
import { saveResetOutfit, updatePage } from './ItemCatalog'
import { closeColorPicker } from './WearableColorPicker'
import { WearablesCatalog } from './WearablesCatalog'
import { BACKPACK_SECTION } from '../../../state/backpack/state'
import { EmotesCatalog } from './EmotesCatalog'
import { noop } from '../../../utils/function-utils'
import {
  fetchEmotesData,
  fetchEmotesPage
} from '../../../utils/emotes-promise-utils'
import { fetchEquippedEmotes } from '../../../service/emotes'
import { WEARABLE_CATEGORY_DEFINITIONS } from '../../../service/categories'
import { type SetAvatarData } from '../../../bevy-api/interface'
import { getRealm } from '~system/Runtime'
import { ITEMS_CATALOG_PAGE_SIZE } from '../../../utils/backpack-constants'
import { catalystMetadataMap } from '../../../utils/catalyst-metadata-map'

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
        <Content>
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
          </UiEntity>
        </Content>
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
        await BevyApi.setAvatar(avatarPayload)
      }
    } catch (error) {
      console.log('setAvatar error', error)
    }

    function avatarHasChanged(avatarPayload: SetAvatarData): boolean {
      return originalAvatarJSON !== JSON.stringify(avatarPayload)
    }
  }

  async init(): Promise<void> {
    store.dispatch(updateCacheKey())
    closeColorPicker()
    createAvatarPreview()
    store.dispatch(updateLoadingPage(true))
    const player = getPlayer()
    const wearables: URNWithoutTokenId[] = (getPlayer()?.wearables ?? []).map(
      (urn) => getURNWithoutTokenId(urn as URN)
    ) as URNWithoutTokenId[]
    const emotes = await fetchEquippedEmotes(player?.userId ?? ZERO_ADDRESS)

    await fetchWearablesData(
      (await getRealm({}))?.realmInfo?.baseUrl ??
        'https://peer.decentraland.org'
    )(...(wearables ?? []))
    await fetchEmotesData(...(emotes ?? []))

    store.dispatch(updateEquippedEmotesAction(emotes))
    store.dispatch(
      updateEquippedWearables({
        wearables,
        wearablesData: catalystMetadataMap
      })
    )
    store.dispatch(
      updateAvatarBase({
        name: player?.name ?? '',
        eyesColor: player?.avatar?.eyesColor,
        hairColor: player?.avatar?.hairColor,
        skinColor: player?.avatar?.skinColor,
        bodyShapeUrn:
          (player?.avatar?.bodyShapeUrn as URNWithoutTokenId) ?? BASE_MALE_URN
      })
    )
    saveResetOutfit()
    const backpackState = store.getState().backpack
    const pageParams = {
      pageNum: backpackState.currentPage,
      pageSize: ITEMS_CATALOG_PAGE_SIZE,
      address: getPlayer()?.userId ?? ZERO_ADDRESS,
      cacheKey: store.getState().backpack.cacheKey
    }
    await updatePage(
      backpackState.activeSection === BACKPACK_SECTION.WEARABLES
        ? async () =>
            await fetchWearablesPage((await getRealm({}))?.realmInfo?.baseUrl)({
              ...pageParams,
              wearableCategory: backpackState.activeWearableCategory
            })
        : async () => await fetchEmotesPage(pageParams)
    )

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
  }
}

function MainContent({ children }: { children?: ReactElement }): ReactElement {
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

function NavBar({ children }: { children?: ReactElement }): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        width: '100%',
        height: 120 * canvasScaleRatio,
        pointerFilter: 'block'
      }}
      uiBackground={{
        color: { ...Color4.Black(), a: 0.4 }
      }}
    >
      {children}
    </UiEntity>
  )
}

function LeftSection({ children }: { children?: ReactElement }): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        height: '100%',
        flexDirection: 'row',
        padding: 0,
        alignItems: 'flex-start',
        alignSelf: 'flex-start'
      }}
    >
      {children}
    </UiEntity>
  )
}

function NavBarTitle({
  text,
  canvasScaleRatio
}: {
  text: string
  canvasScaleRatio: number
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        padding: 0,
        margin: { top: -8, left: 4 }
      }}
      uiText={{
        value: text,
        fontSize: 64 * canvasScaleRatio
      }}
    />
  )
}

function NavButtonBar({ children }: { children?: ReactElement }): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: { left: 10 * getCanvasScaleRatio() * 2 }
      }}
      uiBackground={{
        color: { ...Color4.Blue(), a: 0.0 }
      }}
    >
      {children}
    </UiEntity>
  )
}

function Content({ children }: { children?: ReactElement }): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: getContentWidth(),
        height: getContentHeight(),
        pointerFilter: 'block'
      }}
    >
      {children}
    </UiEntity>
  )
}

function BackpackNavBar({
  canvasScaleRatio
}: {
  canvasScaleRatio: number
}): ReactElement {
  const backpackState = store.getState().backpack
  return (
    <NavBar>
      <LeftSection>
        <NavBarTitle
          text={'<b>Backpack</b>'}
          canvasScaleRatio={canvasScaleRatio}
        />
        {/* NAV-BUTTON-BAR */}
        <NavButtonBar>
          <NavButton
            icon={{
              spriteName: 'Wearables',
              atlasName: 'icons'
            }}
            active={backpackState.activeSection === BACKPACK_SECTION.WEARABLES}
            text={'Wearables'}
            onClick={() => {
              store.dispatch(changeSectionAction(BACKPACK_SECTION.WEARABLES))
              const backpackState = store.getState().backpack
              const pageParams = {
                pageNum: backpackState.currentPage,
                pageSize: ITEMS_CATALOG_PAGE_SIZE,
                address: getPlayer()?.userId ?? ZERO_ADDRESS,
                cacheKey: store.getState().backpack.cacheKey
              }
              updatePage(
                async () =>
                  await fetchWearablesPage(
                    (await getRealm({}))?.realmInfo?.baseUrl
                  )({
                    ...pageParams,
                    wearableCategory: backpackState.activeWearableCategory
                  })
              ).catch(console.error)
              setAvatarPreviewCameraToWearableCategory(
                backpackState.activeWearableCategory
              )
              playEmote('')
              setAvatarPreviewZoomFactor(0.5)
            }}
          />
          <NavButton
            icon={{
              spriteName: 'Emotes',
              atlasName: 'icons'
            }}
            active={backpackState.activeSection === BACKPACK_SECTION.EMOTES}
            text={'Emotes'}
            uiTransform={{ margin: { left: 12 } }}
            onClick={() => {
              store.dispatch(changeSectionAction(BACKPACK_SECTION.EMOTES))
              const backpackState = store.getState().backpack
              const pageParams = {
                pageNum: backpackState.currentPage,
                pageSize: ITEMS_CATALOG_PAGE_SIZE,
                address: getPlayer()?.userId ?? ZERO_ADDRESS,
                cacheKey: store.getState().backpack.cacheKey
              }
              updatePage(async () => await fetchEmotesPage(pageParams)).catch(
                console.error
              )
              setAvatarPreviewCameraToWearableCategory(
                WEARABLE_CATEGORY_DEFINITIONS.body_shape.id
              )
              setAvatarPreviewZoomFactor(0.5)
            }}
          />
        </NavButtonBar>
      </LeftSection>
    </NavBar>
  )
}

function nullAsEmptyString(v: any): any {
  if (!v) return ''
  return v
}

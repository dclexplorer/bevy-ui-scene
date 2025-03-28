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
  catalystMetadataMap,
  fetchWearablesData,
  fetchWearablesPage
} from '../../../utils/wearables-promise-utils'
import { getPlayer } from '@dcl/sdk/src/players'
import type { URN, URNWithoutTokenId } from '../../../utils/definitions'
import { BevyApi } from '../../../bevy-api'
import { createAvatarPreview } from '../../../components/backpack/AvatarPreview'
import {
  ITEMS_CATALOG_PAGE_SIZE,
  ROUNDED_TEXTURE_BACKGROUND,
  ZERO_ADDRESS
} from '../../../utils/constants'
import {
  BASE_MALE_URN,
  getURNWithoutTokenId,
  getWearablesWithTokenId
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

      if (
        [...backpackState.equippedWearables].sort(sortAbc).join(',') !==
        [...(getPlayer()?.wearables ?? [])].sort(sortAbc).join(',')
      ) {
        await BevyApi.setAvatar({
          base: backpackState.outfitSetup.base,
          equip: {
            wearableUrns: getWearablesWithTokenId(
              backpackState.equippedWearables
            ),
            emoteUrns: [], // TODO implement emotes
            forceRender: backpackState.forceRender ?? []
          }
        })
      }
    } catch (error) {
      console.log('setAvatar error', error)
    }

    function sortAbc(a: string, b: string): number {
      return a.localeCompare(b)
    }
  }

  async init(): Promise<void> {
    store.dispatch(updateCacheKey())
    closeColorPicker()
    createAvatarPreview()
    store.dispatch(updateLoadingPage(true))
    const player = getPlayer()
    console.log('player.emotes', player?.emotes)
    const wearables: URNWithoutTokenId[] = (getPlayer()?.wearables ?? []).map(
      (urn) => getURNWithoutTokenId(urn as URN)
    ) as URNWithoutTokenId[]
    const emotes = await fetchEquippedEmotes(player?.userId ?? ZERO_ADDRESS)

    await fetchWearablesData(...(wearables ?? []))
    await fetchEmotesData(...(emotes ?? []))

    /* const emotes: URNWithoutTokenId[] = (getPlayer()?.emotes ?? []).map((urn) =>
      getURNWithoutTokenId(urn as URN)
    ) as URNWithoutTokenId[]
    await fetchEmotedData(...(emotes ?? [])) */
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
            await fetchWearablesPage({
              ...pageParams,
              wearableCategory: backpackState.activeWearableCategory
            })
        : async () => await fetchEmotesPage(pageParams)
    )
  }
}

function MainContent({ children }: any): ReactElement {
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

function NavBar({ children, canvasScaleRatio }: any): ReactElement {
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

function LeftSection({ children }: any): ReactElement {
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

function NavButtonBar({ children }: any): ReactElement {
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

function Content({ children }: any): ReactElement {
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
    <NavBar canvasScaleRatio={canvasScaleRatio}>
      {/* LEFT SECTION */}
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
                  await fetchWearablesPage({
                    ...pageParams,
                    wearableCategory: backpackState.activeWearableCategory
                  })
              ).catch(console.error)
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
            }}
          />
        </NavButtonBar>
      </LeftSection>
    </NavBar>
  )
}

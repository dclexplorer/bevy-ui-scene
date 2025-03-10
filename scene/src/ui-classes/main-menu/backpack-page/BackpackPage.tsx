import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { NavButton } from '../../../components/nav-button/NavButton'
import {
  getCanvasScaleRatio,
  getContentHeight,
  getContentWidth
} from '../../../service/canvas-ratio'
import {
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from '../../../service/wearable-categories'
import { WearableCategoryList } from '../../../components/backpack/WearableCategoryList'
import Icon from '../../../components/icon/Icon'
import { WearableCatalogGrid } from '../../../components/backpack/WearableCatalogGrid'
import {
  catalystWearableMap,
  fetchWearablesData,
  fetchWearablesPage
} from '../../../utils/wearables-promise-utils'

import { getPlayer } from '@dcl/sdk/src/players'
import type { URN, URNWithoutTokenId } from '../../../utils/definitions'
import type { CatalogWearableElement } from '../../../utils/wearables-definitions'

import { Pagination } from '../../../components/pagination/pagination'
import { InfoPanel } from '../../../components/backpack/InfoPanel'
import { BevyApi } from '../../../bevy-api'
import {
  createAvatarPreview,
  updateAvatarPreview,
  setAvatarPreviewCameraToWearableCategory
} from '../../../components/backpack/AvatarPreview'
import {
  ROUNDED_TEXTURE_BACKGROUND,
  WEARABLE_CATALOG_PAGE_SIZE,
  ZERO_ADDRESS
} from '../../../utils/constants'
import {
  BASE_MALE_URN,
  getURNWithoutTokenId,
  getWearablesWithTokenId,
  urnWithTokenIdMemo
} from '../../../utils/urn-utils'
import { store } from '../../../state/store'
import {
  updateActiveWearableCategory,
  updateAvatarBase,
  updateCurrentPage,
  updateEquippedWearables,
  updateLoadedPage,
  updateLoadingPage,
  updateSelectedWearableURN
} from '../../../state/backpack/actions'
import { AvatarPreviewElement } from '../../../components/backpack/AvatarPreviewElement'

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
          >
            {/* CATEGORY SELECTORS COLUMN */}
            <WearableCategoryList
              outfitSetup={backpackState.outfitSetup}
              activeCategory={backpackState.activeWearableCategory}
              onSelectCategory={(category: WearableCategory | null): void => {
                if (!backpackState.loadingPage) this.changeCategory(category)
              }}
            />
            {/* CATALOG COLUMN */}
            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                padding: 14 * canvasScaleRatio,
                margin: { left: 30 * canvasScaleRatio },
                height: '100%'
              }}
            >
              {/* CATALOG NAV_BAR */}
              <UiEntity uiTransform={{ flexDirection: 'row', width: '100%' }}>
                <NavButton
                  active={backpackState.activeWearableCategory === null}
                  icon={{ spriteName: 'all', atlasName: 'backpack' }}
                  text={'ALL'}
                  uiTransform={{ padding: 40 * canvasScaleRatio }}
                  onClick={() => {
                    if (backpackState.activeWearableCategory === null) return
                    this.changeCategory(null)
                  }}
                />
                <Icon
                  iconSize={40 * canvasScaleRatio}
                  uiTransform={{
                    alignSelf: 'center',
                    margin: {
                      left: 16 * canvasScaleRatio,
                      right: 16 * canvasScaleRatio
                    },
                    display:
                      backpackState.activeWearableCategory === null
                        ? 'none'
                        : 'flex'
                  }}
                  icon={{
                    spriteName: 'RightArrow',
                    atlasName: 'icons'
                  }}
                />
                {backpackState.activeWearableCategory === null ? null : (
                  <NavButton
                    active={true}
                    showDeleteButton={true}
                    onDelete={() => {
                      this.changeCategory(null)
                    }}
                    icon={{
                      spriteName: backpackState.activeWearableCategory,
                      atlasName: 'backpack'
                    }}
                    text={
                      WEARABLE_CATEGORY_DEFINITIONS[
                        backpackState.activeWearableCategory
                      ].label
                    }
                    uiTransform={{ padding: 20 * canvasScaleRatio }}
                  />
                )}
              </UiEntity>
              <WearableCatalogGrid
                uiTransform={{
                  margin: { top: 20 * canvasScaleRatio }
                }}
                loading={backpackState.loadingPage}
                wearables={backpackState.shownWearables}
                equippedWearables={backpackState.equippedWearables}
                baseBody={backpackState.outfitSetup.base}
                onChangeSelection={(
                  selectedURN: URNWithoutTokenId | null
                ): void => {
                  store.dispatch(updateSelectedWearableURN(selectedURN))
                }}
                onEquipWearable={(wearable: CatalogWearableElement): void => {
                  urnWithTokenIdMemo.set(
                    wearable.entity.metadata.id,
                    wearable.individualData[0].id
                  )
                  this.updateEquippedWearable(
                    wearable.category,
                    wearable.entity.metadata.id
                  ).catch(console.error)
                }}
                onUnequipWearable={(wearable: CatalogWearableElement): void => {
                  this.updateEquippedWearable(wearable.category, null).catch(
                    console.error
                  )
                }}
              />
              <Pagination
                uiTransform={{
                  positionType: 'absolute',
                  position: { bottom: 130 * canvasScaleRatio }
                }}
                disabled={backpackState.loadingPage}
                onChange={(page: number) => {
                  store.dispatch(updateCurrentPage(page))
                  void this.updatePage()
                }}
                pages={backpackState.totalPages}
                currentPage={backpackState.currentPage}
              />
            </UiEntity>
            {/* SELECTED ITEM COLUMN */}
            <InfoPanel
              uiTransform={{
                position: {
                  top: -50 * canvasScaleRatio,
                  left: -20 * canvasScaleRatio
                }
              }}
              canvasScaleRatio={canvasScaleRatio}
              wearable={
                backpackState.selectedURN === null
                  ? null
                  : catalystWearableMap[backpackState.selectedURN]
              }
            />
          </UiEntity>
        </Content>
      </MainContent>
    )
  }

  changeCategory(category: WearableCategory | null): void {
    store.dispatch(updateActiveWearableCategory(category))
    setAvatarPreviewCameraToWearableCategory(category)

    void this.updatePage()
  }

  async updatePage(): Promise<void> {
    const backpackState = store.getState().backpack
    store.dispatch(updateLoadingPage(true))
    // TODO improve with throttle and remove disabled prop
    const wearablesPage = await fetchWearablesPage({
      pageNum: backpackState.currentPage,
      pageSize: WEARABLE_CATALOG_PAGE_SIZE,
      address: getPlayer()?.userId ?? ZERO_ADDRESS,
      wearableCategory: backpackState.activeWearableCategory,
    })

    store.dispatch(
      updateLoadedPage({
        totalPages: Math.ceil(
          wearablesPage.totalAmount / WEARABLE_CATALOG_PAGE_SIZE
        ),
        shownWearables: wearablesPage.elements
      })
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
            emoteUrns: [] // TODO implements emotes
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
    createAvatarPreview()
    store.dispatch(updateLoadingPage(true))
    const player = getPlayer()
    const wearables: URNWithoutTokenId[] = (getPlayer()?.wearables ?? []).map(
      (urn) => getURNWithoutTokenId(urn as URN)
    ) as URNWithoutTokenId[]
    store.dispatch(
      updateEquippedWearables({
        wearables,
        wearablesData: await fetchWearablesData(...(wearables ?? []))
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

    await this.updatePage()
  }

  async updateEquippedWearable(
    category: WearableCategory,
    wearableURN: URNWithoutTokenId | null
  ): Promise<void> {
    const backpackState = store.getState().backpack
    if (category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id) {
      store.dispatch(
        updateAvatarBase({
          ...backpackState.outfitSetup.base,
          bodyShapeUrn: wearableURN as URNWithoutTokenId
        })
      )
    } else {
      const equippedWearablesWithoutPrevious =
        backpackState.equippedWearables.filter(
          (wearableURN) =>
            wearableURN !== backpackState.outfitSetup.wearables[category]
        )
      const wearables =
        wearableURN === null
          ? equippedWearablesWithoutPrevious
          : [...equippedWearablesWithoutPrevious, wearableURN]
      store.dispatch(
        updateEquippedWearables({
          wearables,
          wearablesData: await fetchWearablesData(...(wearables ?? []))
        })
      )
    }

    updateAvatarPreview(
      store.getState().backpack.equippedWearables,
      store.getState().backpack.outfitSetup.base
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
            active={true}
            text={'Wearables'}
          />
          <NavButton
            icon={{
              spriteName: 'Emotes',
              atlasName: 'icons'
            }}
            text={'Emotes'}
            uiTransform={{ margin: { left: 12 } }}
          />
        </NavButtonBar>
      </LeftSection>
    </NavBar>
  )
}

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
import type {
  CatalogWearableElement,
  WearableEntityMetadata,
  OutfitSetup
} from '../../../utils/wearables-definitions'
import {
  EMPTY_OUTFIT,
  getOutfitSetupFromWearables,
  getWearablesFromOutfit
} from '../../../service/outfit'
import { Pagination } from '../../../components/pagination'
import { InfoPanel } from '../../../components/backpack/InfoPanel'
import { BevyApi } from '../../../bevy-api'
import {
  getAvatarCamera,
  createAvatarPreview,
  updateAvatarPreview,
  setAvatarPreviewCameraToWearableCategory
} from '../../../components/backpack/AvatarPreview'
import {
  ROUNDED_TEXTURE_BACKGROUND,
  ZERO_ADDRESS
} from '../../../utils/constants'
import {
  BASE_MALE_URN,
  getURNWithoutTokenId,
  getWearablesWithTokenId,
  urnWithTokenIdMemo
} from '../../../utils/URN-utils'

const WEARABLE_CATALOG_PAGE_SIZE = 16

type BackpackPageState = {
  activeWearableCategory: WearableCategory | null
  currentPage: number
  loadingPage: boolean
  shownWearables: CatalogWearableElement[]
  totalPages: number
  equippedWearables: URNWithoutTokenId[]
  outfitSetup: OutfitSetup
  selectedURN: URNWithoutTokenId | null
}

export default class BackpackPage {
  public fontSize: number = 16 * getCanvasScaleRatio() * 2

  // TODO consider redux
  private readonly state: BackpackPageState = {
    activeWearableCategory: null,
    currentPage: 1,
    loadingPage: false,
    shownWearables: new Array(WEARABLE_CATALOG_PAGE_SIZE).fill(null),
    totalPages: 0,
    equippedWearables: (getPlayer()?.wearables ?? []).map((urn) =>
      getURNWithoutTokenId(urn as URN)
    ) as URNWithoutTokenId[],
    outfitSetup: EMPTY_OUTFIT,
    selectedURN: null
  }

  render(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    const canvasScaleRatio = getCanvasScaleRatio()

    return (
      <MainContent>
        {/* NAVBAR */}
        <BackpackNavBar canvasScaleRatio={canvasScaleRatio} />
        <Content>
          {/* AVATAR */}
          <AvatarPreviewElement />
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
              margin: 40 * canvasScaleRatio,
              padding: {
                  top:80 * canvasScaleRatio
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
              outfitSetup={this.state.outfitSetup}
              activeCategory={this.state.activeWearableCategory}
              onSelectCategory={(category: WearableCategory): void => {
                if (!this.state.loadingPage) this.changeCategory(category)
              }}
            />
            {/* CATALOG COLUMN */}
            <UiEntity uiTransform={{
                flexDirection: 'column',
                padding: 14 * canvasScaleRatio,
                margin: { left: 30 * canvasScaleRatio }
              }} >
              {/* CATALOG NAV_BAR */}
              <UiEntity uiTransform={{ flexDirection: 'row', width: '100%' }}>
                <NavButton
                  active={this.state.activeWearableCategory === null}
                  icon={{ spriteName: 'all', atlasName: 'backpack' }}
                  text={'ALL'}
                  uiTransform={{ padding: 40 * canvasScaleRatio }}
                  onClick={() => {
                    if (this.state.activeWearableCategory === null) return
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
                      this.state.activeWearableCategory === null
                        ? 'none'
                        : 'flex'
                  }}
                  icon={{
                    spriteName: 'RightArrow',
                    atlasName: 'icons'
                  }}
                />
                {this.state.activeWearableCategory === null ? null : (
                  <NavButton
                    active={true}
                    showDeleteButton={true}
                    onDelete={() => {
                      this.changeCategory(null)
                    }}
                    icon={{
                      spriteName: this.state.activeWearableCategory,
                      atlasName: 'backpack'
                    }}
                    text={
                      WEARABLE_CATEGORY_DEFINITIONS[
                        this.state.activeWearableCategory
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
                loading={this.state.loadingPage}
                wearables={this.state.shownWearables}
                equippedWearables={this.state.equippedWearables}
                baseBody={this.state.outfitSetup.base}
                onChangeSelection={(
                  selectedURN: URNWithoutTokenId | null
                ): void => {
                  this.state.selectedURN = selectedURN
                }}
                onEquipWearable={async (
                  wearable: CatalogWearableElement
                ): Promise<void> => {
                  urnWithTokenIdMemo[wearable.entity.metadata.id] =
                    wearable.individualData[0].id
                  await this.updateEquippedWearable(
                    wearable.category,
                    wearable.entity.metadata.id
                  )
                  updateAvatarPreview(
                    this.state.equippedWearables,
                    this.state.outfitSetup.base
                  )
                }}
                onUnequipWearable={async (
                  wearable: CatalogWearableElement
                ): Promise<void> => {
                  await this.updateEquippedWearable(wearable.category, null)
                  updateAvatarPreview(
                    this.state.equippedWearables,
                    this.state.outfitSetup.base
                  )
                }}
              />
              <Pagination
                disabled={this.state.loadingPage}
                onChange={(page: number) => {
                  this.state.currentPage = page
                  void this.updatePage()
                }}
                pages={this.state.totalPages}
                currentPage={this.state.currentPage}
              />
            </UiEntity>
            {/* SELECTED ITEM COLUMN */}
            <InfoPanel
              canvasScaleRatio={canvasScaleRatio}
              wearable={
                this.state.selectedURN === null
                  ? null
                  : catalystWearableMap[this.state.selectedURN]
              }
            />
          </UiEntity>
        </Content>
      </MainContent>
    )
  }

  changeCategory(category: WearableCategory | null): void {
    this.state.activeWearableCategory = category
    setAvatarPreviewCameraToWearableCategory(category)
    this.state.currentPage = 1
    void this.updatePage()
  }

  async updatePage(): Promise<void> {
    this.state.loadingPage = true
    // TODO improve with throttle and remove disabled prop
    const wearablesPage = await fetchWearablesPage({
      pageNum: this.state.currentPage,
      pageSize: WEARABLE_CATALOG_PAGE_SIZE,
      address:
        getPlayer()?.userId ?? '0x0000000000000000000000000000000000000000',
      wearableCategory: this.state.activeWearableCategory
    })

    this.state.totalPages = Math.ceil(
      wearablesPage.totalAmount / WEARABLE_CATALOG_PAGE_SIZE
    )
    this.state.loadingPage = false
    this.state.shownWearables = wearablesPage.elements
  }

  async saveAvatar(): Promise<void> {
    try {
      if (
        this.state.equippedWearables.sort(sortAbc).join(',') ===
        getPlayer()?.wearables.sort(sortAbc).join(',')
      )
        return
      await BevyApi.setAvatar({
        base: this.state.outfitSetup.base,
        equip: {
          wearableUrns: getWearablesWithTokenId(this.state.equippedWearables),
          emoteUrns: []
        }
      })
    } catch (error) {
      console.log('setAvatar error', error)
    }

    function sortAbc(a: string, b: string): number {
      return a.localeCompare(b)
    }
  }

  async init(): Promise<void> {
    createAvatarPreview()
    this.state.loadingPage = true
    const player = getPlayer()
    this.state.equippedWearables = (getPlayer()?.wearables ?? []).map((urn) =>
      getURNWithoutTokenId(urn as URN)
    ) as URNWithoutTokenId[]
    const equippedWearablesData: WearableEntityMetadata[] =
      await fetchWearablesData(...(this.state.equippedWearables ?? []))
    this.state.outfitSetup = {
      ...this.state.outfitSetup,
      wearables: {
        ...this.state.outfitSetup.wearables,
        ...getOutfitSetupFromWearables(
          this.state.equippedWearables,
          equippedWearablesData
        )
      },
      base: {
        ...this.state.outfitSetup.base,
        ...{
          name: player?.name ?? '',
          eyesColor: player?.avatar?.eyesColor,
          hairColor: player?.avatar?.hairColor,
          skinColor: player?.avatar?.skinColor,
          bodyShapeUrn:
            (player?.avatar?.bodyShapeUrn as URNWithoutTokenId) ?? BASE_MALE_URN
        }
      }
    }
    // TODO use cache for pages/category? but clean cache when backpack is hidden/shown
    const wearablesPage = await fetchWearablesPage({
      pageSize: WEARABLE_CATALOG_PAGE_SIZE,
      pageNum: this.state.currentPage,
      address: player?.userId ?? ZERO_ADDRESS,
      wearableCategory: this.state.activeWearableCategory
    })

    this.state.totalPages = Math.ceil(
      wearablesPage.totalAmount / WEARABLE_CATALOG_PAGE_SIZE
    )
    this.state.loadingPage = false
    this.state.shownWearables = wearablesPage.elements
  }

  async updateEquippedWearable(
    category: WearableCategory,
    wearableURN: URNWithoutTokenId | null
  ): Promise<void> {
    if (category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id) {
      this.state.outfitSetup = {
        ...this.state.outfitSetup,
        base: {
          ...this.state.outfitSetup.base,
          bodyShapeUrn: wearableURN as URNWithoutTokenId
        }
      }
    } else {
      this.state.outfitSetup = {
        ...this.state.outfitSetup,
        wearables: {
          ...this.state.outfitSetup.wearables,
          [category]: wearableURN
        }
      }
      this.state.equippedWearables =
        getWearablesFromOutfit(this.state.outfitSetup) ?? []
    }
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

function AvatarPreviewElement( ): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        height:getContentHeight(),
        width:540/1920 * getContentWidth() * 0.85
      }}
      uiBackground={{

      }}
      uiText={{value:"1"}}
    >
        {getAvatarCamera() === engine.RootEntity ? null : (
            <UiEntity
                uiTransform={{
                    positionType: 'absolute',
                    width: '100%',
                    height: '100%',
                }}
                uiBackground={{
                    videoTexture: { videoPlayerEntity: getAvatarCamera() }
                }}
            />
        )}
    </UiEntity>
  )
}

import ReactEcs, {type ReactElement, UiEntity} from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { NavButton } from '../../../components/nav-button/NavButton'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import {WEARABLE_CATEGORY_DEFINITIONS, type WearableCategory} from '../../../service/wearable-categories'
import { WearableCategoryList } from '../../../components/backpack/WearableCategoryList'
import Icon from "../../../components/icon/Icon";
import {WearableCatalogGrid} from "../../../components/backpack/WearableCatalogGrid";
import {
    catalystWearableMap,
    fetchWearablesData,
    fetchWearablesPage,
    getURNWithoutTokenId
} from "../../../utils/wearables-promise-utils";
import { getPlayer } from '@dcl/sdk/src/players'
import type {URN, URNWithoutTokenId} from "../../../utils/definitions";
import type {CatalogWearableElement, CatalystWearable, OutfitSetup} from "../../../utils/wearables-definitions";
import {EMPTY_OUTFIT, getOutfitSetupFromWearables} from "../../../service/outfit";
import {Pagination} from "../../../components/pagination";
import {InfoPanel} from "../../../components/backpack/InfoPanel";

const WEARABLE_CATALOG_PAGE_SIZE = 16;

type BackpackPageState = {
    activeWearableCategory: WearableCategory | null,
    currentPage: number,
    loadingPage: boolean,
    shownWearables: any[] // TODO remove any type
    totalPages: number
    equippedWearables: URNWithoutTokenId[]
    outfitSetup: OutfitSetup,
    selectedURN:URNWithoutTokenId|null
}

export default class BackpackPage {
  public fontSize: number = 16 * getCanvasScaleRatio() * 2

  // TODO consider redux
  private readonly state: BackpackPageState = {
    activeWearableCategory: null,
    currentPage:1,
    loadingPage:false,
    shownWearables:new Array(WEARABLE_CATALOG_PAGE_SIZE).fill(null),
    totalPages:0,
    equippedWearables:getPlayer()?.wearables.map(i=> getURNWithoutTokenId(i as URN)) as URN[],
    outfitSetup:EMPTY_OUTFIT,
      selectedURN:"urn:decentraland:matic:collections-v2:0x12cbb53b824b8249af0babebccdb8daf6437bfa0:0" as URNWithoutTokenId
  }


    async initWearablePage(): Promise<void> {
      // TODO throttle
        this.state.loadingPage = true;
        const player = getPlayer();
        this.state.equippedWearables = player?.wearables.map(i=> getURNWithoutTokenId(i as URN)) as URN[]
        const equippedWearablesData:CatalystWearable[] = await fetchWearablesData(...this.state.equippedWearables);
        this.state.outfitSetup.wearables = getOutfitSetupFromWearables(equippedWearablesData);

        // TODO use cache for pages/category? but clean cache when backpack is hidden/shown
        const wearablesPage = await fetchWearablesPage({
            pageSize: WEARABLE_CATALOG_PAGE_SIZE,
            pageNum: this.state.currentPage,
            address: player?.userId ?? "0x0000000000000000000000000000000000000000",
            wearableCategory:this.state.activeWearableCategory,
        });

        this.state.totalPages = Math.ceil(wearablesPage.totalAmount / WEARABLE_CATALOG_PAGE_SIZE)
        this.state.loadingPage = false;
        this.state.shownWearables = wearablesPage.elements;
    }



  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
      const canvasScaleRatio = getCanvasScaleRatio()

      const updatePage = async ():Promise<void> => {
          this.state.loadingPage = true;
          // TODO improve with throttle and remove disabled prop
          const wearablesPage = await fetchWearablesPage({
              pageNum: this.state.currentPage,
              pageSize: WEARABLE_CATALOG_PAGE_SIZE,
              address: getPlayer()?.userId ?? "0x0000000000000000000000000000000000000000",
              wearableCategory: this.state.activeWearableCategory,
          });

          this.state.totalPages = Math.ceil(wearablesPage.totalAmount / WEARABLE_CATALOG_PAGE_SIZE)
          this.state.loadingPage = false;
          this.state.shownWearables = wearablesPage.elements;
      }

    const changeCategory = (category:WearableCategory|null):void => {
        this.state.activeWearableCategory = category
        this.state.currentPage = 1
        void updatePage()
    }

    return (
      <MainContent>
        {/* NAVBAR */}
        <NavBar canvasScaleRatio={canvasScaleRatio}>
          {/* LEFT SECTION */}
          <LeftSection >
            <NavBarTitle text={'<b>Backpack</b>'} canvasScaleRatio={canvasScaleRatio} />
            {/* NAV-BUTTON-BAR */}
            <NavButtonBar canvasScaleRatio={canvasScaleRatio}>
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
        <Content>
            {/* AVATAR */}
            <UiEntity
                uiTransform={{
                    flexShrink:0,
                    flexGrow:0,
                    flexWrap: "wrap",
                    margin: {
                        bottom: this.fontSize,
                        right: this.fontSize
                    },
                    width: 580 * canvasScaleRatio,
                    height: '100%',
                    padding: this.fontSize,
                    pointerFilter: 'block'
                }}
                uiBackground={{
                    color:Color4.create(1,0,0,0.5)
                }}
            ></UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
              margin: 40 * canvasScaleRatio,
              padding: this.fontSize,
              pointerFilter: 'block'
            }}
            uiBackground={{
              color: { ...Color4.Black(), a: 0.35 },
              textureMode: 'nine-slices',
              texture: {
                src: 'assets/images/backgrounds/rounded.png'
              },
              textureSlices: {
                top: 0.5,
                bottom: 0.5,
                left: 0.5,
                right: 0.5
              }
            }}
          >
            {/* CATEGORY SELECTORS COLUMN */}
              <WearableCategoryList
                  outfitSetup={this.state.outfitSetup}
                  activeCategory={this.state.activeWearableCategory}
                  onSelectCategory={changeCategory}
              />
            {/* CATALOG COLUMN */}
            <UiEntity
                uiTransform={{
                    flexDirection:"column",
                    padding: 14 * canvasScaleRatio,
                    margin:{left: 30 * canvasScaleRatio}
                }}
                uiBackground={{
                    color:Color4.create(0,1,0,0)
                }}
            >
                {/* CATALOG NAV_BAR */}
                <UiEntity uiTransform={{flexDirection:"row", width: '100%'}}>
                    <NavButton
                        active={this.state.activeWearableCategory === null}
                        icon={{spriteName:"all", atlasName:"backpack"}}
                        text={"ALL"}
                        uiTransform={{padding:40*canvasScaleRatio}}
                        onClick={() => {
                            if(this.state.activeWearableCategory === null) return;
                            changeCategory(null)
                        }}
                    />
                    <Icon
                        iconSize={40 * canvasScaleRatio}
                        uiTransform={{
                            alignSelf:"center",
                            margin:{left:16*canvasScaleRatio, right:16*canvasScaleRatio},
                            display:this.state.activeWearableCategory === null ? "none":"flex"
                        }}
                        icon={{
                        spriteName:"RightArrow",
                        atlasName:"icons"
                    }} />
                    {this.state.activeWearableCategory === null
                        ? null
                        : <NavButton
                            active={true}
                            showDeleteButton={true}
                            onDelete={()=> { changeCategory(null)}}
                        icon={{spriteName:this.state.activeWearableCategory, atlasName:"backpack"}}
                        text={WEARABLE_CATEGORY_DEFINITIONS[this.state.activeWearableCategory].label}
                        uiTransform={{padding:20*canvasScaleRatio}} />}
                </UiEntity>
                <WearableCatalogGrid
                    uiTransform={{
                        margin:{top:20*canvasScaleRatio},
                    }}
                    loading={this.state.loadingPage}
                    wearables={this.state.shownWearables}
                    equippedWearables={this.state.equippedWearables}
                    onChangeSelection={(selectedURN:URNWithoutTokenId|null):void=>{
                        this.state.selectedURN =selectedURN
                    }}
                    onEquipWearable={(wearable:CatalogWearableElement):void=>{
                        // TODO
                        console.log("on Equip wearable", wearable)
                    }}
                    onUnequipWearable={(wearable:CatalogWearableElement):void=>{
                        // TODO
                        console.log("on Unequi Wearable", wearable)
                    }}
                />
                <Pagination
                    disabled={this.state.loadingPage}
                    onChange={(page:number)=>{
                        this.state.currentPage = page;
                        void updatePage();
                    }}
                    pages={this.state.totalPages} currentPage={this.state.currentPage} />
            </UiEntity>
            {/* SELECTED ITEM COLUMN */}
            <InfoPanel canvasScaleRatio={canvasScaleRatio} wearable={
                this.state.selectedURN === null
                    ? null
                    : catalystWearableMap[this.state.selectedURN]} />
          </UiEntity>
        </Content>
      </MainContent>
    )
  }
}

function MainContent({children}:any):ReactElement{
    return <UiEntity
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
    >{children}</UiEntity>
}

function NavBar({children, canvasScaleRatio}:any):ReactElement{
    return  <UiEntity
        uiTransform={{
            flexDirection: 'row',
            width: '100%',
            height: 120 * canvasScaleRatio,
            pointerFilter: 'block'
        }}
        uiBackground={{
            color: { ...Color4.Black(), a: 0.4 }
        }}
    >{children}</UiEntity>
}

function LeftSection({children}:any):ReactElement{
    return <UiEntity
        uiTransform={{
            height: '100%',
            flexDirection: 'row',
            padding: 0,
            alignItems: 'flex-start',
            alignSelf: 'flex-start'
        }}
    >{children}</UiEntity>
}

function NavBarTitle({text, canvasScaleRatio}:{text:string, canvasScaleRatio:number}):ReactElement{
    return <UiEntity
        uiTransform={{
            padding: 0,
            margin: { top: -8, left: 4 }
        }}
        uiText={{
            value: text,
            fontSize: 64 * canvasScaleRatio
        }}
    />
}

function NavButtonBar({children, canvasScaleRatio}:any):ReactElement{
    return <UiEntity
        uiTransform={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: { left: 10 * canvasScaleRatio * 2 }
        }}
        uiBackground={{
            color: { ...Color4.Blue(), a: 0.0 }
        }}
    >{children}</UiEntity>
}

function Content({children}:any):ReactElement{
    return <UiEntity
        uiTransform={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            height: 'auto',
            flexGrow: 1,
            pointerFilter: 'block'
        }}
    >{children}</UiEntity>
}


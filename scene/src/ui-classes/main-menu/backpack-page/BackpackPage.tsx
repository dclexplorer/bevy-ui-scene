import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { NavButton } from '../../../components/nav-button/NavButton'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import {WEARABLE_CATEGORY_DEFINITIONS, type WearableCategory} from '../../../service/wearable-categories'
import { WearableCategoryList } from '../../../components/backpack/WearableCategoryList'
import Icon from "../../../components/icon/Icon";
import {WearableCatalogGrid} from "../../../components/backpack/WearableCatalogGrid";
import {store} from "../../../state/store";

const WEARABLE_CATALOG_PAGE_SIZE = 16;

type BackpackPageState = {
  activeWearableCategory: WearableCategory | null,
  currentPage:number,
    loadingPage:boolean,
    shownWearables:any[] // TODO remove any type
}
type WearableCatalogPageParams = {
    pageNum: number
    pageSize: number
    address: string
    wearableCategory: WearableCategory | null
    includeBase: boolean
    includeOnChain: boolean
}
export default class BackpackPage {
  public fontSize: number = 16 * getCanvasScaleRatio() * 2

  // TODO consider redux
  private readonly state: BackpackPageState = {
    activeWearableCategory: null,
    currentPage:0,
    loadingPage:false,
    shownWearables:new Array(WEARABLE_CATALOG_PAGE_SIZE).fill(null)
  }

  async fetchWearablesPage():Promise<void>{
      return await (await fetch(getWearableCatalogPageURL({
          pageNum:this.state.currentPage,
          pageSize:WEARABLE_CATALOG_PAGE_SIZE,
          address:'0x0000000000000000000000000000000000000000',// '0x598f8af1565003AE7456DaC280a18ee826Df7a2c'
          wearableCategory:this.state.activeWearableCategory,
          includeBase:true,
          includeOnChain:true
      }))).json();

      function getWearableCatalogPageURL({pageNum, pageSize, address, wearableCategory, includeBase, includeOnChain}:WearableCatalogPageParams):string {
          // TODO use realm BaseURL ?
          let str:string = `https://peer.decentraland.org/explorer/${address}?pageNum=${pageNum}&pageSize=${pageSize}`;
          if(wearableCategory !== null){
              str += `&category=${wearableCategory}`
          }
          if(includeBase){
              str += `&collectionType=base-wearable`
          }
          if(includeOnChain){
              str += `&collectionType=on.chain`
          }
          return str;
      }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    const canvasScaleRatio = getCanvasScaleRatio()

    return (
      <UiEntity
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
        {/* NAVBAR */}
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
          {/* LEFT SECTION */}
          <UiEntity
            uiTransform={{
              height: '100%',
              flexDirection: 'row',
              padding: 0,
              alignItems: 'flex-start',
              alignSelf: 'flex-start'
            }}
            uiBackground={{
              color: { ...Color4.Green(), a: 0.0 }
            }}
          >
            <UiEntity
              uiTransform={{
                padding: 0,
                margin: { top: -8, left: 4 }
              }}
              uiText={{
                value: '<b>Backpack</b>',
                fontSize: 64 * canvasScaleRatio
              }}
            ></UiEntity>
            {/* NAV-BUTTON-BAR */}
            <UiEntity
              uiTransform={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: { left: 10 * canvasScaleRatio * 2 }
              }}
              uiBackground={{
                color: { ...Color4.Blue(), a: 0.0 }
              }}
            >
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
            </UiEntity>
          </UiEntity>
          <UiEntity></UiEntity>
        </UiEntity>
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',

            width: '100%',
            height: 'auto',
            flexGrow: 1,
            pointerFilter: 'block'
          }}
        >
          {/* AVATAR */}
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              margin: {
                bottom: this.fontSize,
                right: this.fontSize
              },
              width: 580,
              height: '80%',
              padding: this.fontSize,
              minHeight: canvasInfo.height * 0.9 * 0.85 * 0.1,
              pointerFilter: 'block'
            }}
          ></UiEntity>

          {/* CONTENT */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
              margin: {
                bottom: this.fontSize,
                right: this.fontSize,
                top: this.fontSize
              },
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
              activeCategory={this.state.activeWearableCategory}
              onSelectCategory={(category: WearableCategory | null) =>
                (this.state.activeWearableCategory = category)
              }
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
                        onClick={() => {this.state.activeWearableCategory = null}}
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
                            onDelete={()=> {this.state.activeWearableCategory = null}}
                        icon={{spriteName:this.state.activeWearableCategory, atlasName:"backpack"}}
                        text={WEARABLE_CATEGORY_DEFINITIONS[this.state.activeWearableCategory].label}
                        uiTransform={{padding:20*canvasScaleRatio}} />}
                </UiEntity>
                <WearableCatalogGrid
                    uiTransorm={{
                        margin:{top:20*canvasScaleRatio},
                    }}
                    loading={true}
                    wearables={this.state.shownWearables}
                    equippedWearables={store.getState().backpack.wearables}
                />
            </UiEntity>
            {/* SELECTED ITEM COLUMN */}
            <UiEntity uiTransform={{
                margin:{left: 40 * canvasScaleRatio },
                width: 560 * canvasScaleRatio,
                height: 1400 * canvasScaleRatio,
            }} uiBackground={{color:Color4.create(0,0,1,0.3)}}></UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}

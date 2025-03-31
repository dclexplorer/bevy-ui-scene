import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Vector2, type Color4, type Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { store } from 'src/state/store'
import type { PlaceFromApi } from 'src/ui-classes/scene-info-card/SceneInfoCard.types'
import { ButtonIcon } from '../../../components/button-icon'
import Canvas from '../../../components/canvas/Canvas'
import type { UIController } from '../../../controllers/ui.controller'
import {
  ALMOST_WHITE,
  ALPHA_BLACK_PANEL,
  LEFT_PANEL_MIN_WIDTH,
  LEFT_PANEL_WIDTH_FACTOR,
  ROUNDED_TEXTURE_BACKGROUND,
  SELECTED_BUTTON_COLOR,
  UNSELECTED_TEXT_WHITE
} from '../../../utils/constants'
import type { AtlasIcon } from '../../../utils/definitions'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import type { HomeScene, LiveSceneInfo } from 'src/bevy-api/interface'
import { BevyApi } from 'src/bevy-api'
import { setHome } from 'src/state/sceneInfo/actions'

export default class SceneInfo {
  private readonly uiController: UIController
  public liveSceneInfo: LiveSceneInfo | undefined
  private home: HomeScene | undefined
  private realm: string | undefined
  private sceneCoords: Vector3 | undefined
  public place: PlaceFromApi | undefined
  public fontSize: number = 16
  private isWarningScene: boolean = true
  public isExpanded: boolean = false
  public isMenuOpen: boolean = false
  public isHome: boolean = false
  public hideSceneUi: boolean = false

  public favText: string = ''

  public expandIcon: AtlasIcon = {
    atlasName: 'icons',
    spriteName: 'DownArrow'
  }

  public setAtHomeIcon: AtlasIcon = {
    atlasName: 'icons',
    spriteName: 'HomeOutline'
  }

  public reloadIcon: AtlasIcon = {
    atlasName: 'icons',
    spriteName: 'Reset'
  }

  public infoIcon: AtlasIcon = {
    atlasName: 'icons',
    spriteName: 'InfoButton'
  }

  public sceneUiToggle: AtlasIcon = {
    atlasName: 'toggles',
    spriteName: 'SwitchOff'
  }

  public expandBackgroundColor: Color4 | undefined = undefined
  public menuBackgroundColor: Color4 | undefined = undefined
  public setHomeLabelColor: Color4 = UNSELECTED_TEXT_WHITE
  public reloadLabelColor: Color4 = UNSELECTED_TEXT_WHITE
  public openInfoLabelColor: Color4 = UNSELECTED_TEXT_WHITE
  public sceneUiLabelColor: Color4 = UNSELECTED_TEXT_WHITE
  public setFavLabelColor: Color4 = UNSELECTED_TEXT_WHITE

  // public fpsValue: number = 0
  // public uniqueGltfMeshesValue: number = 0
  // public visibleMeshCountValue: number = 0
  // public visibleTriangleCountValue: number = 0
  // public uniqueGltfMaterialsValue: number = 0
  // public visibleMaterialCountValue: number = 0
  // public totalTextureCountValue: number = 0
  // public totalTextureMemoryValue: number = 0
  // public totalEntitiesValue: number = 0
  public flagIcon: string | undefined
  private flagHint: string = 'This scene was rated as an adult scene.'
  private isFlagHintVisible: boolean = false
  private warningHint: string =
    'This scene is restricting the use of some features: \n - The camera is locked'

  private isWarningHintVisible: boolean = false
  // private isLoadingHintVisible: boolean = false
  // private isSceneLoading: boolean = false
  private readonly loadingIcon: AtlasIcon = {
    atlasName: 'icons',
    spriteName: 'Graphics'
  }

  // private timer: number = 0

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  async update(): Promise<void> {
    this.place = store.getState().scene.explorerPlace
    this.liveSceneInfo = store.getState().scene.explorerScene
    this.home = store.getState().scene.home
    this.sceneCoords = store.getState().scene.explorerPlayerPosition
    this.realm = await BevyApi.getRealmProvider()
    if (this.home !== undefined && this.sceneCoords !== undefined) {
      if (
        this.home.parcel.x === this.sceneCoords.x &&
        this.home.parcel.y === this.sceneCoords.z &&
        this.realm === this.home.realm
      ) {
        this.isHome = true
      } else {
        this.isHome = false
      }
    } else {
      this.isHome = false
    }

    if (this.place === undefined || this.liveSceneInfo === undefined) return

    this.setFlag(this.place.content_rating)
    this.updateIcons()
  }

  setWarning(status: boolean, message: string): void {
    this.isWarningScene = status
    this.warningHint = message
  }

  async toggleSceneUi(): Promise<void> {
    const response = await BevyApi.showUi(
      this.liveSceneInfo?.hash,
      !this.hideSceneUi
    )
    this.hideSceneUi = !response
    this.updateIcons()
  }

  setFlag(arg: string | undefined): void {
    switch (arg) {
      case 'A':
        this.flagHint = 'This scene was rated as an adult scene.  +18'
        this.flagIcon = 'adult'
        break
      // RP is for Rating Pending  ?
      // case 'RP':
      //   this.flagHint = 'This scene was rated as a restricted scene.'
      //   this.flagIcon = 'restricted'
      //   break
      case 'R':
        this.flagHint = 'This scene was rated as a restricted scene.'
        this.flagIcon = 'restricted'
        break
      case 'T':
        this.flagHint = 'This scene was rated as a teen scene. +13'
        this.flagIcon = 'teen'
        break
      default:
        this.flagHint = ''
        this.flagIcon = undefined
    }
  }

  // setFps(arg: number): void {
  //   this.fpsValue = arg
  // }

  // setUniqueGltfMeshes(arg: number): void {
  //   this.uniqueGltfMeshesValue = arg
  // }

  // setVisibleMeshCount(arg: number): void {
  //   this.visibleMeshCountValue = arg
  // }

  // setVisibleTriangleCount(arg: number): void {
  //   this.visibleTriangleCountValue = arg
  // }

  // setUniqueGltfMaterials(arg: number): void {
  //   this.uniqueGltfMaterialsValue = arg
  // }

  // setVisibleMaterialCount(arg: number): void {
  //   this.visibleMaterialCountValue = arg
  // }

  // setTotalTextureCount(arg: number): void {
  //   this.totalTextureCountValue = arg
  // }

  // setTotalTextureMemory(arg: number): void {
  //   this.totalTextureMemoryValue = arg
  // }

  // setTotalEntities(arg: number): void {
  //   this.totalEntitiesValue = arg
  // }

  // setLoading(loading: boolean): void {
  //   this.isSceneLoading = loading
  //   if (loading) {
  //     engine.addSystem(this.loadingSystem.bind(this))
  //   } else {
  //     engine.removeSystem(this.loadingSystem.bind(this))
  //   }
  // }

  // loadingSystem(): void {
  //   if (this.timer > 500) {
  //     this.timer = 0
  //     if (this.loadingIcon.spriteName === 'Graphics') {
  //       this.loadingIcon.spriteName = 'Download'
  //     } else {
  //       this.loadingIcon.spriteName = 'Graphics'
  //     }
  //   } else {
  //     this.timer = this.timer + 5
  //   }
  // }

  updateIcons(): void {
    if (this.isExpanded) {
      this.expandIcon.spriteName = 'UpArrow'
    } else {
      this.expandIcon.spriteName = 'DownArrow'
    }
    if (this.isHome) {
      this.setAtHomeIcon.spriteName = 'Home'
    } else {
      this.setAtHomeIcon.spriteName = 'HomeOutline'
    }
    if (this.hideSceneUi) {
      this.sceneUiToggle.spriteName = 'SwitchOn'
    } else {
      this.sceneUiToggle.spriteName = 'SwitchOff'
    }
  }

  setMenuOpen(arg: boolean): void {
    this.isMenuOpen = arg
  }

  async setExpanded(arg: boolean): Promise<void> {
    this.isExpanded = arg
    this.updateIcons()
  }

  async setHome(realm?: string, position?: Vector3 | undefined): Promise<void> {
    const newRealm = realm ?? 'https://peer-ec1.decentraland.org/about'
    const newParcel =
      Vector2.create(position?.x, position?.z) ?? Vector2.create(0, 0)
    this.home = { realm: newRealm, parcel: newParcel }
    store.dispatch(setHome(this.home))
    BevyApi.setHomeScene(this.home)
    void this.update()
  }

  async reloadScene(hash?: string): Promise<void> {
    if (hash) {
      await BevyApi.reload(hash)
    } else {
      await BevyApi.reload(undefined)
    }
  }

  async openSceneInfo(): Promise<void> {
    const sceneCoords = store.getState().scene.explorerPlayerPosition
    if (sceneCoords !== undefined) {
      await this.uiController.sceneCard.show(sceneCoords)
    }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    if (this.place === undefined) return null
    // if (this.place === undefined) {this.place = EMPTY_PLACE}
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const sceneCoords = store.getState().scene.explorerPlayerPosition
    if (sceneCoords === undefined) return null

    let leftPosition: number
    if ((canvasInfo.width * 2.5) / 100 < 45) {
      leftPosition = 45 + (canvasInfo.width * 1) / 100
    } else {
      leftPosition = (canvasInfo.width * 3.4) / 100
    }

    let panelWidth: number

    if (canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR < LEFT_PANEL_MIN_WIDTH) {
      panelWidth = LEFT_PANEL_MIN_WIDTH
    } else {
      panelWidth = canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR
    }

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: panelWidth,
            height: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            position: {
              left: this.uiController.mainHud.isSideBarVisible
                ? leftPosition
                : canvasInfo.width * 0.01,
              top: canvasInfo.width * 0.01
            },
            positionType: 'absolute'
          }}
          uiBackground={{
            ...ROUNDED_TEXTURE_BACKGROUND,
            color: ALPHA_BLACK_PANEL
          }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: 'auto',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            {/* <ButtonIcon
              onMouseDown={() => {
                void this.setExpanded(!this.isExpanded)
                this.setLoading(!this.isExpanded)
              }}
              onMouseEnter={() => {
                this.expandBackgroundColor = SELECTED_BUTTON_COLOR
              }}
              onMouseLeave={() => {
                this.expandBackgroundColor = undefined
              }}
              uiTransform={{
                width: this.fontSize * 2,
                height: this.fontSize * 2,
                margin: { left: this.fontSize * 0.5 }
              }}
              backgroundColor={this.expandBackgroundColor}
              icon={this.expandIcon}
            /> */}
            <UiEntity
              uiTransform={{
                width: 'auto',
                height: 'auto',
                justifyContent: 'flex-start',
                padding: this.fontSize * 0.5,
                alignItems: 'flex-start',
                flexDirection: 'column',
                flexGrow: 1
              }}
            >
              <Label
                value={this.place.title}
                fontSize={this.fontSize}
                uiTransform={{ height: this.fontSize * 1.1 }}
                textAlign="middle-left"
              />
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: this.fontSize,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  margin: {
                    left: this.fontSize * 0.25,
                    top: this.fontSize * 0.25
                  }
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: this.fontSize * 0.875,
                    height: this.fontSize * 0.875
                  }}
                  uiBackground={{
                    ...getBackgroundFromAtlas({
                      atlasName: 'icons',
                      spriteName: 'PinIcn'
                    }),
                    color: UNSELECTED_TEXT_WHITE
                  }}
                />
                <Label
                  value={
                    sceneCoords.x.toString() + ',' + sceneCoords.z.toString()
                  }
                  fontSize={this.fontSize}
                  uiTransform={{}}
                />

                <UiEntity
                  uiTransform={{
                    display:
                      this.liveSceneInfo?.sdkVersion === 'sdk6'
                        ? 'flex'
                        : 'none',
                    width: (this.fontSize * 0.875) / 0.41,
                    height: this.fontSize * 0.875,
                    margin: { left: this.fontSize * 0.5 }
                  }}
                  uiBackground={{
                    ...getBackgroundFromAtlas({
                      atlasName: 'icons',
                      spriteName: 'Tag'
                    })
                  }}
                />

                <ButtonIcon
                  uiTransform={{
                    display:
                      this.liveSceneInfo?.isBroken === true ? 'flex' : 'none',
                    width: this.fontSize * 1.2,
                    height: this.fontSize * 1.2,
                    margin: { left: this.fontSize * 0.5 }
                  }}
                  icon={{ atlasName: 'icons', spriteName: 'WarningError' }}
                  iconSize={this.fontSize}
                  onMouseEnter={() => {
                    this.isWarningHintVisible = true
                  }}
                  onMouseLeave={() => {
                    this.isWarningHintVisible = false
                  }}
                  hintText={'Scene is broken'}
                  showHint={this.liveSceneInfo?.isBroken}
                  hintFontSize={this.fontSize * 0.75}
                />

                <ButtonIcon
                  uiTransform={{
                    display: this.flagIcon !== undefined ? 'flex' : 'none',
                    width: this.fontSize * 1.2,
                    height: this.fontSize * 1.2,
                    margin: { left: this.fontSize * 0.5 }
                  }}
                  icon={{
                    atlasName: 'toggles',
                    spriteName: this.flagIcon ?? ''
                  }}
                  iconSize={this.fontSize}
                  onMouseEnter={() => {
                    this.isFlagHintVisible = true
                  }}
                  onMouseLeave={() => {
                    this.isFlagHintVisible = false
                  }}
                  hintText={this.flagHint}
                  showHint={this.isFlagHintVisible}
                  hintFontSize={this.fontSize * 0.75}
                />
                {/* <ButtonIcon
                  uiTransform={{
                    display: this.isSceneLoading ? 'flex' : 'none',
                    width: this.fontSize * 1.2,
                    height: this.fontSize * 1.2,
                    margin: { left: this.fontSize * 0.5 }
                  }}
                  icon={this.loadingIcon}
                  iconSize={this.fontSize}
                  onMouseEnter={() => {
                    this.isLoadingHintVisible = true
                  }}
                  onMouseLeave={() => {
                    this.isLoadingHintVisible = false
                  }}
                  hintText="Scene is loading"
                  showHint={this.isLoadingHintVisible}
                  hintFontSize={this.fontSize * 0.75}
                /> */}
              </UiEntity>
            </UiEntity>

            <ButtonIcon
              onMouseDown={() => {
                this.setMenuOpen(!this.isMenuOpen)
              }}
              onMouseEnter={() => {
                this.menuBackgroundColor = SELECTED_BUTTON_COLOR
              }}
              onMouseLeave={() => {
                this.menuBackgroundColor = undefined
              }}
              uiTransform={{
                width: this.fontSize * 2,
                height: this.fontSize * 2,
                margin: { right: this.fontSize * 0.5 }
              }}
              backgroundColor={this.menuBackgroundColor}
              icon={{ atlasName: 'icons', spriteName: 'Menu' }}
              iconSize={this.fontSize * 1.5}
            />
          </UiEntity>

          <UiEntity
            uiTransform={{
              display: this.isMenuOpen ? 'flex' : 'none',
              minWidth: 175,
              width: canvasInfo.width * 0.1,
              height: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              position: {
                left: '105%',
                top: 0
              },
              positionType: 'absolute'
            }}
            uiBackground={{
              ...ROUNDED_TEXTURE_BACKGROUND,
              color: ALPHA_BLACK_PANEL
            }}
          >
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
              onMouseDown={() => {
                void this.toggleSceneUi()
              }}
              onMouseEnter={() => {
                this.sceneUiLabelColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.sceneUiLabelColor = UNSELECTED_TEXT_WHITE
              }}
            >
              <Label
                value={'Hide Scene UI'}
                fontSize={this.fontSize * 0.8}
                color={this.sceneUiLabelColor}
              />
              <UiEntity
                uiTransform={{
                  width: (this.fontSize * 0.8 * 65) / 36,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.sceneUiToggle),
                  color: this.sceneUiLabelColor
                }}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row'
              }}
              onMouseDown={() => {
                if (this.isHome) {
                  void this.setHome()
                } else {
                  void this.setHome(this.realm, this.sceneCoords)
                }
              }}
              onMouseEnter={() => {
                this.setHomeLabelColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.setHomeLabelColor = UNSELECTED_TEXT_WHITE
              }}
            >
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 0.8,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.setAtHomeIcon),
                  color: this.setHomeLabelColor
                }}
              />
              <Label
                value={this.isHome ? 'Unset as Home' : 'Set as Home'}
                fontSize={this.fontSize * 0.8}
                color={this.setHomeLabelColor}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row'
              }}
              onMouseDown={() => {
                void this.reloadScene(this.liveSceneInfo?.hash)
              }}
              onMouseEnter={() => {
                this.reloadLabelColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.reloadLabelColor = UNSELECTED_TEXT_WHITE
              }}
            >
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 0.8,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.reloadIcon),
                  color: this.reloadLabelColor
                }}
              />
              <Label
                value="Reload Scene"
                fontSize={this.fontSize * 0.8}
                color={this.reloadLabelColor}
              />
            </UiEntity>
            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row'
              }}
              onMouseDown={() => {
                void this.openSceneInfo()
              }}
              onMouseEnter={() => {
                this.openInfoLabelColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.openInfoLabelColor = UNSELECTED_TEXT_WHITE
              }}
            >
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 0.8,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.infoIcon),
                  color: this.openInfoLabelColor
                }}
              />
              <Label
                value="Scene Info"
                fontSize={this.fontSize * 0.8}
                color={this.openInfoLabelColor}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  debugPanel(): ReactEcs.JSX.Element | null {
    return null
    // return(
    //   <UiEntity
    //         uiTransform={{
    //           display: this.isExpanded ? 'flex' : 'none',
    //           width: '95%',
    //           height: 'auto',
    //           flexDirection: 'column'
    //         }}
    //       >
    //         {/* FPS */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label value="FPS" fontSize={this.fontSize * 0.7} />
    //           <Label
    //             value={this.fpsValue.toString()}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>

    //         <UiEntity
    //           uiTransform={{ width: '100%', height: 1 }}
    //           uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
    //         />

    //         {/* UNIQUE GLTF MESHES */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label
    //             value="Unique GLTF Meshes"
    //             fontSize={this.fontSize * 0.7}
    //           />
    //           <Label
    //             value={this.uniqueGltfMeshesValue.toString()}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>

    //         <UiEntity
    //           uiTransform={{ width: '100%', height: 1 }}
    //           uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
    //         />

    //         {/* VISIBLE MESH COUNT */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label
    //             value="Visible Mesh Count"
    //             fontSize={this.fontSize * 0.7}
    //           />
    //           <Label
    //             value={this.visibleMeshCountValue.toString()}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>

    //         <UiEntity
    //           uiTransform={{ width: '100%', height: 1 }}
    //           uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
    //         />

    //         {/* VISIBLE TRIANGLE COUNT */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label
    //             value="Visible Triangle Count"
    //             fontSize={this.fontSize * 0.7}
    //           />
    //           <Label
    //             value={this.visibleTriangleCountValue.toString()}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>

    //         <UiEntity
    //           uiTransform={{ width: '100%', height: 1 }}
    //           uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
    //         />

    //         {/* UNIQUE GLTF MATERIALS */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label
    //             value="Unique GLTF Materials"
    //             fontSize={this.fontSize * 0.7}
    //           />
    //           <Label
    //             value={this.uniqueGltfMaterialsValue.toString()}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>

    //         <UiEntity
    //           uiTransform={{ width: '100%', height: 1 }}
    //           uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
    //         />

    //         {/* VISIBLE MATERIAL COUNT */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label
    //             value="Visible Material Count"
    //             fontSize={this.fontSize * 0.7}
    //           />
    //           <Label
    //             value={this.visibleMaterialCountValue.toString()}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>

    //         <UiEntity
    //           uiTransform={{ width: '100%', height: 1 }}
    //           uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
    //         />

    //         {/* TOTAL TEXTURE COUNT */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label
    //             value="Total Texture Count"
    //             fontSize={this.fontSize * 0.7}
    //           />
    //           <Label
    //             value={this.totalTextureCountValue.toString()}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>

    //         <UiEntity
    //           uiTransform={{ width: '100%', height: 1 }}
    //           uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
    //         />

    //         {/* TOTAL TEXTURE MEMORY */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label
    //             value="Total Texture Memory"
    //             fontSize={this.fontSize * 0.7}
    //           />
    //           <Label
    //             value={this.totalTextureMemoryValue.toString() + 'mb'}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>

    //         <UiEntity
    //           uiTransform={{ width: '100%', height: 1 }}
    //           uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
    //         />

    //         {/* TOTAL ENTITIES */}
    //         <UiEntity
    //           uiTransform={{
    //             width: '100%',
    //             height: 'auto',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //           }}
    //         >
    //           <Label value="Total Entities" fontSize={this.fontSize * 0.7} />
    //           <Label
    //             value={this.totalEntitiesValue.toString()}
    //             fontSize={this.fontSize * 0.7}
    //           />
    //         </UiEntity>
    //       </UiEntity>
    // )
  }
}

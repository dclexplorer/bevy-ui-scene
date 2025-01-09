import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import type { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
// import IconButton from '../../components/iconButton'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/canvas'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import {
  ALMOST_WHITE,
  ALPHA_BLACK_PANEL,
  LEFT_PANEL_MIN_WIDTH,
  LEFT_PANEL_WIDTH_FACTOR,
  SELECTED_BUTTON_COLOR,
  UNSELECTED_TEXT_WHITE
} from '../../utils/constants'
import { type Icon } from '../../utils/definitions'
import IconButton from '../../components/button-icon/iconButton'

export class SceneInfo {
  private readonly uiController: UIController
  public fontSize: number = 16
  private isWarningScene: boolean = true
  public sceneName: string = 'Scene Name ASD'
  public sceneCoords: { x: number; y: number } = { x: -155, y: 123 }
  public isSdk6: boolean = true
  public isFav: boolean = true
  public isExpanded: boolean = false
  public isMenuOpen: boolean = false
  public isHome: boolean = false
  public favIcon: Icon = { atlasName: 'toggles', spriteName: 'HeartOnOutlined' }
  public expandIcon: Icon = { atlasName: 'icons', spriteName: 'DownArrow' }
  public setAtHomeIcon: Icon = { atlasName: 'icons', spriteName: 'HomeOutline' }
  public reloadIcon: Icon = { atlasName: 'icons', spriteName: 'Reset' }
  public infoIcon: Icon = { atlasName: 'icons', spriteName: 'InfoButton' }
  public sceneUiToggle: Icon = { atlasName: 'toggles', spriteName: 'SwitchOff' }
  public expandBackgroundColor: Color4 | undefined = undefined
  public menuBackgroundColor: Color4 | undefined = undefined
  public setHomeLabelColor: Color4 = UNSELECTED_TEXT_WHITE
  public reloadLabelColor: Color4 = UNSELECTED_TEXT_WHITE
  public openInfoLabelColor: Color4 = UNSELECTED_TEXT_WHITE
  public sceneUiLabelColor: Color4 = UNSELECTED_TEXT_WHITE
  public setFavLabelColor: Color4 = UNSELECTED_TEXT_WHITE

  public fpsValue: number = 0
  public uniqueGltfMeshesValue: number = 0
  public visibleMeshCountValue: number = 0
  public visibleTriangleCountValue: number = 0
  public uniqueGltfMaterialsValue: number = 0
  public visibleMaterialCountValue: number = 0
  public totalTextureCountValue: number = 0
  public totalTextureMemoryValue: number = 0
  public totalEntitiesValue: number = 0
  public flag: 'adult' | 'restricted' | 'teen' | undefined = 'adult'
  private flagHint: string = 'This scene was rated as an adult scene.'
  private isFlagHintVisible: boolean = false
  private warningHint: string =
    'This scene is restricting the use of some features: \n - The camera is locked'

  private isWarningHintVisible: boolean = false
  private isLoadingHintVisible: boolean = false
  private isSceneLoading: boolean = false
  private readonly loadingIcon: Icon = {
    atlasName: 'icons',
    spriteName: 'Graphics'
  }

  private timer: number = 0

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  setWarning(status: boolean, message: string): void {
    this.isWarningScene = status
    this.warningHint = message
  }

  setFlag(arg: 'adult' | 'restricted' | 'teen' | undefined): void {
    this.flag = arg
    switch (arg) {
      case 'adult':
        this.flagHint = 'This scene was rated as an adult scene.'
        break
      case 'restricted':
        this.flagHint = 'This scene was rated as a restricted scene.'
        break
      case 'teen':
        this.flagHint = 'This scene was rated as a teen scene.'
        break
    }
  }

  setFps(arg: number): void {
    this.fpsValue = arg
  }

  setUniqueGltfMeshes(arg: number): void {
    this.uniqueGltfMeshesValue = arg
  }

  setVisibleMeshCount(arg: number): void {
    this.visibleMeshCountValue = arg
  }

  setVisibleTriangleCount(arg: number): void {
    this.visibleTriangleCountValue = arg
  }

  setUniqueGltfMaterials(arg: number): void {
    this.uniqueGltfMaterialsValue = arg
  }

  setVisibleMaterialCount(arg: number): void {
    this.visibleMaterialCountValue = arg
  }

  setTotalTextureCount(arg: number): void {
    this.totalTextureCountValue = arg
  }

  setTotalTextureMemory(arg: number): void {
    this.totalTextureMemoryValue = arg
  }

  setTotalEntities(arg: number): void {
    this.totalEntitiesValue = arg
  }

  setLoading(loading: boolean): void {
    this.isSceneLoading = loading
    if (loading) {
      engine.addSystem(this.loadingSystem.bind(this))
    } else {
      engine.removeSystem(this.loadingSystem.bind(this))
    }
  }

  loadingSystem(): void {
    if (this.timer > 500) {
      this.timer = 0
      if (this.loadingIcon.spriteName === 'Graphics') {
        this.loadingIcon.spriteName = 'Download'
      } else {
        this.loadingIcon.spriteName = 'Graphics'
      }
    } else {
      this.timer = this.timer + 5
    }
  }

  updateIcons(): void {
    if (this.isFav) {
      this.favIcon.spriteName = 'HeartOnOutlined'
    } else {
      this.favIcon.spriteName = 'HeartOffOutlined'
    }
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
  }

  setFav(arg: boolean): void {
    this.isFav = arg
    this.updateIcons()
  }

  setMenuOpen(arg: boolean): void {
    this.isMenuOpen = arg
  }

  setExpanded(arg: boolean): void {
    this.isExpanded = arg
    this.updateIcons()
  }

  setHome(arg: boolean): void {
    this.isHome = arg
    this.updateIcons()
  }

  reloadScene(): void {
    console.log('RELOAD SCENE')
  }

  openSceneInfo(): void {
    this.uiController.sceneCard.show()
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
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
            color: ALPHA_BLACK_PANEL,
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
          <UiEntity
            uiTransform={{
              width: '100%',
              height: 'auto',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <IconButton
              onMouseDown={() => {
                this.setExpanded(!this.isExpanded)
                this.setLoading(!this.isExpanded)
              }}
              onMouseEnter={() => {
                this.expandBackgroundColor = SELECTED_BUTTON_COLOR
              }}
              onMouseLeave={() => {
                this.expandBackgroundColor = this.isExpanded
                  ? SELECTED_BUTTON_COLOR
                  : undefined
              }}
              uiTransform={{
                width: this.fontSize * 2,
                height: this.fontSize * 2,
                margin: { left: this.fontSize * 0.5 }
              }}
              backgroundColor={this.expandBackgroundColor}
              icon={this.expandIcon}
            />
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
                value={this.sceneName}
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
                    this.sceneCoords.x.toString() +
                    ',' +
                    this.sceneCoords.y.toString()
                  }
                  fontSize={this.fontSize}
                  uiTransform={{}}
                />

                <UiEntity
                  uiTransform={{
                    display: this.isSdk6 ? 'flex' : 'none',
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

                <IconButton
                  uiTransform={{
                    display:
                      this.isWarningScene !== undefined ? 'flex' : 'none',
                    width: this.fontSize * 1.2,
                    height: this.fontSize * 1.2,
                    margin: { left: this.fontSize * 0.5 }
                  }}
                  icon={{ atlasName: 'icons', spriteName: 'WarningError' }}
                  onMouseEnter={() => {
                    this.isWarningHintVisible = true
                  }}
                  onMouseLeave={() => {
                    this.isWarningHintVisible = false
                  }}
                  hintText={this.warningHint}
                  showHint={this.isWarningHintVisible}
                  hintFontSize={this.fontSize * 0.75}
                />

                <IconButton
                  uiTransform={{
                    display: this.flag !== undefined ? 'flex' : 'none',
                    width: this.fontSize * 1.2,
                    height: this.fontSize * 1.2,
                    margin: { left: this.fontSize * 0.5 }
                  }}
                  icon={{ atlasName: 'toggles', spriteName: this.flag ?? '' }}
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
                <IconButton
                  uiTransform={{
                    display: this.isSceneLoading ? 'flex' : 'none',
                    width: this.fontSize * 1.2,
                    height: this.fontSize * 1.2,
                    margin: { left: this.fontSize * 0.5 }
                  }}
                  icon={this.loadingIcon}
                  onMouseEnter={() => {
                    this.isLoadingHintVisible = true
                  }}
                  onMouseLeave={() => {
                    this.isLoadingHintVisible = false
                  }}
                  hintText="Scene is loading"
                  showHint={this.isLoadingHintVisible}
                  hintFontSize={this.fontSize * 0.75}
                />
              </UiEntity>
            </UiEntity>

            <IconButton
              onMouseDown={() => {
                this.setMenuOpen(!this.isMenuOpen)
              }}
              onMouseEnter={() => {
                this.menuBackgroundColor = SELECTED_BUTTON_COLOR
              }}
              onMouseLeave={() => {
                this.menuBackgroundColor = this.isMenuOpen
                  ? SELECTED_BUTTON_COLOR
                  : undefined
              }}
              uiTransform={{
                width: this.fontSize * 2,
                height: this.fontSize * 2,
                margin: { right: this.fontSize * 0.5 }
              }}
              backgroundColor={this.menuBackgroundColor}
              icon={{ atlasName: 'icons', spriteName: 'Menu' }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              display: this.isExpanded ? 'flex' : 'none',
              width: '95%',
              height: 'auto',
              flexDirection: 'column'
            }}
          >
            {/* FPS */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label value="FPS" fontSize={this.fontSize * 0.7} />
              <Label
                value={this.fpsValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            {/* UNIQUE GLTF MESHES */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label
                value="Unique GLTF Meshes"
                fontSize={this.fontSize * 0.7}
              />
              <Label
                value={this.uniqueGltfMeshesValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            {/* VISIBLE MESH COUNT */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label
                value="Visible Mesh Count"
                fontSize={this.fontSize * 0.7}
              />
              <Label
                value={this.visibleMeshCountValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            {/* VISIBLE TRIANGLE COUNT */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label
                value="Visible Triangle Count"
                fontSize={this.fontSize * 0.7}
              />
              <Label
                value={this.visibleTriangleCountValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            {/* UNIQUE GLTF MATERIALS */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label
                value="Unique GLTF Materials"
                fontSize={this.fontSize * 0.7}
              />
              <Label
                value={this.uniqueGltfMaterialsValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            {/* VISIBLE MATERIAL COUNT */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label
                value="Visible Material Count"
                fontSize={this.fontSize * 0.7}
              />
              <Label
                value={this.visibleMaterialCountValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            {/* TOTAL TEXTURE COUNT */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label
                value="Total Texture Count"
                fontSize={this.fontSize * 0.7}
              />
              <Label
                value={this.totalTextureCountValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            {/* TOTAL TEXTURE MEMORY */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label
                value="Total Texture Memory"
                fontSize={this.fontSize * 0.7}
              />
              <Label
                value={this.totalTextureMemoryValue.toString() + 'mb'}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: { ...ALMOST_WHITE, a: 0.01 } }}
            />

            {/* TOTAL ENTITIES */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Label value="Total Entities" fontSize={this.fontSize * 0.7} />
              <Label
                value={this.totalEntitiesValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>
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
              color: ALPHA_BLACK_PANEL,
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
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
              }}
              onMouseDown={() => {}}
              onMouseEnter={() => {
                // this.sceneUiBackgroundColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                // this.sceneUiBackgroundColor = UNSELECTED_TEXT_WHITE
              }}
            >
              <Label
                value="Hide Scene UI"
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
                this.setHome(!this.isHome)
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
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row'
              }}
              onMouseDown={() => {
                this.setFav(!this.isFav)
              }}
              onMouseEnter={() => {
                this.setFavLabelColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.setFavLabelColor = UNSELECTED_TEXT_WHITE
              }}
            >
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 0.8,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.favIcon),
                  color: this.setFavLabelColor
                }}
              />
              <Label
                value={this.isFav ? 'Unmark as Favourite' : 'Mark as Favourite'}
                fontSize={this.fontSize * 0.8}
                color={this.setFavLabelColor}
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
                this.reloadScene()
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
                this.openSceneInfo()
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
}

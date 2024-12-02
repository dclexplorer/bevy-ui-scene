import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
// import IconButton from '../../components/iconButton'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/canvas'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { ALMOST_BLACK, ALMOST_WHITE } from '../../utils/constants'
import { type Icon } from '../../utils/definitions'
import IconButton from '../../components/iconButton'

export class SceneInfo {
  private readonly uiController: UIController
  public fontSize: number = 16
  private readonly isSceneBroken: boolean = false
  public readonly sceneName: string = 'Scene Name ASD'
  public readonly sceneCoords: { x: number; y: number } = { x: -2, y: 0 }
  public readonly isSdk6: boolean = true
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
  public expandBackgroundColor: Color4 = { ...ALMOST_BLACK, a: 0.4 }
  public menuBackgroundColor: Color4 = { ...ALMOST_BLACK, a: 0.4 }
  public setHomeBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  public reloadBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  public openInfoBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  public sceneUiBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  public setFavBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }

  public fpsValue: number = 0
  public uniqueGltfMeshesValue: number = 0
  public visibleMeshCountValue: number = 0
  public visibleTriangleCountValue: number = 0
  public uniqueGltfMaterialsValue: number = 0
  public visibleMaterialCountValue: number = 0
  public totalTextureCountValue: number = 0
  public totalTextureMemoryValue: number = 0
  public totalEntitiesValue: number = 0

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  setFps(arg:number):void {
    this.fpsValue = arg
  }

  setUniqueGltfMeshes(arg:number):void {
    this.uniqueGltfMeshesValue = arg
  }

  setVisibleMeshCount(arg:number):void {
    this.visibleMeshCountValue = arg
  }

  setVisibleTriangleCount(arg:number):void {
    this.visibleTriangleCountValue = arg
  }

  setUniqueGltfMaterials(arg:number):void {
    this.uniqueGltfMaterialsValue = arg
  }

  setVisibleMaterialCount(arg:number):void {
    this.visibleMaterialCountValue = arg
  }

  setTotalTextureCount(arg:number):void {
    this.totalTextureCountValue = arg
  }

  setTotalTextureMemory(arg:number):void {
    this.totalTextureMemoryValue = arg
  }

  setTotalEntities(arg:number):void {
    this.totalEntitiesValue = arg
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
    console.log('OPEN INFO MODAL')
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * 0.15,
            minWidth: 250,
            height: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            position: {
              left: this.uiController.mainHud.isSideBarVisible
                ? canvasInfo.width * 0.034
                : canvasInfo.width * 0.01,
              top: canvasInfo.width * 0.01 * 20
            },
            positionType: 'absolute'
          }}
          uiBackground={{
            color: { ...Color4.Black(), a: 0.8 },
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
              }}
              onMouseEnter={() => {
                this.expandBackgroundColor = { ...ALMOST_BLACK, a: 0.2 }
              }}
              onMouseLeave={() => {
                this.expandBackgroundColor = { ...ALMOST_BLACK, a: 0.4 }
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
                    color: { ...ALMOST_WHITE, a: 0.5 }
                  }}
                />
                <Label
                  value={
                    this.sceneCoords.x.toString() +
                    ',' +
                    this.sceneCoords.y.toString()
                  }
                  fontSize={this.fontSize}
                  uiTransform={{
                      margin:{right:this.fontSize}

                  }}
                />
                <UiEntity
                  uiTransform={{
                    width: this.fontSize * 0.875,
                    height: this.fontSize * 0.875,
                    display: this.isSceneBroken ? 'flex' : 'none'
                  }}
                  uiBackground={{
                    ...getBackgroundFromAtlas({
                      atlasName: 'icons',
                      spriteName: 'WarningError'
                    }),
                    color: Color4.create(254 / 255, 162 / 255, 23 / 255, 1)
                  }}
                />
                <UiEntity
                  uiTransform={{
                    display: this.isSdk6 ? 'flex' : 'none',
                    width: (this.fontSize * 0.875) / 0.41,
                    height: this.fontSize * 0.875
                  }}
                  uiBackground={{
                    ...getBackgroundFromAtlas({
                      atlasName: 'icons',
                      spriteName: 'Tag'
                    })
                  }}
                />
              </UiEntity>
            </UiEntity>

            
            <IconButton
              onMouseDown={() => {
                this.setMenuOpen(!this.isMenuOpen)
              }}
              onMouseEnter={() => {
                this.menuBackgroundColor = { ...ALMOST_BLACK, a: 0.2 }
              }}
              onMouseLeave={() => {
                this.menuBackgroundColor = { ...ALMOST_BLACK, a: 0.4 }
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
              flexDirection:'column',
              
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
              <Label
                value="FPS"
                fontSize={this.fontSize * 0.7}
              />
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
                value= {this.uniqueGltfMeshesValue.toString()}
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
                value= {this.visibleMeshCountValue.toString()}
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
                value= {this.visibleTriangleCountValue.toString()}
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
                value= {this.uniqueGltfMaterialsValue.toString()}
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
                value= {this.visibleMaterialCountValue.toString()}
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
                value= {this.totalTextureCountValue.toString()}
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
                value= {this.totalTextureMemoryValue.toString() + 'mb'}
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
              <Label
                value="Total Entities"
                fontSize={this.fontSize * 0.7}
              />
              <Label
                value= {this.totalEntitiesValue.toString()}
                fontSize={this.fontSize * 0.7}
              />
            </UiEntity>

          </UiEntity>
          <UiEntity
            uiTransform={{
              display: this.isMenuOpen ? 'flex' : 'none',
                minWidth: 250,
              width: canvasInfo.width * 0.15,
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
              color: { ...Color4.Black(), a: 0.8 },
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
              onMouseDown={() => {
                
              }}
              onMouseEnter={() => {
                // this.sceneUiBackgroundColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                // this.sceneUiBackgroundColor = { ...ALMOST_WHITE, a: 0.5 }
              }}
            >
              <Label
                value="Scene UI"
                fontSize={this.fontSize}
                color={this.sceneUiBackgroundColor}
              />
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 1.2 * 65 / 36,
                  height: this.fontSize * 1.2,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.sceneUiToggle),
                  color: this.sceneUiBackgroundColor
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
                this.setHomeBackgroundColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.setHomeBackgroundColor = { ...ALMOST_WHITE, a: 0.5 }
              }}
            >
              
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 1.2,
                  height: this.fontSize * 1.2,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.setAtHomeIcon),
                  color: this.setHomeBackgroundColor
                }}
              />
              <Label
                value="Set as Home"
                fontSize={this.fontSize}
                color={this.setHomeBackgroundColor}
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
                this.setFavBackgroundColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.setFavBackgroundColor = { ...ALMOST_WHITE, a: 0.5 }
              }}
            >
              
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 1.2,
                  height: this.fontSize * 1.2,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.favIcon),
                }}
              />
              <Label
                value="Mark as Favourite"
                fontSize={this.fontSize}
                color={this.setFavBackgroundColor}
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
                this.reloadBackgroundColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.reloadBackgroundColor = { ...ALMOST_WHITE, a: 0.5 }
              }}
            >
              
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 1.2,
                  height: this.fontSize * 1.2,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.reloadIcon),
                  color: this.reloadBackgroundColor
                }}
              />
              <Label
                value="Reload Scene"
                fontSize={this.fontSize}
                color={this.reloadBackgroundColor}
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
                this.openInfoBackgroundColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                this.openInfoBackgroundColor = { ...ALMOST_WHITE, a: 0.5 }
              }}
            >
              
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 1.2,
                  height: this.fontSize * 1.2,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.infoIcon),
                  color: this.openInfoBackgroundColor
                }}
              />
              <Label
                value="Scene Info"
                fontSize={this.fontSize}
                color={this.openInfoBackgroundColor}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}

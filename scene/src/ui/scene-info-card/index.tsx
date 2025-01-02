import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
// import IconButton from '../../components/iconButton'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/canvas'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  LEFT_PANEL_MIN_WIDTH,
  LEFT_PANEL_WIDTH_FACTOR
} from '../../utils/constants'
import type { SceneCategory, Icon } from '../../utils/definitions'
import IconButton from '../../components/iconButton'
import { getSceneInformation } from '~system/Runtime'

export class SceneInfoCard {
  private readonly uiController: UIController
  public fontSize: number = 16
  public isFav: boolean = false
  public isLiked: boolean = false
  public isDisliked: boolean = false
  public favIcon: Icon = { atlasName: 'toggles', spriteName: 'HeartOffOutlined' }
  public likeIcon: Icon = { atlasName: 'icons', spriteName: 'HeartOffOutlined' }
  public dislikeIcon: Icon = { atlasName: 'icons', spriteName: 'Dislike' }
  public backgroundColor: Color4 = { ...ALMOST_BLACK, a: 0.4 }
  public setFavBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  public likeBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  public unlikeBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  private readonly panelBackgroundColor: Color4 = Color4.create(228/255, 228/255, 228/255, 1)
  
  public selectedTab: 'overview' | 'photos' | 'events' = 'overview'
  
  public sceneName: string = 'Scene Name ASD'
  public sceneCoords: { x: number; y: number } = { x: -155, y: 123 }
  public sceneParcels: number = 1
  public sceneDescription: string = 'Collect mining ores and magic stones through mining as well as farm magic plant nearby Elswyth Magic School, create wearables through alchemy and crafting! Collect mining ores and magic stones through mining as well as farm magic plant nearby Elswyth Magic School, create wearables through alchemy and crafting!'
  public tags: SceneCategory[] = ['game', 'poi']

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  updateIcons(): void {
    if (this.isFav) {
      this.favIcon.spriteName = 'HeartOnOutlined'
    } else {
      this.favIcon.spriteName = 'HeartOffOutlined'
    }
    if (this.isLiked) {
      this.likeIcon.spriteName = 'Like solid'
    } else {
      this.likeIcon.spriteName = 'Like'
    }
    if (this.isDisliked) {
      this.dislikeIcon.spriteName = 'Dislike solid'
    } else {
      this.dislikeIcon.spriteName = 'Dislike'
    }
  }

  setFav(arg: boolean): void {
    this.isFav = arg
    this.updateIcons()
  }

  setLike(arg: boolean): void {
    if (arg && this.isDisliked) {
      return
    }
    this.isLiked = arg
    this.updateIcons()
  }

  setDislike(arg: boolean): void {
    if (arg && this.isLiked) {
      return
    }
    this.isDisliked = arg
    this.updateIcons()
  }

  setTab(tab: 'overview' | 'photos' | 'events'): void {
    this.selectedTab = tab
  }

  async getSceneInfo(): Promise<void> {
    
    const sceneInfo = await getSceneInformation({})

    if (sceneInfo === undefined) return

    const sceneJson = JSON.parse(sceneInfo.metadataJson)
    this.sceneName = sceneJson.display.title
    this.sceneCoords = sceneJson.scene.base.position
    this.sceneParcels = sceneJson.scene.parcels.leght()

  }


  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    
    let panelWidth: number

    if (canvasInfo.width / 4 < 470) {
      panelWidth = 470
    } else {
      panelWidth = canvasInfo.width / 4
    }


    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: panelWidth,
            height: 'auto',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            position: {
              right: 0,
              top: 0
            },
            positionType: 'absolute'
          }}
          uiBackground={{
            color: this.panelBackgroundColor,
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
              onMouseDown={() => {}}
              onMouseEnter={() => {
                // this.sceneUiBackgroundColor = ALMOST_WHITE
              }}
              onMouseLeave={() => {
                // this.sceneUiBackgroundColor = { ...ALMOST_WHITE, a: 0.5 }
              }}
            >
              <Label
                value="Hide Scene UI"
                fontSize={this.fontSize * 0.8}
                color={this.sceneUiBackgroundColor}
              />
              <UiEntity
                uiTransform={{
                  width: (this.fontSize * 0.8 * 65) / 36,
                  height: this.fontSize * 0.8,
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
                  width: this.fontSize * 0.8,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.setAtHomeIcon),
                  color: this.setHomeBackgroundColor
                }}
              />
              <Label
                value={this.isHome ? 'Unset as Home' : 'Set as Home'}
                fontSize={this.fontSize * 0.8}
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
                  width: this.fontSize * 0.8,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.favIcon),
                  color: this.setFavBackgroundColor
                }}
              />
              <Label
                value={this.isFav ? 'Unmark as Favourite' : 'Mark as Favourite'}
                fontSize={this.fontSize * 0.8}
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
                  width: this.fontSize * 0.8,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.reloadIcon),
                  color: this.reloadBackgroundColor
                }}
              />
              <Label
                value="Reload Scene"
                fontSize={this.fontSize * 0.8}
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
                  width: this.fontSize * 0.8,
                  height: this.fontSize * 0.8,
                  margin: this.fontSize * 0.5
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas(this.infoIcon),
                  color: this.openInfoBackgroundColor
                }}
              />
              <Label
                value="Scene Info"
                fontSize={this.fontSize * 0.8}
                color={this.openInfoBackgroundColor}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}

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
  public favIcon: Icon = { atlasName: 'toggles', spriteName: 'HeartOnOutlined' }
public expandIcon: Icon = { atlasName: 'icons', spriteName: 'DownArrow' }
public expandBackgroundColor: Color4 = {...ALMOST_BLACK, a:0.8}
  constructor(uiController: UIController) {
    this.uiController = uiController
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
  }

  setFav(arg: boolean): void {
    this.isFav = arg
    this.updateIcons()
  }

  setExpanded(arg: boolean): void {
    this.isExpanded = arg
    this.updateIcons()
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * 0.175,
            height: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            position: {
              left: this.uiController.mainHud.isSideBarVisible
                ? canvasInfo.width * 0.034
                : canvasInfo.width * 0.01,
              top: canvasInfo.width * 0.01  
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
            onMouseDown={()=>{this.setExpanded(!this.isExpanded)}}
            onMouseEnter={()=>{this.expandBackgroundColor = {...ALMOST_BLACK, a:0.5}}}
            onMouseLeave={()=>{this.expandBackgroundColor = {...ALMOST_BLACK, a:0.8}}}
            uiTransform={{width:this.fontSize * 2, height:this.fontSize * 2, margin:{left:this.fontSize*0.5}}}
            backgroundColor={ this.expandBackgroundColor }
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

          <UiEntity
            uiTransform={{
              width: this.fontSize * 1.2,
              height: this.fontSize * 1.2,
              margin: this.fontSize * 0.5
            }}
            uiBackground={{
              ...getBackgroundFromAtlas(this.favIcon)
            }}
            onMouseDown={() => {
              this.setFav(!this.isFav)
            }}
          />
        </UiEntity>
        <UiEntity uiTransform={{display: this.isExpanded ? 'flex':'none', width:'100%', height:this.fontSize * 3}} uiText={{value:'PREVIEW INFO', textAlign:'middle-center'}}/>
        </UiEntity>
      </Canvas>
    )
  }
}

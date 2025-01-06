import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  PANEL_BACKGROUND_COLOR
} from '../../utils/constants'
import type { Icon, SceneCategory } from '../../utils/definitions'
import Canvas from '../canvas/canvas'
import IconButton from '../../components/iconButton'

export class SceneInfoCard {
  private readonly uiController: UIController
  public fontSize: number = 16
  public isFav: boolean = false
  public isLiked: boolean = false
  public isDisliked: boolean = false
  public favIcon: Icon = {
    atlasName: 'toggles',
    spriteName: 'HeartOffOutlined'
  }

  public likeIcon: Icon = { atlasName: 'icons', spriteName: 'HeartOffOutlined' }
  public dislikeIcon: Icon = { atlasName: 'icons', spriteName: 'Dislike' }
  public closeBackground: Color4 = { ...ALMOST_BLACK, a: 0.4 }
  public setFavBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  public likeBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }
  public unlikeBackgroundColor: Color4 = { ...ALMOST_WHITE, a: 0.5 }

  public selectedTab: 'overview' | 'photos' | 'events' = 'overview'

  public sceneTitle: string = 'Scene Name ASD'
  public sceneCoords: { x: number; y: number } = { x: -155, y: 123 }
  public sceneParcels: number = 1
  public sceneDescription: string =
    'Collect mining ores and magic stones through mining as well as farm magic plant nearby Elswyth Magic School, create wearables through alchemy and crafting! Collect mining ores and magic stones through mining as well as farm magic plant nearby Elswyth Magic School, create wearables through alchemy and crafting!'

  public tags: SceneCategory[] = ['game', 'poi']

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  show(): void {
    this.uiController.sceneInfoCardVisible = true
  }

  hide(): void {
    this.uiController.sceneInfoCardVisible = false
  }

  updateButtons(): void {
    this.closeBackground = { ...ALMOST_BLACK, a: 0.4 }
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
    this.updateButtons()
  }

  setLike(arg: boolean): void {
    if (arg && this.isDisliked) {
      return
    }
    this.isLiked = arg
    this.updateButtons()
  }

  setDislike(arg: boolean): void {
    if (arg && this.isLiked) {
      return
    }
    this.isDisliked = arg
    this.updateButtons()
  }

  setTab(tab: 'overview' | 'photos' | 'events'): void {
    this.selectedTab = tab
  }

  // async getSceneInfo(): Promise<void> {

  //   const sceneInfo = await getSceneInformation({})

  //   if (sceneInfo === undefined) return

  //   const sceneJson = JSON.parse(sceneInfo.metadataJson)
  //   this.sceneTitle = sceneJson.display.title
  //   this.sceneCoords = sceneJson.scene.base.position
  //   this.sceneParcels = sceneJson.scene.parcels.leght()

  // }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const panelWidth: number = canvasInfo.width / 4

    // if (canvasInfo.width / 4 < 470) {
    //   panelWidth = 470
    // } else {
    //    panelWidth = canvasInfo.width / 4
    // }

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: panelWidth,
            height: '100%',
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
            color: PANEL_BACKGROUND_COLOR
          }}
        >
          <UiEntity
            uiTransform={{ width: panelWidth, height: panelWidth * 0.75 }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: 'assets/images/login/background.png'
              }
            }}
          />
          {this.topBar()}
        </UiEntity>
      </Canvas>
    )
  }

  topBar(): ReactEcs.JSX.Element {
    return (
      <UiEntity
        uiTransform={{
          height: 'auto',
          width: '100%',
          positionType: 'absolute',
          padding: this.fontSize / 4,
          position: { top: 0, left: 0 },
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
        uiBackground={{ color: { ...Color4.Black(), a: 0.8 } }}
      >
        <IconButton
          uiTransform={{
            height: this.fontSize * 1.5,
            width: this.fontSize * 1.5,
            positionType: 'absolute',
            position: { right: this.fontSize / 4 }
          }}
          onMouseEnter={() => {
            this.closeBackground = { ...ALMOST_BLACK, a: 0.8 }
          }}
          onMouseLeave={() => {
            this.updateButtons()
          }}
          onMouseDown={() => {
            this.hide()
            this.updateButtons()
          }}
          backgroundColor={this.closeBackground}
          icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
        />
        <Label
          value={this.sceneTitle}
          fontSize={this.fontSize}
          textAlign="middle-center"
          uiTransform={{ width: '100%' }}
        />
      </UiEntity>
    )
  }
}

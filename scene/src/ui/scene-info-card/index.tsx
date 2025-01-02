import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { type Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  PANEL_BACKGROUND_COLOR,
} from '../../utils/constants'
import type { Icon, SceneCategory } from '../../utils/definitions'
import Canvas from '../canvas/canvas'

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
  
  public selectedTab: 'overview' | 'photos' | 'events' = 'overview'
  
  public sceneName: string = 'Scene Name ASD'
  public sceneCoords: { x: number; y: number } = { x: -155, y: 123 }
  public sceneParcels: number = 1
  public sceneDescription: string = 'Collect mining ores and magic stones through mining as well as farm magic plant nearby Elswyth Magic School, create wearables through alchemy and crafting! Collect mining ores and magic stones through mining as well as farm magic plant nearby Elswyth Magic School, create wearables through alchemy and crafting!'
  public tags: SceneCategory[] = ['game', 'poi']

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  show():void {
    this.uiController.sceneInfoCardVisible = true
  }

  hide():void {
    this.uiController.sceneInfoCardVisible = false
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

  // async getSceneInfo(): Promise<void> {
    
  //   const sceneInfo = await getSceneInformation({})

  //   if (sceneInfo === undefined) return

  //   const sceneJson = JSON.parse(sceneInfo.metadataJson)
  //   this.sceneName = sceneJson.display.title
  //   this.sceneCoords = sceneJson.scene.base.position
  //   this.sceneParcels = sceneJson.scene.parcels.leght()

  // }


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
            color: PANEL_BACKGROUND_COLOR,
          }}
        >
          
        </UiEntity>
      </Canvas>
    )
  }
}

import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  DCL_SNOW,
  PANEL_BACKGROUND_COLOR,
  SELECTED_BUTTON_COLOR
} from '../../utils/constants'
import type { Icon, SceneCategory } from '../../utils/definitions'
import Canvas from '../canvas/canvas'
import IconButton from '../../components/iconButton'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'

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

  public sceneTitle: string = 'Sad Escobar Vibes Scene'
  public sceneCreator: string = 'Robtfm'
  public sceneCoords: { x: number; y: number } = { x: -155, y: 123 }
  public sceneParcels: number = 1
  public sceneDescription: string =
    'Collect mining ores and magic stones through mining as well as farm magic plant nearby Elswyth Magic School, create wearables through alchemy and crafting! Collect mining ores and magic stones through mining as well as farm magic plant nearby Elswyth Magic School, create wearables through alchemy and crafting!'

  public tags: SceneCategory[] = ['poi', 'social', 'casino', 'business']

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
                src: 'assets/images/backgrounds/montage.png'
              }
            }}
          />
          {this.topBar()}
          <UiEntity
            uiTransform={{
              width: '90%',
              height: 'auto',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Label
              value={this.sceneTitle}
              fontSize={this.fontSize * 1.2}
              textAlign="bottom-left"
              uiTransform={{ width: '100%' }}
              color={ALMOST_BLACK}
            />
            <Label
              value={'Created by ' + this.sceneCreator}
              fontSize={this.fontSize}
              textAlign="bottom-left"
              uiTransform={{ width: '100%' }}
              color={ALMOST_BLACK}
            />
            <UiEntity
              uiTransform={{ width: '100%', height: 1 }}
              uiBackground={{ color: SELECTED_BUTTON_COLOR }}
            />
            <Label
              value={'DESCRIPTION'}
              fontSize={this.fontSize}
              textAlign="bottom-left"
              uiTransform={{ width: '100%' }}
              color={ALMOST_BLACK}
            />

            <Label
              value={this.sceneDescription}
              fontSize={this.fontSize}
              textAlign="bottom-left"
              uiTransform={{ width: '100%' }}
              color={ALMOST_BLACK}
            />

            <Label
              value={'APPEARS ON'}
              fontSize={this.fontSize}
              textAlign="bottom-left"
              uiTransform={{
                width: '100%',
                height: this.fontSize * 1.2,
                margin: { top: this.fontSize }
              }}
              color={ALMOST_BLACK}
            />
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {this.tags.map((tag, index) => this.filterChip(tag, index))}
            </UiEntity>
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
                margin: { top: this.fontSize }
              }}
            >
              {this.infoDetail(
                'LOCATION',
                this.sceneCoords.x + ',' + this.sceneCoords.y,
                {
                  atlasName: 'icons',
                  spriteName: 'PinIcn'
                },
                { width: '30%', height: 'auto' },
                ALMOST_BLACK
              )}
              {this.infoDetail(
                'PARCELS',
                this.sceneParcels.toString(),
                {
                  atlasName: 'icons',
                  spriteName: 'Parcels'
                },
                { width: '30%', height: 'auto' }
              )}
            </UiEntity>
          </UiEntity>
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

  infoDetail(
    title: string,
    value: string,
    icon: Icon,
    uiTransform: Partial<UiTransformProps>,
    color?: Color4
  ): ReactEcs.JSX.Element {
    return (
      <UiEntity
        uiTransform={{
          ...uiTransform,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}
      >
        <Label
          value={title}
          fontSize={this.fontSize}
          textAlign="middle-left"
          uiTransform={{ width: '100%', height: this.fontSize * 1.2 }}
          color={ALMOST_BLACK}
        />
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 'auto',
            margin: { top: this.fontSize / 2 }
          }}
        >
          <UiEntity
            uiTransform={{
              width: this.fontSize,
              height: this.fontSize,
              margin: { left: this.fontSize * 0.25 }
            }}
            uiBackground={
              color !== undefined
                ? { ...getBackgroundFromAtlas(icon), color }
                : getBackgroundFromAtlas(icon)
            }
          />
          <Label
            value={value}
            fontSize={this.fontSize}
            textAlign="middle-left"
            uiTransform={{ width: '70%', height: this.fontSize * 1.2 }}
            color={ALMOST_BLACK}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  filterChip(
    type: SceneCategory,
    index: string | number
  ): ReactEcs.JSX.Element {
    let title = ''
    let spriteName = ''

    switch (type) {
      case 'game':
        title = 'GAME'
        spriteName = 'Games'
        break
      case 'favorites':
        title = 'FAVORITES'
        spriteName = 'Favourites'
        break
      case 'art':
        title = 'ART'
        spriteName = 'Art'
        break
      case 'crypto':
        title = 'CRYPTO'
        spriteName = 'Crypto'
        break
      case 'social':
        title = 'SOCIAL'
        spriteName = 'Social'
        break
      case 'shop':
        title = 'SHOP'
        spriteName = 'Shop'
        break
      case 'education':
        title = 'EDUCATION'
        spriteName = 'Education'
        break
      case 'music':
        title = 'MUSIC'
        spriteName = 'Music'
        break
      case 'fashion':
        title = 'FASHION'
        spriteName = 'Fashion'
        break
      case 'casino':
        title = 'CASINO'
        spriteName = 'Casino'
        break
      case 'sports':
        title = 'SPORTS'
        spriteName = 'Sports'
        break
      case 'business':
        title = 'BUSINESS'
        spriteName = 'Business'
        break
      case 'poi':
        title = 'POINT OF INTEREST'
        spriteName = 'POI'
        break
      default:
        title = 'UNKNOWN'
        spriteName = 'UnknownIcon'
        break
    }

    return (
      <UiEntity
        key={index}
        uiTransform={{
          width: 'auto',
          height: this.fontSize * 2,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          margin: {
            right: this.fontSize / 2,
            top: this.fontSize / 4,
            bottom: this.fontSize / 4
          }
        }}
        uiBackground={{
          color: DCL_SNOW,
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
            width: this.fontSize * 1.5,
            height: this.fontSize * 1.5,
            margin: { right: this.fontSize / 4, left: this.fontSize / 4 }
          }}
          uiBackground={getBackgroundFromAtlas({
            atlasName: 'map',
            spriteName
          })}
        />
        <Label
          value={title}
          fontSize={this.fontSize}
          textAlign="middle-left"
          textWrap="nowrap"
          uiTransform={{
            width: 'auto',
            height: this.fontSize * 1.2,
            margin: { right: this.fontSize / 4 }
          }}
          color={ALMOST_BLACK}
        />
      </UiEntity>
    )
  }
}

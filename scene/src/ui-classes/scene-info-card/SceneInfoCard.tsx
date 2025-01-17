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
  BLACK_TEXT,
  DCL_SNOW,
  GRAY_TEXT,
  PANEL_BACKGROUND_COLOR,
  RUBY,
  SELECTED_BUTTON_COLOR
} from '../../utils/constants'
import type { AtlasIcon, SceneCategory } from '../../utils/definitions'
import Canvas from '../../components/canvas/Canvas'
import {
  formatEventTime,
  getBackgroundFromAtlas,
  getTimestamp,
  truncateWithoutBreakingWords
} from '../../utils/ui-utils'
import { ButtonIcon } from '../../components/button-icon'
import { ButtonTextIcon } from '../../components/button-text-icon'
import { PhotoFromApi, PlaceFromApi, type EventFromApi } from './SceneInfoCard.types'
import { fetchEvents, fetchPhotos, fetchPlaceId } from 'src/utils/promise-utils'
import { store } from 'src/state/store'
import { loadEventsFromApi } from 'src/state/sceneInfo/actions'

export default class SceneInfoCard {
  private readonly uiController: UIController
  public fontSize: number = 16
  public isFav: boolean = false
  public isLiked: boolean = false
  public isDisliked: boolean = false
  public favIcon: AtlasIcon = {
    atlasName: 'toggles',
    spriteName: 'HeartOffOutlined'
  }

  public shareIcon: AtlasIcon = {
    atlasName: 'context',
    spriteName: 'Share'
  }

  public likeIcon: AtlasIcon = { atlasName: 'icons', spriteName: 'Like' }
  public dislikeIcon: AtlasIcon = {
    atlasName: 'icons',
    spriteName: 'Dislike'
  }

  public closeBackground: Color4 | undefined
  public setFavBackgroundColor: Color4 = DCL_SNOW
  public likeBackgroundColor: Color4 = DCL_SNOW
  public dislikeBackgroundColor: Color4 = DCL_SNOW
  public shareBackgroundColor: Color4 = DCL_SNOW
  public interestedEventsId: string[] = []

  public selectedTab: 'overview' | 'photos' | 'events' = 'events'

  public sceneTitle: string = 'Sad Escobar Vibes Scene'
  public sceneCreator: string = 'Robtfm'
  public sceneOnline: number = 0
  public sceneRating: number = 0
  public sceneViews: number = 0
  public scenePhotosNumber: number = 5
  public sceneCoords: { x: number; y: number } = { x: -10009, y: -93 }
  public sceneParcels: number = 1
  public sceneDescription: string =
    'Pablo Escobar wandered alone through the empty halls of his hideout, a shadow of the powerful man he once was. Sitting on a rusty swing in the garden, he gazed into the distance, lost in memories of his family and the life he had built—now slipping away. The laughter of his children, the warmth of his wife, and the triumph of his empire felt like distant echoes, replaced by betrayal and isolation.'

  public tags: SceneCategory[] = ['poi', 'social', 'casino', 'business']

  constructor(uiController: UIController) {
    this.uiController = uiController
  }


  async changeSceneCoords(x:number, y:number): Promise<void>{

    // Fetch Events
    const eventsArray = await fetchEvents()
    if (eventsArray.length === 0) {
      console.log('No events found')
    } else {
      console.log('Events found: ', eventsArray.length)
    }
    
    const place: PlaceFromApi = await fetchPlaceId(x, y)
    const photosArray: PhotoFromApi[]= await fetchPhotos(place.id)
    
    store.dispatch(loadEventsFromApi(eventsArray))
    store.dispatch(loadPhotosFromApi(photosArray))
    store.dispatch(loadPlaceFromApi(place))

  }


  async show(): Promise<void> {
    this.uiController.sceneInfoCardVisible = true
    // Llama a la función
    const eventsArray = await fetchEvents()
    if (eventsArray.length === 0) {
      console.log('No events found')
    } else {
      console.log('Events found: ', eventsArray.length)
    }
    store.dispatch(loadEventsFromApi(eventsArray))
  }

  hide(): void {
    this.uiController.sceneInfoCardVisible = false
  }

  updateBackgrounds(): void {
    this.closeBackground = undefined
    this.likeBackgroundColor = DCL_SNOW
    this.dislikeBackgroundColor = DCL_SNOW
    this.shareBackgroundColor = DCL_SNOW
    this.setFavBackgroundColor = DCL_SNOW
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
    if (arg) {
      this.isDisliked = false
    }
    this.isLiked = arg
    this.updateIcons()
  }

  setDislike(arg: boolean): void {
    if (arg) {
      this.isLiked = false
    }
    this.isDisliked = arg
    this.updateIcons()
  }

  setTab(tab: 'overview' | 'photos' | 'events'): void {
    this.selectedTab = tab
  }

  onLikeEnter(): void {
    this.likeBackgroundColor = SELECTED_BUTTON_COLOR
  }

  onDislikeEnter(): void {
    this.dislikeBackgroundColor = SELECTED_BUTTON_COLOR
  }

  onFavEnter(): void {
    this.setFavBackgroundColor = SELECTED_BUTTON_COLOR
  }

  onShareEnter(): void {}

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    let panelWidth: number

    if (canvasInfo.width / 4 < 360) {
      panelWidth = 360
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
            color: PANEL_BACKGROUND_COLOR
          }}
        >
          {this.topBar()}
          <UiEntity
            uiTransform={{ width: panelWidth, minHeight: panelWidth * 0.75 }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: 'assets/images/backgrounds/montage.png'
              }
            }}
          />

          {/* CONTENT */}
          <UiEntity
            uiTransform={{
              width: '100%',
              overflow: 'scroll',
              maxHeight: canvasInfo.height - panelWidth * 0.75,
              flexDirection: 'column'
            }}
            // uiBackground={{color:Color4.Red()}}
          >
            <UiEntity
              uiTransform={{
                width: '88%',
                height: 'auto',
                flexDirection: 'column',
                margin: { left: '3%' }
              }}
            >
              {this.sceneInfo()}
              {this.tabsBar()}
              {this.selectedTab === 'overview' && this.overviewContent()}
              {this.selectedTab === 'photos' && this.photosContent()}
              {this.selectedTab === 'events' && this.eventsContent()}
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
        uiBackground={{ color: { ...Color4.Black(), a: 1 } }}
      >
        <ButtonIcon
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
            this.updateBackgrounds()
          }}
          onMouseDown={() => {
            this.hide()
            this.updateBackgrounds()
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

  tabsBar(): ReactEcs.JSX.Element {
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          minHeight: 4 * this.fontSize,
          maxHeight: 4 * this.fontSize,
          flexDirection: 'column'
        }}
      >
        <UiEntity
          uiTransform={{
            width: '100%',
            minHeight: 1,
            margin: { top: this.fontSize }
          }}
          uiBackground={{ color: SELECTED_BUTTON_COLOR }}
        />

        <UiEntity
          uiTransform={{
            width: '100%',
            height: 'auto',
            justifyContent: 'space-around'
          }}
        >
          <UiEntity
            uiTransform={{
              width: '33%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={() => {
              this.setTab('overview')
            }}
          >
            <Label
              value={'OVERVIEW'}
              color={BLACK_TEXT}
              fontSize={this.fontSize}
            />
            <UiEntity
              uiTransform={{ width: '100%', height: 4 }}
              uiBackground={{
                color:
                  this.selectedTab === 'overview'
                    ? RUBY
                    : PANEL_BACKGROUND_COLOR
              }}
            />
          </UiEntity>

          <UiEntity
            uiTransform={{
              width: '33%',
              margin: 0,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={() => {
              this.setTab('photos')
            }}
          >
            <Label
              value={'PHOTOS (' + this.scenePhotosNumber + ')'}
              color={BLACK_TEXT}
              fontSize={this.fontSize}
            />
            <UiEntity
              uiTransform={{ width: '100%', height: 4 }}
              uiBackground={{
                color:
                  this.selectedTab === 'photos' ? RUBY : PANEL_BACKGROUND_COLOR
              }}
            />
          </UiEntity>

          <UiEntity
            uiTransform={{
              width: '33%',
              margin: 0,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={() => {
              this.setTab('events')
            }}
          >
            <Label
              value={
                'EVENTS (' +
                Object.values(store.getState().events.explorerEvents).filter(
                  (event) =>
                    event.x === this.sceneCoords.x &&
                    event.y === this.sceneCoords.y
                ).length +
                ')'
              }
              color={BLACK_TEXT}
              fontSize={this.fontSize}
            />
            <UiEntity
              uiTransform={{ width: '100%', height: 4 }}
              uiBackground={{
                color:
                  this.selectedTab === 'events' ? RUBY : PANEL_BACKGROUND_COLOR
              }}
            />
          </UiEntity>
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: '100%',
            minHeight: 1,
            margin: { bottom: this.fontSize }
          }}
          uiBackground={{ color: SELECTED_BUTTON_COLOR }}
        />
      </UiEntity>
    )
  }

  sceneInfo(): ReactEcs.JSX.Element {
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          minHeight: this.fontSize * 9.5,
          maxHeight: this.fontSize * 9.5,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column'
        }}
        // uiBackground={{color:Color4.Blue()}}
      >
        <Label
          value={this.sceneTitle}
          fontSize={this.fontSize * 1.2}
          textAlign="middle-left"
          uiTransform={{
            width: '100%',
            height: this.fontSize * 1.5,
            margin: { top: this.fontSize * 0.5 }
          }}
          color={BLACK_TEXT}
        />
        <Label
          value={'Created by ' + this.sceneCreator}
          fontSize={this.fontSize * 0.8}
          textAlign="middle-left"
          uiTransform={{
            width: '100%',
            height: this.fontSize,
            margin: { left: this.fontSize * 0.5 }
          }}
          color={BLACK_TEXT}
        />
        <UiEntity
          uiTransform={{
            width: '100%',
            minHeight: this.fontSize * 2
          }}
          // uiBackground={{color:Color4.Red()}}
        >
          {/* Need to implement last visitors portrait */}
          {this.infoDetail(
            this.sceneOnline.toString(),
            { atlasName: 'icons', spriteName: 'Members' },
            {
              width: 'auto',
              height: this.fontSize,
              margin: { right: this.fontSize }
            },
            BLACK_TEXT
          )}

          {/* Need to implement number formating */}
          {this.infoDetail(
            this.sceneViews.toString() + 'k',
            { atlasName: 'icons', spriteName: 'PreviewIcon' },
            {
              width: 'auto',
              height: this.fontSize,
              margin: { right: this.fontSize }
            },
            BLACK_TEXT
          )}

          {this.infoDetail(
            this.sceneRating.toString() + '%',
            { atlasName: 'icons', spriteName: 'Like solid' },
            {
              width: 'auto',
              height: this.fontSize,
              margin: { right: this.fontSize }
            },
            BLACK_TEXT
          )}
        </UiEntity>

        <ButtonTextIcon
          uiTransform={{
            width: '100%',
            height: 2 * this.fontSize,
            flexDirection: 'row-reverse'
          }}
          onMouseDown={() => {}}
          value={'JUMP IN'}
          backgroundColor={RUBY}
          fontSize={this.fontSize}
          iconSize={1.5 * this.fontSize}
          icon={{
            atlasName: 'icons',
            spriteName: 'JumpIn'
          }}
        />
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 'auto',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: { top: this.fontSize * 0.5 }
          }}
        >
          <ButtonIcon
            uiTransform={{
              width: '23%',
              height: this.fontSize * 2
            }}
            iconSize={this.fontSize * 1.5}
            icon={this.likeIcon}
            backgroundColor={this.likeBackgroundColor}
            iconColor={this.isLiked ? RUBY : BLACK_TEXT}
            onMouseEnter={() => {
              this.onLikeEnter()
            }}
            onMouseLeave={() => {
              this.updateBackgrounds()
            }}
            onMouseDown={() => {
              this.setLike(!this.isLiked)
            }}
          />
          <ButtonIcon
            uiTransform={{
              width: '23%',
              height: this.fontSize * 2
            }}
            iconSize={this.fontSize * 1.5}
            icon={this.dislikeIcon}
            backgroundColor={this.dislikeBackgroundColor}
            iconColor={this.isDisliked ? RUBY : BLACK_TEXT}
            onMouseEnter={() => {
              this.onDislikeEnter()
            }}
            onMouseLeave={() => {
              this.updateBackgrounds()
            }}
            onMouseDown={() => {
              this.setDislike(!this.isDisliked)
            }}
          />
          <ButtonIcon
            uiTransform={{
              width: '23%',
              height: this.fontSize * 2
            }}
            iconSize={this.fontSize * 1.5}
            icon={this.favIcon}
            backgroundColor={this.setFavBackgroundColor}
            iconColor={this.isFav ? Color4.Red() : BLACK_TEXT}
            onMouseEnter={() => {
              this.onFavEnter()
            }}
            onMouseLeave={() => {
              this.updateBackgrounds()
            }}
            onMouseDown={() => {
              this.setFav(!this.isFav)
            }}
          />
          <ButtonIcon
            uiTransform={{
              width: '23%',
              height: this.fontSize * 2
            }}
            iconSize={this.fontSize * 1.5}
            icon={this.shareIcon}
            backgroundColor={this.shareBackgroundColor}
            iconColor={GRAY_TEXT}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  infoDetail(
    value: string,
    icon: AtlasIcon,
    uiTransform: Partial<UiTransformProps>,
    color?: Color4,
    title?: string
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
        {title !== undefined && (
          <Label
            value={title}
            fontSize={this.fontSize}
            textAlign="middle-left"
            uiTransform={{ width: '100%', height: this.fontSize }}
            color={GRAY_TEXT}
          />
        )}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 'auto',
            margin: { top: this.fontSize * 0.25 }
          }}
        >
          <UiEntity
            uiTransform={{
              width: this.fontSize * 1.25,
              height: this.fontSize * 1.25,
              margin: { left: this.fontSize * 0.5 }
            }}
            uiBackground={
              color !== undefined
                ? { ...getBackgroundFromAtlas(icon), color }
                : { ...getBackgroundFromAtlas(icon), color: GRAY_TEXT }
            }
          />
          <Label
            value={value}
            fontSize={this.fontSize}
            textAlign="middle-left"
            uiTransform={{ width: '70%', height: this.fontSize * 1.2 }}
            color={BLACK_TEXT}
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
        spriteName = 'GamesIcn'
        break
      case 'favorites':
        title = 'FAVORITES'
        spriteName = 'FavouritesIcn'
        break
      case 'art':
        title = 'ART'
        spriteName = 'ArtIcn'
        break
      case 'crypto':
        title = 'CRYPTO'
        spriteName = 'CryptoIcn'
        break
      case 'social':
        title = 'SOCIAL'
        spriteName = 'SocialIcn'
        break
      case 'shop':
        title = 'SHOP'
        spriteName = 'ShopIcn'
        break
      case 'education':
        title = 'EDUCATION'
        spriteName = 'EducationIcn'
        break
      case 'music':
        title = 'MUSIC'
        spriteName = 'MusicIcn'
        break
      case 'fashion':
        title = 'FASHION'
        spriteName = 'FashionIcn'
        break
      case 'casino':
        title = 'CASINO'
        spriteName = 'CasinoIcn'
        break
      case 'sports':
        title = 'SPORTS'
        spriteName = 'SportsIcn'
        break
      case 'business':
        title = 'BUSINESS'
        spriteName = 'BusinessIcn'
        break
      case 'poi':
        title = 'POINT OF INTEREST'
        spriteName = 'POIIcn'
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
          color={BLACK_TEXT}
        />
      </UiEntity>
    )
  }

  overviewContent(): ReactEcs.JSX.Element {
    return (
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
          value={'DESCRIPTION'}
          fontSize={this.fontSize}
          textAlign="bottom-left"
          uiTransform={{ width: '100%' }}
          color={GRAY_TEXT}
        />

        <Label
          value={this.sceneDescription}
          fontSize={this.fontSize}
          textAlign="bottom-left"
          uiTransform={{ width: '100%' }}
          color={BLACK_TEXT}
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
          color={GRAY_TEXT}
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
            this.sceneCoords.x + ',' + this.sceneCoords.y,
            {
              atlasName: 'icons',
              spriteName: 'PinIcn'
            },
            { width: 'auto', height: 'auto', margin: { right: this.fontSize } },
            undefined,
            'LOCATION'
          )}
          {this.infoDetail(
            this.sceneParcels.toString(),
            {
              atlasName: 'map',
              spriteName: 'ParcelsIcn'
            },
            { width: 'auto', height: 'auto' },
            undefined,
            'PARCELS'
          )}
        </UiEntity>
      </UiEntity>
    )
  }

  eventCard(event: EventFromApi): ReactEcs.JSX.Element | null {
    const BIG_TEXT = this.fontSize
    const SMALL_TEXT = BIG_TEXT * 0.8

    const CARD_HEIGHT = this.fontSize * 8
    const CARD_PADDING = this.fontSize * 0.5

    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: CARD_HEIGHT,
          alignItems: 'center',
          padding: CARD_PADDING,
          margin: { bottom: this.fontSize }
        }}
        uiBackground={{
          color: DCL_SNOW,
          textureMode: 'nine-slices',
          texture: {
            src: 'assets/images/backgrounds/rounded-right.png'
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
            minWidth: CARD_HEIGHT - CARD_PADDING * 4,
            minHeight: CARD_HEIGHT - CARD_PADDING * 4
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: event.image, wrapMode: 'clamp' }
          }}
        />
        <UiEntity
          uiTransform={{
            width: '50%',
            height: 'auto',
            flexDirection: 'column',
            alignItems: 'flex-start',
            margin: { left: CARD_PADDING }
          }}
        >
          <Label
            value={formatEventTime(
              getTimestamp(event.start_at),
              getTimestamp(event.finish_at)
            )}
            fontSize={SMALL_TEXT * 0.7}
            uiTransform={{
              height: SMALL_TEXT * 1.1,
              margin: { left: BIG_TEXT * 0.2 }
            }}
            color={Color4.Black()}
          />
          <Label
            value={truncateWithoutBreakingWords(event.name, 20)}
            fontSize={BIG_TEXT}
            uiTransform={{ height: BIG_TEXT, width: '90%' }}
            color={Color4.Black()}
            textWrap="nowrap"
          />
          <UiEntity
            uiTransform={{
              width: '90%',
              height: BIG_TEXT,
              alignItems: 'center'
            }}
          >
            <UiEntity
              uiTransform={{
                width: this.fontSize * 0.8,
                height: this.fontSize * 0.88,
                margin: { left: this.fontSize * 0.5 }
              }}
              uiBackground={{
                ...getBackgroundFromAtlas({
                  atlasName: 'icons',
                  spriteName: 'Members'
                }),
                color: GRAY_TEXT
              }}
            />
            <Label
              value={event.total_attendees.toString() + ' interested'}
              fontSize={SMALL_TEXT}
              color={GRAY_TEXT}
            />
          </UiEntity>
          <UiEntity uiTransform={{ width: '100%' }}>
            {getTimestamp(event.start_at) <= Date.now() / 1000 && (
              <ButtonTextIcon
                uiTransform={{
                  width: '100%',
                  height: 2 * BIG_TEXT,
                  flexDirection: 'row-reverse',
                  flexGrow: 1
                }}
                onMouseDown={() => {}}
                value={'JUMP IN'}
                backgroundColor={RUBY}
                fontSize={BIG_TEXT}
                iconSize={1.2 * BIG_TEXT}
                icon={{
                  atlasName: 'icons',
                  spriteName: 'JumpIn'
                }}
              />
            )}
            {getTimestamp(event.start_at) > Date.now() / 1000 && (
              <ButtonTextIcon
                uiTransform={{
                  width: '100%',
                  height: 2 * BIG_TEXT,
                  flexGrow: 1
                }}
                onMouseDown={() => {
                  if (
                    this.interestedEventsId.find(
                      (eventId) => eventId === event.id
                    ) === undefined
                  ) {
                    this.interestedEventsId.push(event.id)
                  } else {
                    this.interestedEventsId = this.interestedEventsId.filter(
                      (eventId) => eventId !== event.id
                    )
                  }
                }}
                value={'INTERESTED'}
                backgroundColor={DCL_SNOW}
                fontSize={BIG_TEXT}
                iconSize={1.2 * BIG_TEXT}
                fontColor={BLACK_TEXT}
                iconColor={BLACK_TEXT}
                icon={{
                  atlasName: 'icons',
                  spriteName:
                    this.interestedEventsId.find(
                      (eventId) => eventId === event.id
                    ) !== undefined
                      ? 'StarSolid'
                      : 'StarOutline'
                }}
              />
            )}
            <ButtonIcon
              uiTransform={{
                width: 2 * BIG_TEXT,
                height: 2 * BIG_TEXT,
                margin: { left: BIG_TEXT / 2.5 }
              }}
              iconSize={1.2 * BIG_TEXT}
              icon={{
                atlasName: 'context',
                spriteName: 'Share'
              }}
              backgroundColor={DCL_SNOW}
              iconColor={GRAY_TEXT}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  eventsContent(): ReactEcs.JSX.Element {
    const eventsArray = Object.values(
      store.getState().events.explorerEvents
    ).filter(
      (event) =>
        event.x === this.sceneCoords.x && event.y === this.sceneCoords.y
    )
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 'auto',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        {eventsArray.length > 0 &&
          eventsArray.map((event) => this.eventCard(event))}
        {eventsArray.length === 0 &&
          this.noResults(
            { atlasName: 'icons', spriteName: 'Events' },
            this.fontSize * 3,
            'No Upcoming Events',
            this.fontSize,
            BLACK_TEXT
          )}
      </UiEntity>
    )
  }

  photosContent(): ReactEcs.JSX.Element {
    const photosArray = []
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 'auto',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        
        {photosArray.length === 0 &&
          this.noResults(
            { atlasName: 'icons', spriteName: 'Camera' },
            this.fontSize * 3,
            'There Are No Photos',
            this.fontSize,
            BLACK_TEXT
          )}
      </UiEntity>
    )
  }

  noResults(
    icon: AtlasIcon,
    iconSize: number,
    message: string,
    fontSize: number,
    color: Color4,
    uiTransform?: Partial<UiTransformProps>
  ): ReactEcs.JSX.Element {
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          flexGrow: 1,
          justifyContent: 'center',
          ...uiTransform
        }}
      >
        <UiEntity
          uiTransform={{ width: iconSize, height: iconSize }}
          uiBackground={{ ...getBackgroundFromAtlas(icon), color }}
        />
        <Label value={message} color={color} fontSize={fontSize} />
      </UiEntity>
    )
  }
}

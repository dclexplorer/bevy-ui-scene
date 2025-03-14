import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4, Vector2 } from '@dcl/sdk/math'
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
  EVENT_BACKGROUND_COLOR,
  GRAY_TEXT,
  PANEL_BACKGROUND_COLOR,
  ROUNDED_TEXTURE_BACKGROUND,
  RUBY,
  SELECTED_BUTTON_COLOR
} from '../../utils/constants'
import type { AtlasIcon } from '../../utils/definitions'
import Canvas from '../../components/canvas/Canvas'
import {
  formatEventTime,
  getBackgroundFromAtlas,
  getTimestamp,
  truncateWithoutBreakingWords
} from '../../utils/ui-utils'
import { ButtonIcon } from '../../components/button-icon'
import { ButtonTextIcon } from '../../components/button-text-icon'
import type {
  PlaceFromApi,
  EventFromApi,
  CategoryFromApi
} from './SceneInfoCard.types'
import {
  fetchEvents,
  fetchPhotos,
  fetchPhotosQuantity,
  fetchPlaceId,
  updateFavoriteStatus
} from 'src/utils/promise-utils'
import { store } from 'src/state/store'
import {
  loadEventsFromApi,
  loadPhotosFromApi,
  loadPlaceFromApi
} from 'src/state/sceneInfo/actions'
import type { PhotoFromApi } from '../photos/Photos.types'

export default class SceneInfoCard {
  private sceneCoords: { x: number; y: number } = { x: 0, y: 0 }
  private readonly uiController: UIController
  private scrollPos: Vector2 = Vector2.create(0, 0)
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

  public selectedTab: 'overview' | 'photos' | 'events' = 'overview'

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  async changeSceneCoords(x: number, y: number): Promise<void> {
    this.sceneCoords = { x, y }
    await this.updateSceneInfo()
  }

  async updateSceneInfo(): Promise<void> {
    const place: PlaceFromApi = await fetchPlaceId(
      this.sceneCoords.x,
      this.sceneCoords.y
    )
    const photosQuantityInPlace: number = await fetchPhotosQuantity(place.id)
    const photosArray: PhotoFromApi[] = await fetchPhotos(
      place.id,
      photosQuantityInPlace
    )
    const eventsArray: EventFromApi[] = await fetchEvents(place.positions)

    store.dispatch(loadEventsFromApi(eventsArray))
    store.dispatch(loadPhotosFromApi(photosArray))
    store.dispatch(loadPlaceFromApi(place))

    console.log('Is Favorite: ', place.user_favorite)
    this.isFav = place.user_favorite
    this.isLiked = place.user_like
    this.isDisliked = place.user_dislike
    this.updateIcons()
  }

  async show(): Promise<void> {
    this.uiController.sceneInfoCardVisible = true
    await this.changeSceneCoords(-9, -9)
  }

  hide(): void {
    this.uiController.sceneInfoCardVisible = false
    this.updateBackgrounds()
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

  async toggleFav(): Promise<void> {
    // There are some extra lines for avoid eslint issues (maybe I've got a bad config)

    const sceneId: string = store.getState().scene.explorerPlace.id
    const userFavorite: boolean =
      store.getState().scene.explorerPlace.user_favorite
    const arg: boolean = !userFavorite
    console.log({ arg })
    const favData = await updateFavoriteStatus(sceneId, arg)
    const favDataOk: boolean = favData.ok
    if (favDataOk) {
      await this.updateSceneInfo()
    }
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
    this.scrollPos = Vector2.create(0, 0)
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

    const place: PlaceFromApi = store.getState().scene.explorerPlace
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
            uiTransform={{ width: panelWidth, minHeight: panelWidth * 0.75 }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: place.image.replace(
                  'https://camera-reel-service.decentraland.org/api/images/',
                  'https://camera-reel-s3-bucket.decentraland.org/'
                )
              }
            }}
          />

          {this.topBar()}
          {/* CONTENT */}
          <UiEntity
            uiTransform={{
              width: '100%',
              overflow: 'scroll',
              scrollPosition: this.scrollPos,
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
              {this.selectedTab === 'photos' && this.photosContent(panelWidth)}
              {this.selectedTab === 'events' && this.eventsContent()}
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  topBar(): ReactEcs.JSX.Element {
    const place: PlaceFromApi = store.getState().scene.explorerPlace
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
          }}
          backgroundColor={this.closeBackground}
          icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
        />
        <Label
          value={place.title}
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
              value={
                'PHOTOS (' +
                Object.values(store.getState().scene.explorerPhotos).length +
                ')'
              }
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
                Object.values(store.getState().scene.explorerEvents).length +
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
    const place: PlaceFromApi = store.getState().scene.explorerPlace
    const likeRate: number = place.like_rate ?? 0
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
          value={place.title}
          fontSize={this.fontSize * 1.2}
          textAlign="middle-left"
          uiTransform={{
            width: '100%',
            height: this.fontSize * 1.5,
            margin: { top: this.fontSize * 0.5 }
          }}
          color={BLACK_TEXT}
        />
        {place.contact_name !== null && (
          <Label
            value={'Created by ' + place.contact_name}
            fontSize={this.fontSize * 0.8}
            textAlign="middle-left"
            uiTransform={{
              width: '100%',
              height: this.fontSize,
              margin: { left: this.fontSize * 0.5 }
            }}
            color={BLACK_TEXT}
          />
        )}
        <UiEntity
          uiTransform={{
            width: '100%',
            minHeight: this.fontSize * 2
          }}
          // uiBackground={{color:Color4.Red()}}
        >
          {/* Need to implement last visitors portrait */}
          {this.infoDetail(
            place.user_count.toString(),
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
            place.user_visits.toString() + 'k',
            { atlasName: 'icons', spriteName: 'PreviewIcon' },
            {
              width: 'auto',
              height: this.fontSize,
              margin: { right: this.fontSize }
            },
            BLACK_TEXT
          )}

          {likeRate > 0 &&
            this.infoDetail(
              Math.round(likeRate * 100).toString() + '%',
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
            iconColor={place.user_favorite ? Color4.Red() : BLACK_TEXT}
            onMouseEnter={() => {
              this.onFavEnter()
            }}
            onMouseLeave={() => {
              this.updateBackgrounds()
            }}
            onMouseDown={() => {
              void this.toggleFav()
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
    type: CategoryFromApi,
    index: string | number
  ): ReactEcs.JSX.Element {
    let title = ''
    let spriteName = ''

    switch (type) {
      case 'game':
        title = 'GAME'
        spriteName = 'GamesIcn'
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
          ...ROUNDED_TEXTURE_BACKGROUND,
          color: DCL_SNOW
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
    const place: PlaceFromApi = store.getState().scene.explorerPlace
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
        {place.description !== null && (
          <Label
            value={'DESCRIPTION'}
            fontSize={this.fontSize}
            textAlign="bottom-left"
            uiTransform={{ width: '100%' }}
            color={GRAY_TEXT}
          />
        )}

        {place.description !== null && (
          <Label
            value={place.description}
            fontSize={this.fontSize}
            textAlign="bottom-left"
            uiTransform={{ width: '100%' }}
            color={BLACK_TEXT}
          />
        )}
        {place.categories.length !== 0 && (
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
        )}
        {place.categories.length !== 0 && (
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
            {place.categories.map((tag, index) => this.filterChip(tag, index))}
          </UiEntity>
        )}
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
            place.base_position,
            {
              atlasName: 'icons',
              spriteName: 'PinIcn'
            },
            { width: 'auto', height: 'auto', margin: { right: this.fontSize } },
            undefined,
            'LOCATION'
          )}
          {this.infoDetail(
            place.positions.length.toString(),
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
          ...ROUNDED_TEXTURE_BACKGROUND,
          color: EVENT_BACKGROUND_COLOR
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
            fontSize={SMALL_TEXT}
            uiTransform={{
              height: SMALL_TEXT * 1.1,
              margin: { left: BIG_TEXT * 0.2, bottom: BIG_TEXT * 0.3 }
            }}
            color={Color4.Black()}
          />
          <Label
            value={truncateWithoutBreakingWords(event.name, 20)}
            fontSize={BIG_TEXT}
            uiTransform={{
              height: BIG_TEXT,
              width: '90%',
              margin: { bottom: BIG_TEXT * 0.3 }
            }}
            color={Color4.Black()}
            textWrap="nowrap"
            textAlign="middle-left"
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
              value={event.total_attendees.toString()}
              fontSize={SMALL_TEXT}
              color={GRAY_TEXT}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{ width: '100%', margin: { top: BIG_TEXT * 0.3 } }}
          >
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
                backgroundColor={Color4.White()}
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
                minHeight: 2 * BIG_TEXT,
                minWidth: 2 * BIG_TEXT,
                margin: { left: BIG_TEXT / 2.5 }
              }}
              iconSize={1.2 * BIG_TEXT}
              icon={{
                atlasName: 'context',
                spriteName: 'Share'
              }}
              backgroundColor={DCL_SNOW}
              iconColor={BLACK_TEXT}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  eventsContent(): ReactEcs.JSX.Element {
    const eventsArray = Object.values(store.getState().scene.explorerEvents)
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

  photosContent(width: number): ReactEcs.JSX.Element {
    const photosArray = Object.values(store.getState().scene.explorerPhotos)
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
        {photosArray.length > 0 &&
          photosArray.map((photo, index) => (
            <UiEntity
              uiTransform={{
                width: width * 0.88,
                height: width * 0.88 * 0.56,
                margin: this.fontSize * 0.1
              }}
              onMouseDown={() => {
                this.uiController.photosPanel.showPhoto(index)
                this.hide()
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: photo.url.replace(
                    'https://camera-reel-service.decentraland.org/api/images/',
                    'https://camera-reel-s3-bucket.decentraland.org/'
                  )
                }
              }}
            />
          ))}
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

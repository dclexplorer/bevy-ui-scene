import { Color4 } from '@dcl/ecs-math/dist/Color4'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { ButtonIcon } from 'src/components/button-icon'
import { store } from 'src/state/store'
import { DCL_SNOW, GRAY_TEXT, ORANGE } from 'src/utils/constants'
import Canvas from '../../components/canvas/Canvas'
import { type UIController } from '../../controllers/ui.controller'
import type {
  PhotoFromApi,
  PhotoMetadataResponse,
  VisiblePerson
} from './Photos.types'
import { fetchPhotoMetadata } from 'src/utils/promise-utils'
import { loadPhotoInfoFromApi } from 'src/state/photoInfo/actions'
import { formatTimestamp, getBackgroundFromAtlas } from 'src/utils/ui-utils'

export default class Photos {
  private readonly uiController: UIController
  public fontSize: number = 16
  public index: number = 0
  public leftColor: Color4 = DCL_SNOW
  public rightColor: Color4 = DCL_SNOW
  private infoVisible: boolean = false
  selectedPeople: number = -1

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  updateButtons(): void {
    this.leftColor = DCL_SNOW
    this.rightColor = DCL_SNOW
  }

  showPhoto(index: number): void {
    void this.getMetadata(store.getState().scene.explorerPhotos[index].id)
    this.index = index
    this.selectedPeople = -1
  }

  hide(): void {
    this.uiController.isPhotosVisible = false
  }

  async getMetadata(photoId: string): Promise<void> {
    const photoMetadata: PhotoMetadataResponse =
      await fetchPhotoMetadata(photoId)
    store.dispatch(loadPhotoInfoFromApi(photoMetadata))
    this.uiController.isPhotosVisible = true
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    // const {title, paragraph, smallText} = getFontSizesByResolution()

    const arrayPhotos: PhotoFromApi[] = store.getState().scene.explorerPhotos
    const photoInfo: PhotoMetadataResponse = store.getState().photo.photoInfo

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            position: {
              right: 0,
              top: 0
            },
            positionType: 'absolute'
          }}
          uiBackground={{
            color: Color4.Black()
          }}
        >
          {/* LEFT SIDE */}

          <UiEntity
            uiTransform={{
              width: this.infoVisible
                ? canvasInfo.width * 0.7
                : canvasInfo.width,
              height: canvasInfo.height,
              alignItems: 'center'
            }}
          >
            {/* PHOTO AND NAVIGATION */}
            <UiEntity
              uiTransform={{
                width: this.infoVisible
                  ? canvasInfo.width * 0.7
                  : canvasInfo.width,
                height: this.infoVisible
                  ? canvasInfo.width * 0.7 * 0.56
                  : canvasInfo.width * 0.56,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src:
                    arrayPhotos.length > 0
                      ? arrayPhotos[this.index].url.replace(
                          'https://camera-reel-service.decentraland.org/api/images/',
                          'https://camera-reel-s3-bucket.decentraland.org/'
                        )
                      : ''
                }
              }}
            >
              <ButtonIcon
                uiTransform={{
                  height: this.fontSize * 4,
                  width: this.fontSize * 4,
                  display: this.index > 0 ? 'flex' : 'none'
                }}
                iconColor={this.leftColor}
                onMouseEnter={() => {
                  this.leftColor = ORANGE
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.showPhoto(this.index - 1)
                }}
                icon={{ atlasName: 'icons', spriteName: 'LeftArrow' }}
              />

              <UiEntity uiTransform={{ width: 1, height: 1 }} />
              <ButtonIcon
                uiTransform={{
                  height: this.fontSize * 4,
                  width: this.fontSize * 4,
                  display: this.index < arrayPhotos.length ? 'flex' : 'none'
                }}
                iconColor={this.rightColor}
                onMouseEnter={() => {
                  this.rightColor = ORANGE
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.showPhoto(this.index + 1)
                }}
                icon={{ atlasName: 'icons', spriteName: 'RightArrow' }}
              />
            </UiEntity>
            {/* TOP BAR */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                flexDirection: 'row',
                positionType: 'absolute',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: { top: 0 }
              }}
            >
              <ButtonIcon
                uiTransform={{
                  height: this.fontSize * 4,
                  width: this.fontSize * 4
                }}
                iconColor={ORANGE}
                onMouseDown={() => {
                  this.hide()
                }}
                icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
              />

              <ButtonIcon
                uiTransform={{
                  height: this.fontSize * 4,
                  width: this.fontSize * 4
                }}
                iconColor={ORANGE}
                onMouseDown={() => {
                  void this.uiController.sceneCard.changeSceneCoords(0, 0)
                }}
                icon={{ atlasName: 'context', spriteName: 'Download' }}
              />
              <ButtonIcon
                uiTransform={{
                  height: this.fontSize * 4,
                  width: this.fontSize * 4
                }}
                iconColor={ORANGE}
                onMouseDown={() => {
                  this.infoVisible = !this.infoVisible
                }}
                icon={{ atlasName: 'icons', spriteName: 'Menu' }}
              />
            </UiEntity>
          </UiEntity>
          {/* INFO */}
          <UiEntity
            uiTransform={{
              padding: this.fontSize * 1.5,
              width: canvasInfo.width * 0.3,
              height: '100%',
              flexDirection: 'column',
              display: this.infoVisible ? 'flex' : 'none',
              alignItems: 'flex-start'
            }}
          >
            <Label
              value={`${formatTimestamp(
                photoInfo.metadata.dateTime
              )} - Taken by ${photoInfo.metadata.userName} `}
              fontSize={this.fontSize}
              textAlign="middle-left"
              uiTransform={{ width: 'auto', height: 'auto' }}
            />
            <Label
              value={'PLACE'}
              color={GRAY_TEXT}
              textAlign="middle-center"
              fontSize={this.fontSize}
              uiTransform={{ width: 'auto', height: 4 * this.fontSize }}
            />
            <UiEntity
              uiTransform={{
                width: '90%',
                height: 'auto',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <UiEntity
                uiTransform={{
                  width: this.fontSize * 1.5,
                  height: this.fontSize * 1.5,
                  alignItems: 'center'
                }}
                uiBackground={getBackgroundFromAtlas({
                  atlasName: 'icons',
                  spriteName: 'PinIcn'
                })}
              />
              <Label
                value={
                  photoInfo.metadata.scene.name +
                  ', (' +
                  photoInfo.metadata.scene.location.x +
                  ', ' +
                  photoInfo.metadata.scene.location.y +
                  ')'
                }
                textAlign="middle-center"
                fontSize={this.fontSize}
                uiTransform={{ width: 'auto', height: 4 * this.fontSize }}
              />
              <ButtonIcon
                uiTransform={{
                  width: this.fontSize * 2,
                  height: this.fontSize * 2
                }}
                icon={{
                  atlasName: 'icons',
                  spriteName: 'JumpIn'
                }}
              />
            </UiEntity>
            <Label
              value={'PEOPLE'}
              color={GRAY_TEXT}
              textAlign="middle-center"
              fontSize={this.fontSize}
              uiTransform={{ width: 'auto', height: 4 * this.fontSize }}
            />
            {photoInfo.metadata.visiblePeople.map((person, index) =>
              this.person(person, index)
            )}
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  person(person: VisiblePerson, index: number): ReactEcs.JSX.Element {
    return (
      <UiEntity uiTransform={{ width: '90%', height: 'auto', flexDirection:'column'}}>
        <UiEntity uiTransform={{ width: '100%', height: 'auto' , justifyContent:'space-between', alignItems:'center' }} >
        <UiEntity uiTransform={{ width: '100%', height: 'auto' }}>
          <UiEntity
                  uiTransform={{
                    width: this.fontSize * 2.5,
                    height: this.fontSize * 2.5,
                  }}
                  uiBackground={
                             getBackgroundFromAtlas({
                                  atlasName: 'icons',
                                  spriteName: 'DdlIconColor'
                                })
                              // : { avatarTexture: { userId: props.message.from } }
                          }
                />
          
          <Label
            value={person.userName}
            fontSize={this.fontSize}
            uiTransform={{ width: 'auto', height: 'auto' }}
          />
          </UiEntity>
          <ButtonIcon
            onMouseDown={() => { if(index === this.selectedPeople){this.selectedPeople = -1} else{this.selectedPeople = index}}}
            uiTransform={{ width: 2 * this.fontSize, height: 2 * this.fontSize }}
            icon={{
              atlasName: 'icons',
              spriteName:
                this.selectedPeople === index ? 'UpArrow' : 'DownArrow'
            }}
            
          />
        </UiEntity>
        <UiEntity uiTransform={{ width: '100%', height: this.fontSize * 2, display: index === this.selectedPeople ? 'flex':'none' }}> 
          { person.wearables.length > 0 ?<Label
            value={'WEARABLES'}
            fontSize={this.fontSize}
            uiTransform={{ width: 'auto', height: 'auto' }}
          />:<Label
            value={'No collectibles equipped when the photo was taken.'}
            fontSize={this.fontSize}
            textWrap='wrap'
            uiTransform={{ width: 'auto', height: 'auto' }}
          /> }
          </UiEntity>
          <UiEntity uiTransform={{width:'100%', height:1, margin:{bottom:this.fontSize, top:this.fontSize}}} uiBackground={{color:{...GRAY_TEXT, a:0.5}}}/>
      </UiEntity>
    )
  }
}

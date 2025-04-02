import { Color4 } from '@dcl/ecs-math/dist/Color4'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, {
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { ButtonIcon } from 'src/components/button-icon'
import { store } from 'src/state/store'
import {
  DCL_SHADOW,
  DCL_SNOW,
  GRAY_TEXT,
  ROUNDED_TEXTURE_BACKGROUND,
  RUBY
} from 'src/utils/constants'
import Canvas from '../../components/canvas/Canvas'
import { type UIController } from '../../controllers/ui.controller'
import type {
  PhotoFromApi,
  PhotoMetadataResponse,
  VisiblePerson,
  WearableData
} from './Photos.types'
import { fetchPhotoMetadata, fetchWearable } from 'src/utils/promise-utils'
import {
  loadPhotoInfoFromApi,
  loadWearablesFromPhoto
} from 'src/state/photoInfo/actions'
import {
  formatTimestamp,
  formatURN,
  // formatURN,
  getBackgroundFromAtlas
} from 'src/utils/ui-utils'
import { ButtonText } from 'src/components/button-text'
import { openExternalUrl } from '~system/RestrictedActions'

export default class Photos {
  private readonly uiController: UIController
  public fontSize: number = 16
  public index: number = 0
  public closeBackgroundColor: Color4 = { ...Color4.White(), a: 0.05 }
  public infoBackgroundColor: Color4 = { ...Color4.White(), a: 0.05 }
  public rightBackgroundColor: Color4 = { ...Color4.White(), a: 0.05 }
  public leftBackgroundColor: Color4 = { ...Color4.White(), a: 0.05 }
  private infoVisible: boolean = false
  selectedPeople: number = -1

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  updateButtons(): void {
    this.closeBackgroundColor = { ...Color4.White(), a: 0.05 }
    this.infoBackgroundColor = { ...Color4.White(), a: 0.05 }
    this.rightBackgroundColor = { ...Color4.White(), a: 0.05 }
    this.leftBackgroundColor = { ...Color4.White(), a: 0.05 }
  }

  showPhoto(index: number): void {
    this.getMetadataAndWearables(
      store.getState().scene.explorerPhotos[index].id
    ).catch((reason) => {
      console.error(reason)
    })
    this.index = index
    this.selectedPeople = -1
  }

  hide(): void {
    this.uiController.isPhotosVisible = false
  }

  async getMetadataAndWearables(photoId: string): Promise<void> {
    const photoMetadata: PhotoMetadataResponse =
      await fetchPhotoMetadata(photoId)
    store.dispatch(loadPhotoInfoFromApi(photoMetadata))
    store.dispatch(loadWearablesFromPhoto([]))
    this.uiController.isPhotosVisible = true
    if (photoMetadata.metadata.visiblePeople.length > 0) {
      for (let i = 0; i < photoMetadata.metadata.visiblePeople.length; i++) {
        console.log('user: ', photoMetadata.metadata.visiblePeople[i].userName)

        if (photoMetadata.metadata.visiblePeople[i].wearables.length > 0) {
          for (
            let j = 0;
            j < photoMetadata.metadata.visiblePeople[i].wearables.length;
            j++
          ) {
            const urn = formatURN(
              photoMetadata.metadata.visiblePeople[i].wearables[j]
            )

            if (urn === undefined || urn.version !== 'collections-v2') {
              console.error('Invalid urn: ', urn)
              continue
            }

            const wearable: WearableData | null = await fetchWearable(urn)

            if (wearable === null) {
              console.error('Wearable not found: ', urn)
            } else {
              const wearables: WearableData[] =
                store.getState().photo.wearablesInfo
              store.dispatch(loadWearablesFromPhoto([...wearables, wearable]))
            }
          }
        }
      }
    }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

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
                  height: this.fontSize * 2,
                  width: this.fontSize * 2,
                  display: this.index > 0 ? 'flex' : 'none',
                  margin: { left: this.fontSize * 2 }
                }}
                iconColor={DCL_SNOW}
                backgroundColor={this.leftBackgroundColor}
                onMouseEnter={() => {
                  this.leftBackgroundColor = { ...Color4.White(), a: 0.1 }
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
                  height: this.fontSize * 2,
                  width: this.fontSize * 2,
                  display: this.index < arrayPhotos.length ? 'flex' : 'none',
                  margin: { right: this.fontSize * 2 }
                }}
                iconColor={DCL_SNOW}
                backgroundColor={this.rightBackgroundColor}
                onMouseEnter={() => {
                  this.rightBackgroundColor = { ...Color4.White(), a: 0.1 }
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
                  height: this.fontSize * 2,
                  width: this.fontSize * 2,
                  margin: { left: this.fontSize * 1, top: this.fontSize * 1 }
                }}
                backgroundColor={this.closeBackgroundColor}
                onMouseEnter={() => {
                  this.closeBackgroundColor = { ...Color4.White(), a: 0.1 }
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                iconColor={DCL_SNOW}
                onMouseDown={() => {
                  this.hide()
                }}
                icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
                iconSize={this.fontSize}
              />
              <UiEntity
                uiTransform={{
                  height: 'auto',
                  width: 'auto',
                  margin: { right: this.fontSize * 1, top: this.fontSize * 1 }
                }}
              >
                {/* <ButtonIcon
                  uiTransform={{
                    height: this.fontSize * 2,
                    width: this.fontSize * 2,
                    margin: { left: this.fontSize }
                  }}
                  backgroundColor={this.infoBackgroundColor}
                  onMouseEnter={() => {
                    this.infoBackgroundColor = { ...Color4.White(), a: 0.1 }
                  }}
                  onMouseLeave={() => {
                    this.updateButtons()
                  }}
                  iconColor={DCL_SNOW}
                  onMouseDown={() => {
                    this.infoVisible = !this.infoVisible
                  }}
                  icon={{
                    atlasName: 'social',
                    spriteName: 'Twitter'
                  }}
                  iconSize={this.fontSize}
                />
                <ButtonIcon
                  uiTransform={{
                    height: this.fontSize * 2,
                    width: this.fontSize * 2,
                    margin: { left: this.fontSize }
                  }}
                  backgroundColor={this.infoBackgroundColor}
                  onMouseEnter={() => {
                    this.infoBackgroundColor = { ...Color4.White(), a: 0.1 }
                  }}
                  onMouseLeave={() => {
                    this.updateButtons()
                  }}
                  iconColor={DCL_SNOW}
                  onMouseDown={() => {
                    this.infoVisible = !this.infoVisible
                  }}
                  icon={{
                    atlasName: 'social',
                    spriteName: 'Link'
                  }}
                  iconSize={this.fontSize}
                />
                <ButtonIcon
                  uiTransform={{
                    height: this.fontSize * 2,
                    width: this.fontSize * 2,
                    margin: { left: this.fontSize }
                  }}
                  backgroundColor={this.infoBackgroundColor}
                  onMouseEnter={() => {
                    this.infoBackgroundColor = { ...Color4.White(), a: 0.1 }
                  }}
                  onMouseLeave={() => {
                    this.updateButtons()
                  }}
                  iconColor={DCL_SNOW}
                  onMouseDown={() => {
                    this.infoVisible = !this.infoVisible
                  }}
                  icon={{
                    atlasName: 'icons',
                    spriteName: 'DownloadIcon'
                  }}
                  iconSize={this.fontSize}
                />
                <ButtonIcon
                  uiTransform={{
                    height: this.fontSize * 2,
                    width: this.fontSize * 2,
                    margin: { left: this.fontSize }
                  }}
                  backgroundColor={this.infoBackgroundColor}
                  onMouseEnter={() => {
                    this.infoBackgroundColor = { ...Color4.White(), a: 0.1 }
                  }}
                  onMouseLeave={() => {
                    this.updateButtons()
                  }}
                  iconColor={DCL_SNOW}
                  onMouseDown={() => {
                    this.infoVisible = !this.infoVisible
                  }}
                  icon={{
                    atlasName: 'icons',
                    spriteName: 'Delete'
                  }}
                  iconSize={this.fontSize}
                /> */}

                <UiEntity
                  uiTransform={{
                    height: '100%',
                    width: 1,
                    margin: {
                      right: this.fontSize * 1,
                      left: this.fontSize * 1
                    }
                  }}
                  uiBackground={{ color: { ...Color4.White(), a: 0.1 } }}
                />
                <ButtonIcon
                  uiTransform={{
                    height: this.fontSize * 2,
                    width: this.fontSize * 2,
                    margin: { left: this.fontSize }
                  }}
                  backgroundColor={this.infoBackgroundColor}
                  onMouseEnter={() => {
                    this.infoBackgroundColor = { ...Color4.White(), a: 0.1 }
                  }}
                  onMouseLeave={() => {
                    this.updateButtons()
                  }}
                  iconColor={DCL_SNOW}
                  onMouseDown={() => {
                    this.infoVisible = !this.infoVisible
                  }}
                  icon={{
                    atlasName: 'icons',
                    spriteName: this.infoVisible
                      ? 'DoubleRightArrow'
                      : 'DoubleLeftArrow'
                  }}
                  iconSize={this.fontSize}
                />
              </UiEntity>
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
            uiBackground={{ color: DCL_SHADOW }}
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
              uiTransform={{ width: 'auto', height: 2 * this.fontSize }}
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
                uiTransform={{ width: 'auto', height: 2 * this.fontSize }}
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
            <UiEntity
              uiTransform={{
                width: '100%',
                height: canvasInfo.height - this.fontSize * 10,
                flexDirection: 'column',
                alignItems: 'flex-start',
                overflow: 'scroll'
              }}
            >
              {photoInfo.metadata.visiblePeople.map((person, index) => (
                <UiEntity
                  uiTransform={{
                    width: '90%',
                    height: 'auto',
                    flexDirection: 'column'
                  }}
                >
                  {this.person(person, index)}
                  <UiEntity
                    uiTransform={{
                      width: '100%',
                      height: 1,
                      margin: { bottom: this.fontSize, top: this.fontSize }
                    }}
                    uiBackground={{ color: { ...GRAY_TEXT, a: 0.5 } }}
                  />
                </UiEntity>
              ))}
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }

  person(person: VisiblePerson, index: number): ReactEcs.JSX.Element {
    return (
      <UiEntity
        uiTransform={{ width: '100%', height: 'auto', flexDirection: 'column' }}
        key={index}
      >
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 'auto',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <UiEntity uiTransform={{ width: '100%', height: 'auto' }}>
            <UiEntity
              uiTransform={{
                width: this.fontSize * 2.5,
                height: this.fontSize * 2.5
              }}
              uiBackground={getBackgroundFromAtlas({
                atlasName: 'icons',
                spriteName: 'DdlIconColor'
              })}
            />

            <Label
              value={person.userName}
              fontSize={this.fontSize * 1.25}
              uiTransform={{ width: 'auto', height: 'auto' }}
            />
          </UiEntity>
          <ButtonIcon
            onMouseDown={() => {
              if (index === this.selectedPeople) {
                this.selectedPeople = -1
              } else {
                this.selectedPeople = index
              }
            }}
            uiTransform={{
              width: 2 * this.fontSize,
              height: 2 * this.fontSize
            }}
            iconSize={2 * this.fontSize}
            icon={{
              atlasName: 'icons',
              spriteName:
                this.selectedPeople === index ? 'UpArrow' : 'DownArrow'
            }}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 'auto',
            display: index === this.selectedPeople ? 'flex' : 'none',
            flexDirection: 'column'
          }}
        >
          {person.wearables.length > 0 ? (
            person.wearables.map((wearable, index) =>
              this.wearable(wearable, index)
            )
          ) : (
            <Label
              value={'No collectibles equipped when the photo was taken.'}
              fontSize={this.fontSize}
              textWrap="wrap"
              uiTransform={{ width: 'auto', height: 'auto' }}
            />
          )}
        </UiEntity>
      </UiEntity>
    )
  }

  wearable(wearable: string, key: number): ReactEcs.JSX.Element | null {
    const wearables: WearableData[] = store.getState().photo.wearablesInfo
    const wearableData = wearables.find((wearableToShow) =>
      wearable.includes(wearableToShow.urn)
    )
    if (wearableData === undefined) return null
    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: this.fontSize * 6,
          margin: this.fontSize * 0.25,
          padding: this.fontSize * 0.25,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        key={key}
        uiBackground={{
          ...ROUNDED_TEXTURE_BACKGROUND,
          color: { ...Color4.White(), a: 0.05 }
        }}
      >
        <UiEntity
          uiTransform={{
            width: 'auto',
            height: 'auto',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {this.wearableThumbnail(wearableData, {
            minWidth: 5.5 * this.fontSize,
            minHeight: 5.5 * this.fontSize
          })}
          <Label
            value={wearableData.name}
            fontSize={this.fontSize * 1.25}
            // value={wearableData.urn}
            // fontSize={this.fontSize * 0.5}
            textAlign="middle-left"
          />
        </UiEntity>
        <ButtonText
          onMouseDown={() => {
            if (wearableData.formattedUrn !== undefined) {
              openExternalUrl({
                url: `https://decentraland.org/marketplace/contracts/${wearableData.formattedUrn.contractAddress}/items/${wearableData.formattedUrn.itemId}`
              }).catch(console.error)
            }
          }}
          value={'BUY'}
          fontSize={this.fontSize * 1.25}
          backgroundColor={RUBY}
          uiTransform={{
            width: 'auto',
            height: 2.5 * this.fontSize,
            margin: { right: this.fontSize * 0.5 }
          }}
        />
      </UiEntity>
    )
  }

  wearableThumbnail(
    wearable: WearableData,
    uiTransform?: Partial<UiTransformProps>
  ): ReactEcs.JSX.Element {
    return (
      <UiEntity
        uiTransform={{
          justifyContent: 'center',
          alignItems: 'center',
          ...uiTransform
        }}
        uiBackground={getBackgroundFromAtlas({
          atlasName: 'backpack',
          spriteName: wearable.data.wearable.rarity
        })}
      >
        <UiEntity
          uiTransform={{
            width: '95%',
            height: '95%'
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: wearable.thumbnail }
          }}
        />
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { top: '0%', left: '0%' },
            width: '38%',
            height: '38%'
          }}
          uiBackground={getBackgroundFromAtlas({
            atlasName: 'backpack',
            spriteName: `${wearable.data.wearable.rarity}-category`
          })}
        />
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { top: '3%', left: '3%' },
            width: '15%',
            height: '15%'
          }}
          uiBackground={getBackgroundFromAtlas({
            atlasName: 'backpack',
            spriteName: wearable.data.wearable.category
          })}
        />
      </UiEntity>
    )
  }
}

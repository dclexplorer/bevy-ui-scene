import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { CameraLayer, TextureCamera, Transform, UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { avatarCamera } from './AvatarPreview'

export default class BackpackPage {
  public fontSize: number = 16

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    // texturecam
    const cam = engine.addEntity();
    const camPos = Vector3.create(0, 1, 0);
    const camTarget = Vector3.create(8, 1, 8);
    
    CameraLayer.create(cam, {
      layer: 1,
      directionalLight: true,
      showAvatars: true,

    });

    Transform.create(cam, {position: camPos, rotation: Quaternion.fromLookAt(camPos, camTarget, Vector3.Up()) });
    TextureCamera.create(cam, {
      width: 512, 
      height: 512, 
      layer: 1, 
      clearColor: Color4.create(0.4, 0.4, 1.0, 0.5),
      mode: {
        // $case: "orthographic",
        // orthographic: { verticalRange: 10 }
        $case: "perspective",
        perspective: { fieldOfView: 0.8 }
      }
    });

    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',

          width: '100%',
          height: '100%',
          pointerFilter: 'block'
        }}
        uiBackground={{
          texture: { src: 'assets/images/backpack/background.png' },
          textureMode: 'stretch'
        }}
      >

        {/* NAVBAR */}
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: this.fontSize,
            width: '100%',
            height: canvasInfo.height * 0.075,
            pointerFilter: 'block'
          }}
          uiBackground={
            {
              color:{ ...Color4.Black(), a: 0.35 }
            }
          }
        >
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',

              width: '100%',
              height: 'auto',
              flexGrow: 1,
              pointerFilter: 'block'
            }}
          >
            {/* AVATAR */}
                <UiEntity
                                      uiTransform={{
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        margin: {
                                          bottom: this.fontSize,
                                          right: this.fontSize
                                        },
                                        width: '25%',
                                        height: '80%',
                                        padding: this.fontSize,
                                        minHeight: canvasInfo.height * 0.9 * 0.85 * 0.1,
                                        pointerFilter: 'block'
                                      }}
                                      
                                    >

                                    </UiEntity>
                
              {/* CONTENT */}
<UiEntity
                                      uiTransform={{
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        margin: {
                                          bottom: this.fontSize,
                                          right: this.fontSize
                                        },
                                        width: '65%',
                                        height: '80%',
                                        padding: this.fontSize,
                                        minHeight: canvasInfo.height * 0.9 * 0.85 * 0.1,
                                        pointerFilter: 'block'
                                      }}
                                      uiBackground={{
                                        color: { ...Color4.Black(), a: 0.35 },
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

                                    </UiEntity>
                
              </UiEntity>
            </UiEntity>
    )
  }


  showAvatar():ReactEcs.JSX.Element | null {
    if (avatarCamera === engine.RootEntity) {
      return null
    }

    return (
      <UiEntity
        uiTransform={{
          positionType: "absolute",
          position: {
            left: "60%",
            top: "10%",
            right: "10%",
            bottom: "60%",
          },
          margin: "3px",
        }}
        uiBackground={{
          color: Color4.Blue(),
        }}
      >
        <UiEntity
          uiTransform={{
            width: "80%",
            height: "80%",
        position: {
        left: "10%",
        top: "10%",
        }
          }}
          uiBackground={{
            videoTexture: { videoPlayerEntity: avatarCamera },
          }}
        />
      </UiEntity>
    );
  }
}
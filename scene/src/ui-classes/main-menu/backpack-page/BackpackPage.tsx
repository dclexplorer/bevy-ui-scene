import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import {  UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

export default class BackpackPage {
  public fontSize: number = 16

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

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
          texture: { src: 'assets/images/menu/background.png' },
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
}
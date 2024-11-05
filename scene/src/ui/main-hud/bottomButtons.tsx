import { UiEntity } from '@dcl/react-ecs'
import { ReactEcs } from '@dcl/react-ecs/dist/react-ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import Canvas from '../canvas/canvas'

type BottomButtonsProps = {
  gesturesWheelVisible: boolean
  chatVisible: boolean
  toggleChat: (arg: boolean) => void
}

function BottomButtons({
  gesturesWheelVisible,
  chatVisible,
  toggleChat
}: BottomButtonsProps): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  const hudHeight: number = Math.max(canvasInfo.height * 0.03, 32)
  let chatIconSpriteUrl: string
  if (chatVisible) {
    chatIconSpriteUrl = 'assets/images/SettingsOn.png'
  } else {
    chatIconSpriteUrl = 'assets/images/Dislike.svg'
  }

  return (
    <Canvas>
      <UiEntity
        uiTransform={{
          width: hudHeight * 2,
          height: hudHeight,

          position: { left: '15%', bottom: '1%' },
          positionType: 'absolute',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: { left: hudHeight * 0.1, right: hudHeight * 0.1 }
        }}
        uiBackground={{
          color: Color4.create(0.1, 0.1, 0.1, 1)
        }}
      >
        <UiEntity
          uiTransform={{
            width: hudHeight * 0.8,
            height: hudHeight * 0.8
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: chatIconSpriteUrl
            }
          }}
          onMouseDown={() => {
            toggleChat(!chatVisible)
          }}
        />
        <UiEntity
          uiTransform={{
            width: hudHeight * 0.8,
            height: hudHeight * 0.8
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: chatIconSpriteUrl
            }
          }}
          onMouseDown={() => {
            toggleChat(!chatVisible)
          }}
        />
      </UiEntity>
    </Canvas>
  )
}

export default BottomButtons

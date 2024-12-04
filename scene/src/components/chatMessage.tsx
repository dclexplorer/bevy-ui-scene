import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, {
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { ALMOST_WHITE, LAVANDER } from '../utils/constants'
import { Color4 } from '@dcl/sdk/math'
import { type Message } from '../utils/definitions'

function ChatMessage(props: {
  uiTransform?: UiTransformProps
  message: Message
  fontSize?: number
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        height: 'auto',
        width: '100%',
        flexDirection: props.message.from === 'me' ? 'row-reverse' : 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: { bottom: 2, top: 2 },
        ...props.uiTransform
      }}
    >
      <UiEntity
        uiTransform={{
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
          margin:
            props.message.from === 'me'
              ? { left: canvasInfo.width * 0.005 }
              : { right: canvasInfo.width * 0.005 }
        }}
        uiBackground={{
          color: props.message.from === 'me' ? Color4.Red() : Color4.Blue(),
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
      />

      <UiEntity
        uiTransform={{
          width: 'auto',
          maxWidth: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 5,
          flexDirection: 'column'
        }}
        uiBackground={{
          color: { ...Color4.Black(), a: 0.4 },
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
        <Label
          uiTransform={{
            width: 'auto',
            maxWidth: canvasInfo.width * 0.09,
            height: props.fontSize ?? 14
          }}
          value={props.message.from + ':'}
          fontSize={props.fontSize ?? 14}
          color={LAVANDER}
          textWrap="wrap"
          textAlign="middle-left"
        />
        {/* TEXT */}
        <Label
          uiTransform={{
            width: 'auto',
            maxWidth: canvasInfo.width * 0.09,
            height: 'auto'
          }}
          value={props.message.text}
          fontSize={props.fontSize ?? 14}
          color={ALMOST_WHITE}
          textWrap="wrap"
          textAlign="middle-left"
        />
      </UiEntity>
    </UiEntity>
  )
}

export default ChatMessage

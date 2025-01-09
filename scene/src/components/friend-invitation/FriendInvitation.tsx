import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'

function FriendInvitation(props: {
  // Events
  reject?: Callback
  accept?: Callback
  cancel?: Callback
  // Shape
  uiTransform?: UiTransformProps
  backgroundColor?: Color4
  // Text
  from: string
  to: string
  sent: boolean
  fontSize: number
  fontColor?: Color4
}): ReactEcs.JSX.Element | null {
  //   const ICON_MARGIN = Math.max(canvasInfo.height * 0.01, 2)
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...props.uiTransform
      }}
    >
      {/* TEXT */}
      <UiEntity
        uiTransform={{
          width: 'auto',
          height: 'auto'
        }}
        uiText={{
          value: props.sent ? props.from : props.to,
          fontSize: props.fontSize,
          color: props.fontColor ?? Color4.White()
        }}
      />

      <UiEntity
        uiTransform={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* CANCEL */}
        <UiEntity
          uiTransform={{
            width: 2 * props.fontSize,
            height: 2 * props.fontSize
          }}
          uiBackground={{
            ...getBackgroundFromAtlas({
              atlasName: 'icons',
              spriteName: 'CloseIcon'
            }),
            color: Color4.Red()
          }}
          onMouseDown={
            props.sent
              ? () => {
                  if (props.cancel !== undefined) props.cancel()
                }
              : () => {
                  if (props.reject !== undefined) props.reject()
                }
          }
        />
        {/* ACCEPT */}
        <UiEntity
          uiTransform={{
            display: props.sent ? 'none' : 'flex',
            width: 2 * props.fontSize,
            height: 2 * props.fontSize
          }}
          uiBackground={{
            ...getBackgroundFromAtlas({
              atlasName: 'icons',
              spriteName: 'Check'
            }),
            color: Color4.Green()
          }}
          onMouseDown={
            props.accept !== undefined
              ? () => {
                  if (props.accept !== undefined) props.accept()
                }
              : () => {}
          }
        />
      </UiEntity>
    </UiEntity>
  )
}

export default FriendInvitation

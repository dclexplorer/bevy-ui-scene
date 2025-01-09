import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import type { Icon } from '../../utils/definitions'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import ButtonIcon from '../button-icon/ButtonIcon'


function ButtonChip(props: {
  // Events
  onMouseEnter?: Callback
  onMouseLeave?: Callback
  onMouseDown: Callback
  deleteChip: Callback
  // Shape
  uiTransform?: UiTransformProps
  backgroundColor?: Color4
  // Text
  value: string
  fontSize: number
  icon: Icon
  fontColor?: Color4
  iconColor?: Color4
  isRemovable: boolean
}): ReactEcs.JSX.Element | null {
  //   const ICON_MARGIN = Math.max(canvasInfo.height * 0.01, 2)
  return (
    <UiEntity
      uiTransform={{
        padding: props.fontSize * 0.3,
        margin: props.fontSize * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        ...props.uiTransform
      }}
      uiBackground={{
        color: props.backgroundColor ?? { ...Color4.White(), a: 0 },
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
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {/* ICON */}

      <UiEntity
        uiTransform={{
          width: props.fontSize,
          height: props.fontSize
        }}
        uiBackground={{
          ...getBackgroundFromAtlas(props.icon),
          color: props.iconColor
        }}
      />
      {/* TEXT */}
      <UiEntity
        uiTransform={{
          width: 'auto',
          height: 'auto'
        }}
        uiText={{
          value: props.value,
          fontSize: props.fontSize,
          color: props.fontColor ?? Color4.White(),
          textAlign: 'middle-center'
        }}
      />

      {/* DELETE ICON */}
      {props.isRemovable && (
        <ButtonIcon
          onMouseDown={() => {
            props.deleteChip()
          }}
          uiTransform={{
            width: props.fontSize,
            height: props.fontSize,
            margin: { right: props.fontSize / 3 }
          }}
          backgroundColor={{ ...Color4.Black(), a: 0.7 }}
          icon={{
            atlasName: 'icons',
            spriteName: 'CloseIcon'
          }}
        />
      )}
    </UiEntity>
  )
}

export default ButtonChip

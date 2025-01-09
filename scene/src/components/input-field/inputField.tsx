import ReactEcs, {
  Input,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { ALMOST_WHITE } from '../../utils/constants'
import { type AtlasIcon } from '../../utils/definitions'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { type Color4 } from '@dcl/sdk/math'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

function InputField(props: {
  // Events
  onValueUpdate: (arg: string) => void
  // Shape
  uiTransform?: UiTransformProps
  backgroundColor?: Color4
  // Text
  title: string
  value: string
  placeholder: string
  fontSize: number
  savedValue: string
  isEditing: boolean
  icon?: AtlasIcon
  fontColor?: Color4
  iconColor?: Color4
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  return (
    <UiEntity
      uiTransform={{
        display:
          props.isEditing || props.savedValue.length > 0 ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        ...props.uiTransform
      }}
    >
      {/* TITLE AND ICON */}
      <UiEntity
        uiTransform={{
          display: props.title.length === 0 ? 'none' : 'flex',
          width: '100%',
          height: 'auto',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          margin: { bottom: props.fontSize * 0.3 }
        }}
      >
        {/* ICON */}
        {props.icon !== undefined ?? (
          <UiEntity
            uiTransform={{
              width: props.fontSize * 1.2,
              height: props.fontSize * 1.2,
              margin: { right: -props.fontSize * 0.5 }
            }}
            uiBackground={{
              ...getBackgroundFromAtlas(props.icon),
              color: ALMOST_WHITE
            }}
          />
        )}

        {/* Title */}
        <UiEntity
          uiTransform={{
            width: 'auto',
            height: props.fontSize
          }}
          uiText={{
            value: props.title,
            fontSize: props.fontSize,
            color: props.fontColor ?? ALMOST_WHITE
          }}
        />
      </UiEntity>

      {/* VALUE */}
      <UiEntity
        uiTransform={{
          display: !props.isEditing ? 'flex' : 'none',
          width: 'auto',

          height: props.fontSize * 1.25
        }}
        uiText={{
          value: props.savedValue,
          fontSize: props.fontSize,
          color: props.fontColor ?? ALMOST_WHITE,
          textWrap: 'wrap'
        }}
      />

      {/* Input */}
      <Input
        uiTransform={{
          display: props.isEditing ? 'flex' : 'none',
          width: '100%',
          height: props.fontSize * 2.2,
          padding: props.fontSize * 0.3,
          justifyContent: 'space-between',
          alignItems: 'center',
          ...props.uiTransform
        }}
        uiBackground={{
          color: ALMOST_WHITE,
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
        onChange={($) => {
          props.onValueUpdate($)
        }}
        placeholder={props.placeholder}
        value={props.value}
        fontSize={props.fontSize}
      />
    </UiEntity>
  )
}

export default InputField

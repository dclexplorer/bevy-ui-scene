import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import {
  ALMOST_WHITE,
  ALMOST_BLACK,
  ORANGE,
  ROUNDED_TEXTURE_BACKGROUND
} from '../../utils/constants'
import { type AtlasIcon } from '../../utils/definitions'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'

function DropdownField(props: {
  isOpen: boolean
  // Events
  onMouseDown: Callback
  onOptionMouseDown: (arg: number) => void
  // Shape
  uiTransform?: UiTransformProps
  backgroundColor?: Color4
  // Text
  title: string
  icon: AtlasIcon
  fontSize: number
  fontColor?: Color4
  iconColor?: Color4
  selectedOption: number
  savedOption: number
  options: string[]
  isEditing: boolean
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  return (
    <UiEntity
      uiTransform={{
        display: props.isEditing || props.savedOption !== 0 ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        ...props.uiTransform
      }}
    >
      {/* TITLE AND ICON */}
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          margin: { bottom: props.fontSize * 0.3 }
        }}
      >
        {/* ICON */}
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
          value: props.options[props.savedOption],
          fontSize: props.fontSize,
          color: props.fontColor ?? ALMOST_WHITE
        }}
      />

      {/* DROPDOWN */}
      <UiEntity
        uiTransform={{
          display: props.isEditing ? 'flex' : 'none',
          width: '100%',
          padding: { right: props.fontSize * 0.3 },
          justifyContent: 'space-between',
          alignItems: 'center',
          ...props.uiTransform
        }}
        uiBackground={{
          ...ROUNDED_TEXTURE_BACKGROUND,
          color: ALMOST_WHITE
        }}
        onMouseDown={props.onMouseDown}
      >
        {/* TEXT */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: props.fontSize * 2.2
          }}
          uiText={{
            value: props.options[props.selectedOption],
            fontSize: props.fontSize,
            color: props.fontColor ?? ALMOST_BLACK,
            textAlign: 'middle-left'
          }}
        />

        {/* ICON */}
        <UiEntity
          uiTransform={{
            width: props.fontSize,
            height: props.fontSize
          }}
          uiBackground={{
            ...getBackgroundFromAtlas({
              atlasName: 'icons',
              spriteName: 'DownArrow'
            }),
            color: Color4.Black()
          }}
        />
        {/* <UiEntity
          uiTransform={{
            display: props.isOpen ? 'flex' : 'none',
            width: canvasInfo.width * 3,
            height: canvasInfo.height * 3,
            positionType: 'absolute',
            position: { left:  -1.5*canvasInfo.width, top: -1.5*canvasInfo.height },
            zIndex: 1,
          }}
          uiBackground={{
            color: ALMOST_BLACK
          }}
          onMouseDown={props.onMouseDown}
        /> */}
        <UiEntity
          uiTransform={{
            display: props.isOpen ? 'flex' : 'none',
            width: '100%',
            height:
              props.options.length >= 6
                ? props.fontSize * 1.5 * 6
                : props.fontSize * props.options.length * 1.5,

            positionType: 'absolute',
            position: { left: 0, top: 2.5 * props.fontSize },
            zIndex: 1
          }}
          uiBackground={{
            ...ROUNDED_TEXTURE_BACKGROUND,
            color: ALMOST_WHITE
          }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              overflow: 'scroll',
              scrollVisible: 'hidden'
            }}
          >
            <UiEntity
              uiTransform={{
                width: '95%',
                height: '95%',
                flexDirection: 'column',
                margin: '2.5%'
              }}
            >
              {props.options.map((option, index) => (
                <UiEntity
                  uiTransform={{
                    width: '95%',
                    height: 'auto',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseDown={() => {
                    props.onOptionMouseDown(index)
                  }}
                >
                  <UiEntity
                    uiTransform={{
                      width: 'auto',
                      height: props.fontSize * 2
                    }}
                    uiText={{
                      value: option,
                      fontSize: props.fontSize,
                      color: ALMOST_BLACK,
                      textAlign: 'middle-left'
                    }}
                  />

                  <UiEntity
                    uiTransform={{
                      display: props.selectedOption === index ? 'flex' : 'none',
                      width: props.fontSize,
                      height: props.fontSize
                    }}
                    uiBackground={{
                      ...getBackgroundFromAtlas({
                        atlasName: 'icons',
                        spriteName: 'Check'
                      }),
                      color: ORANGE
                    }}
                  />
                </UiEntity>
              ))}
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default DropdownField

import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type Callback,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  CLICKED_PRIMARY_COLOR,
  ORANGE
} from '../utils/constants'
import { getBackgroundFromAtlas } from '../utils/ui-utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

function styledDropdown(props: {
  isOpen: boolean
  // Events
  onMouseDown: Callback
  onOptionMouseDown: (index: number, title: string) => void
  onOptionMouseEnter: (index: number) => void
  onOptionMouseLeave: () => void
  // Shape
  uiTransform?: UiTransformProps
  backgroundColor?: Color4
  // Text
  title: string
  fontSize: number
  fontColor?: Color4
  value: number
  entered: number
  options: string[]
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  return (
    <UiEntity
      uiTransform={{
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

      {/* DROPDOWN */}
      <UiEntity
        uiTransform={{
          width: '100%',
          padding: { right: props.fontSize * 0.3 },
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
        onMouseDown={props.onMouseDown}
      >
        {/* TEXT */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: props.fontSize * 2.2
          }}
          uiText={{
            value: props.options[props.value],
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

        <UiEntity
          uiTransform={{
            display: props.isOpen ? 'flex' : 'none',
            width: '100%',
            height:
              props.options.length >= 4
                ? props.fontSize * 2.1 * 4
                : props.fontSize * props.options.length * 2.1,

            positionType: 'absolute',
            position: { left: 0, top: 2.5 * props.fontSize },
            zIndex: 2
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
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              overflow: 'scroll'
              // scrollVisible: 'hidden'
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
                    width: '100%',
                    height: 'auto',
                    flexDirection: 'column'
                  }}
                >
                  <UiEntity
                    uiTransform={{
                      width: '100%',
                      height: props.fontSize * 0.1,
                      display: index > 0 ? 'flex' : 'none'
                    }}
                  />
                  <UiEntity
                    uiTransform={{
                      width: '95%',
                      height: props.fontSize * 1.2,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: { top: props.fontSize * 0.3 }
                    }}
                    uiBackground={{
                      color:
                        index === props.entered
                          ? { ...CLICKED_PRIMARY_COLOR, a: 0.5 }
                          : ALMOST_WHITE
                    }}
                    onMouseDown={() => {
                      props.onOptionMouseDown(index, props.title)
                    }}
                    onMouseEnter={() => {
                      props.onOptionMouseEnter(index)
                    }}
                    onMouseLeave={() => {
                      props.onOptionMouseLeave()
                    }}
                  >
                    <UiEntity
                      uiTransform={{
                        width: 'auto',
                        height: '100%'
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
                        display: props.value === index ? 'flex' : 'none',
                        width: props.fontSize,
                        height: props.fontSize,
                        margin: { right: props.fontSize * 0.3 }
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
                  <UiEntity
                    uiTransform={{
                      width: '100%',
                      height: props.fontSize * 0.1
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

export default styledDropdown
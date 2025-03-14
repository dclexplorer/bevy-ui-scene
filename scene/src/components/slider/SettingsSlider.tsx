import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, {
  type Callback,
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { ALMOST_WHITE, RUBY } from '../../utils/constants'
import { Vector2 } from '@dcl/sdk/math'

function SettingsSlider(props: {
  uiTransform: UiTransformProps
  sliderSize: number
  title: string
  fontSize: number
  value: string
  id: string
  position: number
  onMouseEnter?: Callback
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  const grabberSize: Vector2 = Vector2.create(
    2 * props.fontSize * 0.63,
    2 * props.fontSize
  )

  return (
    <UiEntity
      key={props.uiTransform.elementId ?? `${props.id}-parent`}
      uiTransform={{
        ...props.uiTransform,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: props.sliderSize / 2,
        height: props.uiTransform.height,
        margin: { top: props.fontSize, bottom: props.fontSize }
        // new properties
        // scrollPosition: this.target, // if you want to set the scroll position programatically (maybe an action from the user)
        // elementId: this.scrollContainerId // id to identify the scroll result if you need to
      }}
      onMouseEnter={props.onMouseEnter}
      uiBackground={
        {
          // color: { ...Color4.White(), a: 0.1 }
        }
      }
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: 'auto',
          justifyContent: 'space-between',
          flexDirection: 'row'
        }}
      >
        <Label value={props.title} fontSize={props.fontSize} />
        <Label value={props.value} fontSize={props.fontSize} />
      </UiEntity>
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: props.uiTransform.width,
          height: props.fontSize * 2,
          // new properties
          overflow: 'scroll',
          scrollVisible: 'hidden',
          elementId: props.id,
          scrollPosition: Vector2.create(props.position, 0)
        }}
        key={props.id}
      >
        <UiEntity
          uiTransform={{
            width: props.sliderSize,
            height: grabberSize.y,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 1
          }}
        >
          <UiEntity
            uiTransform={{
              width: props.sliderSize,
              height: '80%'
            }}
            uiBackground={{ color: RUBY }}
          />
          <UiEntity
            uiTransform={{
              width: props.sliderSize,
              height: '80%'
            }}
            uiBackground={{ color: { ...ALMOST_WHITE, a: 0.5 } }}
          />
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { left: props.sliderSize / 2 - grabberSize.x / 2 },
              width: grabberSize.x,
              height: grabberSize.y,
              zIndex: 4
            }}
            key="first"
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'assets/images/menu/slider.png' }
            }}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}

export default SettingsSlider

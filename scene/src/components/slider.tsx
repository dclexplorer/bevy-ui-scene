import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, {
  Label,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { ALMOST_WHITE, RUBY } from '../utils/constants'
import { Vector2 } from '@dcl/sdk/math'

function Slider(props: {
  uiTransform: UiTransformProps
  sliderSize: number
  title: string
  fontSize: number
  value: string
  id: string
  position: number
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: props.sliderSize / 2,
        height: '100%'
        // new properties
        // scrollPosition: this.target, // if you want to set the scroll position programatically (maybe an action from the user)
        // elementId: this.scrollContainerId // id to identify the scroll result if you need to
      }}
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
          height: props.uiTransform.height,
          // new properties
          overflow: 'scroll',
          scrollVisible: 'hidden',
          elementId: props.id,
          scrollPosition: Vector2.create(props.position, 0)
        }}
      >
        <UiEntity
          uiTransform={{
            width: props.sliderSize,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 1
          }}
        >
          <UiEntity
            uiTransform={{
              width: props.sliderSize,
              height: '80%',
              pointerFilter: 'none'
            }}
            uiBackground={{ color: RUBY }}
          />
          <UiEntity
            uiTransform={{
              width: props.sliderSize,
              height: '80%',
              pointerFilter: 'none'
            }}
            uiBackground={{ color: { ...ALMOST_WHITE, a: 0.5 } }}
          />
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { left: props.sliderSize / 2 - 15 },
              width: 30,
              height: '100%'
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

export default Slider

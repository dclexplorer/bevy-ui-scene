import { ReactEcs, ReactElement, UiEntity } from '@dcl/react-ecs'
import useEffect = ReactEcs.useEffect
import { SystemHoverAction, SystemHoverEvent } from '../../bevy-api/interface'
import { engine, executeTask, PrimaryPointerInfo } from '@dcl/sdk/ecs'
import { BevyApi } from '../../bevy-api'
import { getViewportHeight } from '../../service/canvas-ratio'
import { Color4 } from '@dcl/sdk/math'
import useState = ReactEcs.useState
import { COLOR } from '../color-palette'
import { Column, Row } from '../layout'
import Icon from '../icon/Icon'
import { PositionUnit } from '@dcl/sdk/react-ecs'

export const HoverActionComponent = (): ReactElement | null => {
  const [hoverActions, setHoverActions] = useState<SystemHoverAction[]>([])
  useEffect(() => {
    executeTask(async () => {
      listenStream(await BevyApi.getHoverStream()).catch(console.error)
    })

    async function listenStream(stream: SystemHoverEvent[]): Promise<void> {
      for await (const systemHoverEvent of stream) {
        console.log('systemHoverEvent', systemHoverEvent)
        if (systemHoverEvent.entered) {
          const _actions = systemHoverEvent.actions.slice(0, 7)
          console.log('_actions', _actions.length)
          setHoverActions(_actions)
        } else {
          setHoverActions([])
        }
      }
    }
  }, [])
  const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
  if (!hoverActions?.length) return null
  return (
    <Column
      uiTransform={{
        width: getViewportHeight() * 0.3,
        positionType: 'absolute',
        position: {
          top: pointerInfo.screenCoordinates?.y,
          left: pointerInfo.screenCoordinates?.x
        }
      }}
    >
      {hoverActions.map((hoverAction, index) => (
        <RenderHoverAction hoverActions={hoverActions} index={index} />
      ))}
    </Column>
  )
}

function RenderHoverAction({
  hoverActions,
  index
}: {
  hoverActions: SystemHoverAction[]
  index: number
}): ReactElement {
  const hoverAction = hoverActions[index]

  if (!hoverAction) return <UiEntity></UiEntity>
  return (
    <UiEntity
      uiTransform={{
        height: getViewportHeight() * 0.05,
        padding: getViewportHeight() * 0.01,
        margin: getViewportHeight() * 0.01,
        borderRadius: getViewportHeight() * 0.01,
        borderWidth: 0,
        borderColor: COLOR.BLACK_TRANSPARENT,
        positionType: 'absolute',
        position: {
          top: hoverTipDisplacements[index].y,
          left: hoverTipDisplacements[index].x
        }
      }}
      uiBackground={{ color: COLOR.BLACK }}
    >
      <KeyIcon inputBinding={hoverAction.inputBinding} />
      <UiEntity
        uiTransform={{ width: '100%' }}
        uiText={{
          value: `${hoverAction.action} - ${hoverAction.hoverText} - ${hoverAction.inputBinding}`
        }}
      />
    </UiEntity>
  )
}

const hoverTipDisplacements: { x: PositionUnit; y: PositionUnit }[] = [
  { x: '50%', y: 0 },
  { x: 0, y: -10 },
  { x: 0, y: -10 },
  { x: 0, y: -10 },
  { x: '-150%', y: -10 },
  { x: 0, y: -10 },
  { x: 0, y: -10 }
]

function KeyIcon({ inputBinding }: { inputBinding: string }): ReactElement {
  const isKey = inputBinding.indexOf('Key') === 0
  const isDigit = inputBinding.indexOf('Digit') === 0
  const isMouse = inputBinding.indexOf('Mouse') === 0
  const fontSize = getViewportHeight() * 0.02
  const KeyBorder = {
    width: fontSize * 2,
    height: fontSize * 2,
    borderColor: COLOR.WHITE,
    borderWidth: 2,
    borderRadius: fontSize * 0.6,
    flexShrink: 0,
    flexGrow: 0,
    padding: { top: -fontSize * 0.1 }
  }
  if (isDigit)
    return (
      <UiEntity
        uiTransform={{ ...KeyBorder }}
        uiText={{
          value: `<b>${inputBinding.replace('Digit', '')}</b>`,
          fontSize
        }}
      ></UiEntity>
    )

  if (isMouse)
    return (
      <Icon
        uiTransform={{ flexShrink: 0, flexGrow: 0 }}
        icon={{ spriteName: 'MouseLeftClick', atlasName: 'icons' }}
        iconSize={fontSize * 1.5}
        iconColor={COLOR.WHITE}
      />
    )

  return (
    <UiEntity
      uiTransform={{ ...KeyBorder }}
      uiText={{ value: `<b>${inputBinding.replace('Key', '')}</b>`, fontSize }}
    ></UiEntity>
  )
}

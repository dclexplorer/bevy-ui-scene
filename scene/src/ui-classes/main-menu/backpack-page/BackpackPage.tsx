import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

export default class BackpackPage {
  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%'
        }}
        uiText={{
          value: 'Backpack',
          textAlign: 'middle-center',
          fontSize: 50
        }}
      ></UiEntity>
    )
  }
}

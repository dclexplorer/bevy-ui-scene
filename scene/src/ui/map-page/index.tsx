import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'

export class MapPage {
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
          value: 'Map',
          textAlign: 'middle-center',
          fontSize: 50
        }}
      ></UiEntity>
    )
  }
}

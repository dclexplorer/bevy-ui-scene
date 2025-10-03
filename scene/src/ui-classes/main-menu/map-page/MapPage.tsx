import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import useEffect = ReactEcs.useEffect

import {
  activateMapCamera,
  closeBigMapIfActive
} from '../../../service/map/map-camera'
import { MapFilterBar } from '../../../components/map/map-filter-bar'

export default class MapPage {
  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    return <MapPageContent />
  }
}

function MapPageContent(): ReactElement {
  useEffect(() => {
    activateMapCamera()
    return () => {
      closeBigMapIfActive()
    }
  }, [])
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        positionType: 'absolute',
        position: { top: 0 }
      }}
    >
      <MapFilterBar />
    </UiEntity>
  )
}

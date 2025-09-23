import { getPlacesAroundParcel, Place } from '../../../service/map-places'
import { store } from '../../../state/store'
import { FOV, PlaceRepresentation } from './big-map-view'
import { ReactEcs, ReactElement, UiEntity } from '@dcl/react-ecs'
import useState = ReactEcs.useState
import useEffect = ReactEcs.useEffect
import { engine, PrimaryPointerInfo, Transform } from '@dcl/sdk/ecs'
import { getBigMapCameraEntity } from '../../../service/map/map-camera'
import { Vector3 } from '@dcl/sdk/math'
import { screenToGround } from '../../../service/perspective-to-screen'
import {
  getViewportHeight,
  getViewportWidth
} from '../../../service/canvas-ratio'
import { getVector3Parcel } from '../../../service/player-scenes'
import { COLOR } from '../../../components/color-palette'
import {
  currentRealmProviderIsWorld,
  getRealmName
} from '../../../service/realm-change'

export function MapStatusBar(): ReactElement {
  const [coordsStr, setCoordsStr] = useState<string>('-,-')
  useEffect(() => {
    try {
      const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
      const mapCameraTransform = Transform.get(getBigMapCameraEntity())
      const targetPosition: Vector3 = screenToGround(
        pointerInfo!.screenCoordinates!.x, // TODO REVIEW + getRightPanelWidth() / 2, to move camera more centered
        pointerInfo!.screenCoordinates!.y,
        getViewportWidth(),
        getViewportHeight(),
        mapCameraTransform.position,
        mapCameraTransform.rotation,
        FOV
      ) as Vector3

      const { x, y } = getVector3Parcel(targetPosition)
      const place = getPlacesAroundParcel({ x, y }, 0)
      const parcelName = place[0]?.title ?? ''
      const worldStr = currentRealmProviderIsWorld()
        ? getRealmName()
        : 'Genesis City'
      setCoordsStr(`${x},${y} ${parcelName} ${worldStr}`)
    } catch (error) {}
  })

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { bottom: 0 }
      }}
      uiText={{
        value: coordsStr,
        color: COLOR.WHITE,
        fontSize: getViewportHeight() * 0.02
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_5
      }}
    />
  )
}

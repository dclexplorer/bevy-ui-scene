import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import useEffect = ReactEcs.useEffect
import { engine, Transform } from '@dcl/sdk/ecs'
import { Quaternion } from '@dcl/sdk/math'
import {
  getCanvasScaleRatio,
  getViewportHeight
} from '../../service/canvas-ratio'
import { rotateUVs } from '../../utils/ui-utils'
import { getHudFontSize } from '../../ui-classes/main-hud/scene-info/SceneInfo'
import { COLOR } from '../color-palette'
import {
  getLoadedMapPlaces,
  getPlacesAroundParcel,
  loadCompleteMapPlaces,
  type Place
} from '../../service/map-places'
import { getPlayerParcel } from '../../service/player-scenes'
import useState = ReactEcs.useState

import { getMapInfoCamera, getMinimapCamera } from './mini-map-camera'
import { renderVisiblePlaces } from './mini-map-info-entities'
import { getMapSize } from './mini-map-size'
import { getCardinalLabelPositions } from './mini-map-cardinals'

export function MiniMapContent(): ReactElement {
  const mapSize = getMapSize()
  const [parcelsAroundIds, setParcelsAroundIds] = useState<string>('')
  const [parcelsAround, setParcelsAround] = useState<Place[]>([])

  useEffect(() => {
    // TODO review if it makes sense to execute with less FPS to avoid calculations
    try {
      if (getMinimapCamera() === engine.RootEntity) return
      const playerGlobalTransform = Transform.get(engine.PlayerEntity)
      const minimapCameraTransform = Transform.getMutable(getMinimapCamera())

      const mutableCameraPosition = minimapCameraTransform.position
      const mutableInfoCameraTransform = Transform.getMutable(
        getMapInfoCamera()
      )
      const mutableInfoCameraPosition = mutableInfoCameraTransform.position
      mutableCameraPosition.x = mutableInfoCameraPosition.x =
        playerGlobalTransform.position.x
      mutableCameraPosition.z = mutableInfoCameraPosition.z =
        playerGlobalTransform.position.z

      const cameraRotation = Quaternion.toEulerAngles(
        Transform.get(engine.CameraEntity).rotation
      )

      Object.assign(
        minimapCameraTransform.rotation,
        Quaternion.fromEulerDegrees(90, cameraRotation.y, 0)
      )
      Object.assign(
        mutableInfoCameraTransform.rotation,
        Quaternion.fromEulerDegrees(90, cameraRotation.y, 0)
      )
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    loadCompleteMapPlaces().catch(console.error)
  }, [])

  useEffect(() => {
    renderVisiblePlaces(parcelsAround)
  }, [parcelsAroundIds])

  useEffect(() => {
    const playerParcel = getPlayerParcel()
    const placesAroundPlayerParcel = getPlacesAroundParcel(playerParcel, 10)
    setParcelsAroundIds(
      placesAroundPlayerParcel.map((p) => p.base_position).join(',')
    )

    setParcelsAround(placesAroundPlayerParcel)
  }, [getPlayerParcel(), getLoadedMapPlaces()])

  return (
    <UiEntity
      uiTransform={{
        width: mapSize,
        height: mapSize,
        flexShrink: 0,
        flexGrow: 0
      }}
      uiBackground={{
        textureMode: 'stretch',
        videoTexture: {
          videoPlayerEntity: getMinimapCamera()
        }
      }}
    >
      <UiEntity
        uiTransform={{
          width: mapSize,
          height: mapSize,
          flexShrink: 0,
          flexGrow: 0,
          positionType: 'absolute',
          position: { top: 0, left: 0 }
        }}
        uiBackground={{
          textureMode: 'stretch',
          videoTexture: {
            videoPlayerEntity: getMapInfoCamera()
          }
        }}
      />
      <PlayerArrow mapSize={mapSize} />
      {CardinalLabels()}
    </UiEntity>
  )
}

function CardinalLabels(): ReactElement {
  const labelPositions = getCardinalLabelPositions(
    getMapSize(),
    -Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation).y,
    0
  )
  const fontSize = getHudFontSize(getViewportHeight()).NORMAL
  return (
    <UiEntity
      uiText={{
        value: 'N',
        fontSize,
        textAlign: 'middle-center',
        outlineColor: COLOR.TEXT_COLOR,
        outlineWidth: fontSize / 10
      }}
      uiTransform={{
        positionType: 'absolute',
        position: {
          top: labelPositions.N.y - fontSize,
          left: labelPositions.N.x - fontSize
        },
        borderRadius: 99,
        borderWidth: 0,

        borderColor: COLOR.BLACK_TRANSPARENT
      }}
      uiBackground={{
        color: COLOR.BLACK
      }}
    />
  )
}
function PlayerArrow({ mapSize = 1000 }: { mapSize: number }): ReactElement {
  const ARROW_SIZE = getCanvasScaleRatio() * 50

  return (
    <UiEntity
      uiTransform={{
        width: ARROW_SIZE,
        height: ARROW_SIZE,
        positionType: 'absolute',
        position: {
          top: mapSize / 2 - ARROW_SIZE / 2,
          left: mapSize / 2 - ARROW_SIZE / 2
        }
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: rotateUVs(
          Quaternion.toEulerAngles(Transform.get(engine.PlayerEntity).rotation)
            .y -
            Quaternion.toEulerAngles(
              Transform.get(engine.CameraEntity).rotation
            ).y
        ),
        texture: {
          src: 'assets/images/MapArrow.png'
        }
      }}
    />
  )
}

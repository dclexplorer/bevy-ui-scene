import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { getViewportHeight, getViewportWidth } from '../../service/canvas-ratio'
import { COLOR } from '../color-palette'
import Icon from '../icon/Icon'
import { getHudFontSize } from '../../ui-classes/main-hud/scene-info/SceneInfo'
import { Column } from '../layout'
import { displaceCamera } from '../../service/map-camera'
import { Vector3 } from '@dcl/sdk/math'
import { screenToGround } from '../../service/perspective-to-screen'
import {
  decoratePlaceRepresentation,
  FOV
} from '../../ui-classes/main-hud/big-map/big-map-view'
import { engine, Transform } from '@dcl/sdk/ecs'
import { getPlayerPosition } from '@dcl-sdk/utils'
import { getPlayerParcel } from '../../service/player-scenes'
import { Label } from '@dcl/sdk/react-ecs'
import { store } from '../../state/store'

export function MapBottomLeftBar(): ReactElement {
  return (
    <Column
      uiTransform={{
        positionType: 'absolute',
        position: {
          bottom: getViewportHeight() * 0.05,
          left: 0
        },
        padding: { bottom: '0.5%' }
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_5
      }}
    >
      {store.getState().hud.homePlace && (
        <Column
          uiTransform={{
            borderRadius: getHudFontSize(getViewportHeight()).SMALL,
            borderColor: COLOR.WHITE,
            borderWidth: 0,
            width: getHudFontSize(getViewportHeight()).BIG * 2,
            height: getHudFontSize(getViewportHeight()).BIG * 2,
            alignItems: 'center',
            justifyContent: 'center',
            margin: getHudFontSize(getViewportHeight()).SMALL
          }}
          uiBackground={{
            color: COLOR.WHITE
          }}
          onMouseDown={() => {
            const homePlaceRepresentation = decoratePlaceRepresentation(
              store.getState().hud.homePlace
            )
            displaceCamera(homePlaceRepresentation!.centralParcelCoords)
          }}
        >
          <Icon
            uiTransform={{
              flexShrink: 0
            }}
            icon={{ spriteName: 'HomeSolid', atlasName: 'map2' }}
            iconSize={getHudFontSize(getViewportHeight()).BIG * 1.5}
            iconColor={COLOR.TEXT_COLOR}
          />
        </Column>
      )}

      <Column
        uiTransform={{
          borderRadius: getHudFontSize(getViewportHeight()).SMALL,
          borderColor: COLOR.WHITE,
          borderWidth: 0,
          width: getHudFontSize(getViewportHeight()).BIG * 2,
          height: getHudFontSize(getViewportHeight()).BIG * 2,
          alignItems: 'center',
          justifyContent: 'center',
          margin: getHudFontSize(getViewportHeight()).SMALL
        }}
        uiBackground={{
          color: COLOR.WHITE
        }}
        onMouseDown={() => {
          const playerPosition = Transform.get(engine.PlayerEntity).position

          displaceCamera(Vector3.create(playerPosition.x, 0, playerPosition.z))
        }}
      >
        <Icon
          uiTransform={{
            flexShrink: 0
          }}
          icon={{ spriteName: 'CenterPlayerIcn', atlasName: 'map2' }}
          iconSize={getHudFontSize(getViewportHeight()).BIG * 1.5}
          iconColor={COLOR.TEXT_COLOR}
        />
      </Column>
      <UiEntity
        uiTransform={{
          width: '100%',
          positionType: 'absolute',
          position: { bottom: -getHudFontSize(getViewportHeight()).SMALL * 0.1 }
        }}
        uiText={{
          value: `${getPlayerParcel().x},${getPlayerParcel().y}`,
          color: COLOR.WHITE,
          textWrap: 'nowrap',
          fontSize: getHudFontSize(getViewportHeight()).SMALL * 1.2
        }}
      />
    </Column>
  )
}

import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  getCanvasScaleRatio,
  getViewportHeight
} from '../../../service/canvas-ratio'
import { COLOR } from '../../../components/color-palette'
import { MapStatusBar } from './map-status-bar'
import Icon from '../../../components/icon/Icon'

export function MapFooter(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: {
          bottom: 0,
          left: 0
        },
        width: '100%',
        height: getViewportHeight() * 0.04,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_5
      }}
    >
      <MapStatusBar />
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <Icon
          icon={{ atlasName: 'icons', spriteName: 'LeftClick' }}
          iconSize={canvasScaleRatio * 26}
          uiTransform={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            position: { top: canvasScaleRatio * 13 }
          }}
        />
        <UiEntity
          uiText={{
            value: 'Double click to displace map to target',
            fontSize: canvasScaleRatio * 26
          }}
          uiTransform={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            position: { top: 0 }
          }}
        />
      </UiEntity>
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <Icon
          icon={{ atlasName: 'icons', spriteName: 'LeftClick' }}
          iconSize={canvasScaleRatio * 26}
          uiTransform={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            position: { top: canvasScaleRatio * 13 }
          }}
        />
        <UiEntity
          uiText={{
            value: 'Drag to displace map',
            fontSize: canvasScaleRatio * 26
          }}
          uiTransform={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            position: { top: 0 }
          }}
        />
      </UiEntity>
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <Icon
          icon={{ atlasName: 'icons', spriteName: 'Scroll' }}
          iconSize={canvasScaleRatio * 26}
          uiTransform={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            position: { top: canvasScaleRatio * 13 }
          }}
        />
        <UiEntity
          uiText={{
            value: 'Mouse wheel to zoom in/out',
            fontSize: canvasScaleRatio * 26
          }}
          uiTransform={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            position: { top: 0 }
          }}
        />
      </UiEntity>
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <Icon
          icon={{ atlasName: 'icons', spriteName: 'UpArrow' }}
          iconSize={canvasScaleRatio * 26}
          uiTransform={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            position: { top: canvasScaleRatio * 13 }
          }}
        />
        <UiEntity
          uiText={{
            value: 'Shift + Mouse move to rotate view',
            fontSize: canvasScaleRatio * 26
          }}
          uiTransform={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            position: { top: 0 }
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

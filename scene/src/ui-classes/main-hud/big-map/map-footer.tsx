import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  getCanvasScaleRatio,
  getRightPanelWidth,
  getViewportHeight,
  getViewportWidth
} from '../../../service/canvas-ratio'
import { COLOR } from '../../../components/color-palette'
import { MapStatusBar } from './map-status-bar'
import Icon from '../../../components/icon/Icon'
import { getHudFontSize } from '../scene-info/SceneInfo'
import { Row } from '../../../components/layout'

export function MapFooter(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const fontSize = getHudFontSize(getViewportWidth()).SMALL * 0.9
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: {
          bottom: 0,
          left: 0
        },
        width: getViewportWidth() - getRightPanelWidth(),
        height: getViewportHeight() * 0.04,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'flex-start'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_5
      }}
    >
      <MapStatusBar
        uiTransform={{
          width: '20%',
          position: { bottom: fontSize * 0.3 }
        }}
        fontSize={fontSize * 0.9}
      />
      <Row>
        <Row>
          <Icon
            icon={{ atlasName: 'icons', spriteName: 'LeftClick' }}
            iconSize={fontSize}
          />
          <UiEntity
            uiText={{
              value: 'Double click displaces to target',
              fontSize
            }}
            uiTransform={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              position: { top: 0 }
            }}
          />
        </Row>
        <Row>
          <Icon
            icon={{ atlasName: 'icons', spriteName: 'LeftClick' }}
            iconSize={fontSize}
          />
          <UiEntity
            uiText={{
              value: 'Drag to displace map',
              fontSize
            }}
            uiTransform={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              position: { top: 0 }
            }}
          />
        </Row>
        <Row>
          <Icon
            icon={{ atlasName: 'icons', spriteName: 'Scroll' }}
            iconSize={fontSize}
          />
          <UiEntity
            uiText={{
              value: 'Mouse wheel to zoom in/out',
              fontSize
            }}
            uiTransform={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              position: { top: 0 }
            }}
          />
        </Row>
        <Row>
          <Icon
            icon={{ atlasName: 'icons', spriteName: 'UpArrow' }}
            iconSize={fontSize}
          />
          <UiEntity
            uiText={{
              value: 'Shift + Mouse move rotates view',
              fontSize
            }}
            uiTransform={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              position: { top: 0 }
            }}
          />
        </Row>
      </Row>
    </UiEntity>
  )
}

import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import type {
  WearableEntity,
  RarityName
} from '../../utils/wearables-definitions'
import Icon from '../icon/Icon'
import { Label } from '@dcl/sdk/react-ecs'

import { RARITY_COLORS } from '../color-palette'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../utils/constants'

export type InfoPanelProps = {
  canvasScaleRatio: number
  wearable: WearableEntity | null
}

export function InfoPanel({
  canvasScaleRatio,
  wearable
}: InfoPanelProps): ReactElement {
  const rarityColor = RARITY_COLORS[wearable?.rarity as RarityName]
  return (
    <UiEntity
      uiTransform={{
        margin: { left: 40 * canvasScaleRatio },
        width: 600 * canvasScaleRatio,
        height: 1400 * canvasScaleRatio,
        flexDirection: 'column'
      }}
      uiBackground={{
        ...getBackgroundFromAtlas({
          atlasName: 'info-panel',
          spriteName:
            wearable === null
              ? 'empty'
              : wearable?.rarity !== undefined
              ? wearable.rarity
              : 'base'
        })
      }}
    >
      {wearable !== null ? (
        <UiEntity
          uiTransform={{ alignSelf: 'center', flexDirection: 'column' }}
        >
          <UiEntity
            uiTransform={{
              width: canvasScaleRatio * 400,
              height: canvasScaleRatio * 400,
              alignSelf: 'center',
              margin: { top: 80 * canvasScaleRatio }
            }}
            uiBackground={{
              texture: {
                src: `https://peer.decentraland.org/lambdas/collections/contents/${wearable?.id}/thumbnail`
              },
              textureMode: 'stretch'
            }}
          />
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              margin: { top: 80 * canvasScaleRatio },
              maxWidth: canvasScaleRatio * 500,
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              justifyContent: 'flex-start'
            }}
          >
            <Icon
              uiTransform={{
                alignSelf: 'flex-start',
                justifyContent: 'flex-start',
                flexShrink: 0,
                margin: { top: 20 * canvasScaleRatio },
                width: canvasScaleRatio * 40,
                height: canvasScaleRatio * 40
              }}
              icon={{
                spriteName: wearable?.data.category,
                atlasName: 'backpack'
              }}
              iconSize={35 * canvasScaleRatio}
            />
            <UiEntity
              uiTransform={{
                alignSelf: 'flex-start'
              }}
              uiText={{
                value: `<b>${wearable?.name}</b>`,
                fontSize: 35 * canvasScaleRatio,
                textWrap: 'wrap',
                textAlign: 'top-left'
              }}
            />
          </UiEntity>
          {/* rarity tag // TODO create component <Tag /> */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              flexShrink: 0,
              flexGrow: 0,
              flexBasis: 0
            }}
          >
            <UiEntity
              uiTransform={{
                padding: {
                  left: 6 * canvasScaleRatio,
                  right: 6 * canvasScaleRatio
                }
              }}
              uiBackground={{
                ...ROUNDED_TEXTURE_BACKGROUND,
                color: rarityColor
              }}
            >
              <Label
                value={wearable?.rarity?.toUpperCase() ?? ''}
                fontSize={26 * canvasScaleRatio}
              />
            </UiEntity>
          </UiEntity>
          {wearable?.description !== '' ? (
            <Label
              value={`<b>DESCRIPTION</b>`}
              fontSize={26 * canvasScaleRatio}
              uiTransform={{
                alignSelf: 'flex-start',
                margin: { top: 10 * canvasScaleRatio }
              }}
            />
          ) : null}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              width: canvasScaleRatio * (600 - 80)
            }}
          >
            <UiEntity
              uiText={{
                value: `${wearable?.description}`,
                textAlign: 'top-left',
                fontSize: 26 * canvasScaleRatio
              }}
            />
          </UiEntity>
        </UiEntity>
      ) : null}
    </UiEntity>
  )
}

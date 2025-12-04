import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { getContentScaleRatio } from '../../../service/canvas-ratio'
import { COLOR, RARITY_COLORS } from '../../../components/color-palette'
import { store } from '../../../state/store'
import { pushPopupAction } from '../../../state/hud/actions'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'
import {
  getBackgroundFromAtlas,
  truncateWithoutBreakingWords
} from '../../../utils/ui-utils'
import { Tag } from '../../../components/color-tag'
import {
  EmoteEntityMetadata,
  type RarityName,
  WearableEntityMetadata
} from '../../../utils/item-definitions'

export function PassportEquippedItem({
  thumbnailSize,
  itemData
}: {
  thumbnailSize: number
  itemData: WearableEntityMetadata | EmoteEntityMetadata
}) {
  const canvasScaleRatio = getContentScaleRatio()
  const tokenId = Number(
    itemData.id.split(':').reduce((acc, current) => current, '')
  )
  const rarityColor = RARITY_COLORS[itemData?.rarity as RarityName]

  return (
    <UiEntity
      uiTransform={{
        width: thumbnailSize,
        height: thumbnailSize * 1.4,
        borderRadius: getContentScaleRatio() * 20,

        borderColor: COLOR.TEXT_COLOR_WHITE,
        borderWidth: 0,
        margin: canvasScaleRatio * 14,
        flexDirection: 'column'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_7
      }}
      onMouseDown={() => {
        console.log('onMouseDown', tokenId)
        if (!isNaN(tokenId)) {
          store.dispatch(
            pushPopupAction({
              type: HUD_POPUP_TYPE.MARKETPLACE,
              data: `https://decentraland.org/marketplace/contracts/${itemData.collectionAddress}/items/${tokenId}`
            })
          )
        } else {
          console.log('ELSE')
          //TODO
        }
      }}
    >
      <UiEntity
        uiTransform={{
          flexGrow: 0,
          flexShrink: 0,
          width: thumbnailSize,
          height: thumbnailSize,
          overflow: 'hidden'
        }}
        uiBackground={getBackgroundFromAtlas({
          spriteName: `rarity-background-${itemData?.rarity ?? 'base'}`,
          atlasName: 'backpack'
        })}
      >
        <UiEntity
          uiTransform={{
            flexGrow: 0,
            flexShrink: 0,
            width: thumbnailSize * 0.95,
            height: thumbnailSize * 0.95,
            overflow: 'hidden',
            positionType: 'absolute'
          }}
          uiBackground={{
            texture: {
              src: itemData.thumbnail
            },
            textureMode: 'stretch'
          }}
        />
      </UiEntity>
      <UiEntity
        uiTransform={{
          alignSelf: 'flex-start',
          overflow: 'hidden',
          maxWidth: '100%',
          margin: { top: canvasScaleRatio * -20 }
        }}
        uiText={{
          value: truncateWithoutBreakingWords(
            itemData?.name ?? itemData.i18n[0].text ?? '',
            13
          ),
          fontSize: canvasScaleRatio * 32,
          textWrap: 'nowrap'
        }}
      />
      <Tag
        uiTransform={{
          margin: {
            left: canvasScaleRatio * 10,
            top: canvasScaleRatio * -10
          }
        }}
        text={`<b>${itemData?.rarity?.toUpperCase() ?? ''}</b>`}
        backgroundColor={{ ...rarityColor, a: 0.2 }}
        textColor={rarityColor}
        canvasScaleRatio={canvasScaleRatio * 0.8}
      />
    </UiEntity>
  )
}

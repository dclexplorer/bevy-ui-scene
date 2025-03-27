import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { type offchainEmoteURN } from '../../../utils/definitions'
import { DEFAULT_EMOTES, getEmoteName } from '../../../service/emotes'
import { Color4 } from '@dcl/sdk/math'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'

export function EmotesCatalog(): ReactElement {
  return (
    <UiEntity>
      <EquippedEmoteList
        equippedEmotes={DEFAULT_EMOTES}
        onSelectSlot={(slot): void => {}}
      />
    </UiEntity>
  )
}
type offchainEmoteURNOrNull = offchainEmoteURN | null

function EquippedEmoteList({
  equippedEmotes,
  onSelectSlot
}: {
  equippedEmotes: offchainEmoteURNOrNull[]
  onSelectSlot: (index: number) => void
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity uiTransform={{ flexDirection: 'column' }}>
      {equippedEmotes.map((equippedEmoteURN, index) => {
        const circle = (index + 1).toString()
        const circleStr = circle[circle.length - 1]

        return (
          <UiEntity
            uiTransform={{
              height: canvasScaleRatio * 120,
              width: canvasScaleRatio * 440,
              margin: canvasScaleRatio * 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <UiEntity
              uiTransform={{
                height: canvasScaleRatio * 100,
                width: canvasScaleRatio * 100,
                flexShrink: 0,
                flexGrow: 0
              }}
              uiBackground={getBackgroundFromAtlas({
                atlasName: 'backpack',
                spriteName: `emote-circle-${circleStr}`
              })}
            />
            {equippedEmoteURN && (
              <UiEntity
                uiText={{
                  value: getEmoteName(equippedEmoteURN),
                  fontSize: canvasScaleRatio * 30
                }}
              />
            )}
            <UiEntity
              uiTransform={{
                height: canvasScaleRatio * 100,
                width: canvasScaleRatio * 100,
                positionType: 'absolute',
                position: { right: canvasScaleRatio * 20 }
              }}
              uiBackground={getBackgroundFromAtlas({
                atlasName: 'backpack',
                spriteName: `rarity-background-base`
              })}
            >
              <UiEntity
                uiTransform={{ height: '100%', width: '100%' }}
                uiBackground={getBackgroundFromAtlas({
                  atlasName: 'emotes',
                  spriteName: equippedEmoteURN as string
                })}
              />
            </UiEntity>
          </UiEntity>
        )
      })}
    </UiEntity>
  )
}

import { timers } from '@dcl-sdk/utils'
import { BevyApi } from '../bevy-api'
import { type SystemAction } from '../bevy-api/interface'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { Color4, Vector2 } from '@dcl/sdk/math'
import { Canvas } from '../components/canvas'
import { getCanvasScaleRatio } from '../service/canvas-ratio'
import { store } from '../state/store'
import { getBackgroundFromAtlas } from '../utils/ui-utils'
import { COLOR, RARITY_COLORS } from '../components/color-palette'
import emoteAtlas from '../../assets/images/atlas/emotes.json'
import { wheelNumbers, wheelSlotBoxes } from './wheel-boxes'
import { getPlayer } from '@dcl/sdk/src/players'
import { getURNWithoutTokenId } from '../utils/urn-utils'
import {
  type EquippedEmote,
  type offchainEmoteURN,
  type URN,
  type URNWithoutTokenId
} from '../utils/definitions'
import { getEmoteThumbnail } from '../service/emotes'
import { catalystMetadataMap } from '../utils/catalyst-metadata-map'
import { fetchEmotesData } from '../utils/emotes-promise-utils'
import { type EmoteEntityMetadata } from '../utils/item-definitions'
import { DEFAULT_EMOTE_NAMES } from '../utils/backpack-constants'

const state: any = {
  visible: false
}
export async function initEmotesWheel(): Promise<void> {
  const equippedEmotes: EquippedEmote[] = (getPlayer()?.emotes ?? []).map(
    (e) => getURNWithoutTokenId(e as URN) as EquippedEmote
  )
  await fetchEmotesData(...equippedEmotes)
  listen().catch(console.error)

  async function listen(): Promise<void> {
    const stream: SystemAction[] = await BevyApi.getSystemActionStream()

    timers.setTimeout(() => {
      awaitStream(stream).catch(console.error)
    }, 0)
  }
}
export function showEmotesWheel(): void {
  state.visible = true
  // TODO add number listeners here
}

export function hideEmotesWheel(): void {
  state.visible = false
  // TODO remove number listeners here
}

async function awaitStream(stream: SystemAction[]): Promise<void> {
  for await (const actionInfo of stream) {
    console.log('Received:', actionInfo)
    if (actionInfo.action === 'Emote' && actionInfo.pressed) {
      if (isEmotesWheelAvailable()) {
        state.visible = !state.visible
      }
    }
  }
  function isEmotesWheelAvailable(): boolean {
    return true // TODO store.getState().backpack.isShown ?
  }
}
export function renderEmotesWheel(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const equippedEmotes: EquippedEmote[] = (getPlayer()?.emotes ?? []).map(
    (e) => getURNWithoutTokenId(e as URN) as EquippedEmote
  )

  return (
    state.visible && (
      <Canvas
        uiTransform={{
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <UiEntity
          uiTransform={{
            width: canvasScaleRatio * 1000,
            height: canvasScaleRatio * 1000
          }}
          uiBackground={getBackgroundFromAtlas({
            spriteName: 'wheel-background',
            atlasName: 'emotes'
          })}
        >
          {equippedEmotes.map((equippedEmote, index) => {
            const visualSlotInfo = getSlotInfo(index)
            const equippedEmoteData: EmoteEntityMetadata = catalystMetadataMap[
              equippedEmote as URNWithoutTokenId
            ] as EmoteEntityMetadata

            const emoteName =
              equippedEmoteData?.name ??
              DEFAULT_EMOTE_NAMES[equippedEmote as offchainEmoteURN] ??
              ''
            return (
              <UiEntity
                uiTransform={{
                  width: visualSlotInfo.width,
                  height: visualSlotInfo.height,
                  positionType: 'absolute',
                  flexShrink: 0,
                  position: {
                    top: visualSlotInfo.y,
                    left: visualSlotInfo.x
                  },
                  flexGrow: 0
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas({
                    spriteName: visualSlotInfo.spriteName,
                    atlasName: 'emotes'
                  }),
                  color: RARITY_COLORS[equippedEmoteData?.rarity ?? 'empty']
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: '55%',
                    height: '55%',
                    flexGrow: 0,
                    flexShrink: 0,
                    positionType: 'absolute',
                    margin: '27.5%',
                    alignSelf: 'center'
                  }}
                  uiBackground={getEmoteThumbnail(equippedEmote)}
                ></UiEntity>
              </UiEntity>
            )
          })}
          <EmoteNumbers />
        </UiEntity>
      </Canvas>
    )
  )
}

function EmoteNumbers(): ReactElement {
  return (
    <UiEntity>
      {new Array(10).fill(null).map((_: null, index: number) => {
        const [left, top] = wheelNumbers[index].map(
          (n) => n * getCanvasScaleRatio() * 2.1
        )

        return (
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: {
                top: top - getCanvasScaleRatio() * 30,
                left: left - getCanvasScaleRatio() * 20
              }
            }}
            uiText={{
              value: `<b>${(index + 1).toString().slice(-1, 2)}</b>`,
              color: COLOR.TEXT_COLOR,
              fontSize: getCanvasScaleRatio() * 35,
              textAlign: 'middle-center'
            }}
          />
        )
      })}
    </UiEntity>
  )
}

function getSlotInfo(index: number): any {
  const canvasScaleRatio = getCanvasScaleRatio()
  const spriteName: string = `wheel-slot-${index}`

  const slotBox = wheelSlotBoxes[index]
  const [x, y, width, height] = slotBox.map((i) => canvasScaleRatio * i * 2.1)
  return {
    spriteName,
    x,
    y,
    width,
    height
  }
}

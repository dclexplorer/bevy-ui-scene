import { timers } from '@dcl-sdk/utils'
import { BevyApi } from '../bevy-api'
import { type SystemAction } from '../bevy-api/interface'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { Canvas } from '../components/canvas'
import { getCanvasScaleRatio } from '../service/canvas-ratio'
import { getBackgroundFromAtlas } from '../utils/ui-utils'
import { COLOR, RARITY_COLORS } from '../components/color-palette'
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
import { triggerEmote } from '~system/RestrictedActions'
import {
  engine,
  InputAction,
  inputSystem,
  PointerEventType
} from '@dcl/sdk/ecs'
import { BACKPACK_SECTION } from '../state/backpack/state'
import { store } from '../state/store'
import { changeSectionAction } from '../state/backpack/actions'
import { CloseButton } from '../components/close-button'

const state: any = {
  visible: false,
  hoveredURN: '',
  hoveredIndex: null
}
export async function initEmotesWheel({
  showBackpackMenu
}: {
  showBackpackMenu: () => void
}): Promise<void> {
  const equippedEmotes: EquippedEmote[] = (getPlayer()?.emotes ?? []).map(
    (e) => getURNWithoutTokenId(e as URN) as EquippedEmote
  )
  await fetchEmotesData(...equippedEmotes)
  listen().catch(console.error)

  engine.addSystem(() => {
    const cmd = inputSystem.getInputCommand(
      InputAction.IA_ANY,
      PointerEventType.PET_DOWN,
      engine.RootEntity
    )

    if (cmd) {
      if (cmd?.button === InputAction.IA_PRIMARY && state.visible) {
        showBackpackMenu()
        store.dispatch(changeSectionAction(BACKPACK_SECTION.EMOTES))
      }
    }
  })

  async function listen(): Promise<void> {
    const stream: SystemAction[] = await BevyApi.getSystemActionStream()

    timers.setTimeout(() => {
      awaitStream(stream).catch(console.error)
    }, 0)
  }
}

export function switchEmotesWheelVisibility(): void {
  state.visible = !state.visible
}

async function awaitStream(stream: SystemAction[]): Promise<void> {
  for await (const actionInfo of stream) {
    if (actionInfo.action === 'Emote' && actionInfo.pressed) {
      switchEmotesWheelVisibility()
    }
  }
}
export function renderEmotesWheel(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const equippedEmotes: EquippedEmote[] = (getPlayer()?.emotes ?? []).map(
    (e) => getURNWithoutTokenId(e as URN) as EquippedEmote
  )
  const hoveredEmoteData: EmoteEntityMetadata | null = state.hoveredURN
    ? (catalystMetadataMap[
        state.hoveredURN as URNWithoutTokenId
      ] as EmoteEntityMetadata)
    : null
  const hoveredName: string = state.hoveredURN
    ? hoveredEmoteData?.name ??
      DEFAULT_EMOTE_NAMES[state.hoveredURN as offchainEmoteURN] ??
      ''
    : ''

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
            positionType: 'absolute',
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
            const hoverFactor = state.hoveredIndex === index ? 1.5 : 0.9
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
                  color: {
                    ...(equippedEmoteData?.rarity === 'base'
                      ? Color4.White()
                      : RARITY_COLORS[equippedEmoteData?.rarity] ??
                        Color4.White()),
                    a: hoverFactor
                  }
                }}
                onMouseEnter={() => {
                  state.hoveredURN = equippedEmote
                  state.hoveredIndex = index
                }}
                onMouseLeave={() => {
                  if (
                    !(
                      state.hoveredIndex !== null &&
                      state.hoveredIndex !== index
                    )
                  ) {
                    state.hoveredURN = null
                    state.hoveredIndex = null
                  }
                }}
                onMouseDown={() => {
                  triggerEmote({ predefinedEmote: equippedEmote }).catch(
                    console.error
                  )
                  state.visible = false
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
                  uiBackground={
                    equippedEmote
                      ? getEmoteThumbnail(equippedEmote)
                      : getBackgroundFromAtlas({
                          spriteName: 'empty-icon',
                          atlasName: 'backpack'
                        })
                  }
                ></UiEntity>
              </UiEntity>
            )
          })}
          <EmoteNumbers />
          <CloseButton
            uiTransform={{
              position: {
                top: '5%',
                right: '5%'
              }
            }}
            onClick={() => (state.visible = false)}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            alignSelf: 'center'
          }}
          uiText={{
            value: `${hoveredName}
<b>EMOTES</b>
Customize <b>[E]</b>
Press <b>[Alt + num]</b> to run emote`,
            color: Color4.White(),
            textAlign: 'middle-center',
            fontSize: canvasScaleRatio * 30,
            textWrap: 'wrap'
          }}
        />
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
              },
              zIndex: 1
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

import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import {
  BORDER_RADIUS_F,
  getBackgroundFromAtlas
} from '../../../utils/ui-utils'
import { store } from '../../../state/store'
import { type OutfitDefinition } from '../../../utils/outfit-definitions'

import { Color4 } from '@dcl/sdk/math'
import { getSlotAvatar } from '../../../components/backpack/OutfitAvatar'
import { RoundedButton } from '../../../components/rounded-button'
import {
  updateAvatarBase,
  updateEquippedWearables
} from '../../../state/backpack/actions'
import { SKIN_COLOR_PRESETS } from '../../../components/color-palette'
import { type URNWithoutTokenId } from '../../../utils/definitions'
import { getURNWithoutTokenId } from '../../../utils/urn-utils'
import { catalystMetadataMap } from '../../../utils/catalyst-metadata-map'
import { fetchWearablesData } from '../../../utils/wearables-promise-utils'
import { getRealm } from '~system/Runtime'
import { updateAvatarPreview } from '../../../components/backpack/AvatarPreview'

const SLOTS: any[] = new Array(10).fill(null)
const state: { hoveredIndex: number; selectedIndex: number } = {
  hoveredIndex: -1,
  selectedIndex: -1
}
export const OutfitsCatalog = (): ReactElement => {
  const canvasScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack
  const outfitsMetadata = backpackState.outfitsMetadata
  const viewSlots: Array<OutfitDefinition | null> = [...SLOTS]
  outfitsMetadata.outfits.forEach((outfitMetadata) => {
    viewSlots[outfitMetadata.slot] = outfitMetadata.outfit
  })

  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 2145,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}
    >
      {viewSlots.map((viewSlot, index: number) => {
        return (
          <UiEntity
            uiTransform={{
              width: canvasScaleRatio * 320,
              height: canvasScaleRatio * 560,
              flexShrink: 0,
              margin: { left: '2%', bottom: '4%', right: '2%' },
              borderRadius: BORDER_RADIUS_F
            }}
          >
            {state.selectedIndex === index && (
              <UiEntity
                uiTransform={{
                  width: canvasScaleRatio * 360,
                  height: canvasScaleRatio * 655,
                  positionType: 'absolute',
                  position: { left: '-4%', top: '-3%' }
                }}
                uiBackground={getBackgroundFromAtlas({
                  atlasName: 'backpack',
                  spriteName: 'outfit-slot-highlight'
                })}
              >
                <RoundedButton
                  uiTransform={{
                    margin: { left: '5%', bottom: '3%' },
                    width: '90%',
                    height: 60 * canvasScaleRatio,
                    alignSelf: 'flex-end'
                  }}
                  fontSize={26 * canvasScaleRatio}
                  text={'EQUIP'}
                  isSecondary={false}
                  onClick={() => {
                    ;(async () => {
                      console.log('EQUIP')
                      store.dispatch(
                        updateAvatarBase({
                          skinColor: viewSlot?.skin.color ?? undefined,
                          hairColor: viewSlot?.hair.color ?? undefined,
                          eyesColor: viewSlot?.eyes.color ?? undefined,
                          bodyShapeUrn:
                            viewSlot?.bodyShape as URNWithoutTokenId,
                          name: ''
                        })
                      )

                      const wearables = viewSlot?.wearables.map((i) =>
                        getURNWithoutTokenId(i)
                      ) as URNWithoutTokenId[]
                      await fetchWearablesData(
                        (await getRealm({}))?.realmInfo?.baseUrl ??
                          'https://peer.decentraland.org'
                      )(...(wearables ?? []))
                      store.dispatch(
                        updateEquippedWearables({
                          wearables,
                          wearablesData: catalystMetadataMap
                        })
                      )
                      updateAvatarPreview(
                        store.getState().backpack.equippedWearables,
                        store.getState().backpack.outfitSetup.base,
                        store.getState().backpack.forceRender
                      )
                    })().catch(console.error)
                  }}
                />
              </UiEntity>
            )}
            <UiEntity
              uiTransform={{
                width: canvasScaleRatio * 320,
                height: canvasScaleRatio * 560,
                flexShrink: 0,
                margin: { left: '2%', bottom: '4%', right: '2%' },
                borderRadius: BORDER_RADIUS_F
              }}
              uiBackground={{
                ...getBackgroundFromAtlas({
                  atlasName: 'backpack',
                  spriteName: 'outfit-slot-background'
                })
              }}
              onMouseEnter={() => {
                state.hoveredIndex = index
              }}
              onMouseLeave={() => {
                if (
                  !(state.hoveredIndex >= 0 && state.hoveredIndex !== index)
                ) {
                  state.hoveredIndex = -1
                }
              }}
              onMouseDown={() => {
                console.log('SELECTED', index)
                if (!isEmptySlot(viewSlot)) {
                  state.selectedIndex = index
                }
              }}
            >
              {isEmptySlot(viewSlot) ? (
                <UiEntity
                  uiTransform={{
                    positionType: 'absolute',
                    width: '80%',
                    height: '80%',
                    alignSelf: 'center',
                    position: { left: '10%' },
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  uiBackground={{
                    ...getBackgroundFromAtlas({
                      atlasName: 'backpack',
                      spriteName: 'outfit-slot-silhouette'
                    }),
                    color: Color4.create(0, 0, 0, 1)
                  }}
                  uiText={{
                    value:
                      state.hoveredIndex === index
                        ? `\n\nSAVE OUTFIT`
                        : `<b>Empty</b>\nSLOT`,
                    fontSize: canvasScaleRatio * 32
                  }}
                >
                  {state.hoveredIndex === index && (
                    <UiEntity
                      uiTransform={{
                        width: canvasScaleRatio * 88,
                        height: canvasScaleRatio * 88,
                        positionType: 'absolute',
                        alignSelf: 'center',

                        position: { top: '30%' }
                      }}
                      uiBackground={getBackgroundFromAtlas({
                        atlasName: 'backpack',
                        spriteName: 'add-icon'
                      })}
                      uiText={{ value: '' }}
                    ></UiEntity>
                  )}
                </UiEntity>
              ) : (
                <UiEntity
                  uiTransform={{
                    positionType: 'absolute',
                    width: '100%',
                    height: '100%',
                    alignSelf: 'center',
                    position: { left: '0%' },
                    zIndex: 9,
                    pointerFilter: 'none'
                  }}
                  uiBackground={{
                    videoTexture: {
                      videoPlayerEntity: getSlotAvatar(index)?.cameraEntity
                    }
                  }}
                />
              )}
            </UiEntity>
          </UiEntity>
        )
      })}
    </UiEntity>
  )
}

function isEmptySlot(viewSlot: OutfitDefinition | null): boolean {
  if (viewSlot === null) return true
  return !viewSlot?.bodyShape
}

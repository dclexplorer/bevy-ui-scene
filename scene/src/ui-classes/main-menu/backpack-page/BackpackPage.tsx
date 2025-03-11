import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { NavButton } from '../../../components/nav-button/NavButton'
import {
  getCanvasScaleRatio,
  getContentHeight,
  getContentWidth
} from '../../../service/canvas-ratio'
import { type WearableCategory } from '../../../service/wearable-categories'
import { WearableCategoryList } from '../../../components/backpack/WearableCategoryList'
import {
  catalystWearableMap,
  fetchWearablesData
} from '../../../utils/wearables-promise-utils'
import { getPlayer } from '@dcl/sdk/src/players'
import type { URN, URNWithoutTokenId } from '../../../utils/definitions'
import { BevyApi } from '../../../bevy-api'
import {
  createAvatarPreview,
  setAvatarPreviewCameraToWearableCategory
} from '../../../components/backpack/AvatarPreview'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../../utils/constants'
import {
  BASE_MALE_URN,
  getURNWithoutTokenId,
  getWearablesWithTokenId
} from '../../../utils/urn-utils'
import { store } from '../../../state/store'
import {
  updateActiveWearableCategory,
  updateAvatarBase,
  updateCacheKey,
  updateEquippedWearables,
  updateLoadingPage
} from '../../../state/backpack/actions'
import { AvatarPreviewElement } from '../../../components/backpack/AvatarPreviewElement'
import { updatePage, WearablesCatalog } from './WearableCatalog'
import { InfoPanel } from '../../../components/backpack/InfoPanel'

export default class BackpackPage {
  public fontSize: number = 16 * getCanvasScaleRatio() * 2

  render(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    const canvasScaleRatio = getCanvasScaleRatio()
    const backpackState = store.getState().backpack

    return (
      <MainContent>
        <BackpackNavBar canvasScaleRatio={canvasScaleRatio} />
        <Content>
          <AvatarPreviewElement />
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
              margin: 40 * canvasScaleRatio,
              padding: {
                top: 80 * canvasScaleRatio
              },
              pointerFilter: 'block'
            }}
            uiBackground={{
              ...ROUNDED_TEXTURE_BACKGROUND,
              color: { ...Color4.Black(), a: 0.35 }
            }}
          >
            {/* CATEGORY SELECTORS COLUMN */}
            <WearableCategoryList
              outfitSetup={backpackState.outfitSetup}
              activeCategory={backpackState.activeWearableCategory}
              onSelectCategory={(category: WearableCategory | null): void => {
                if (!backpackState.loadingPage) this.changeCategory(category)
              }}
            />
            {/* CATALOG COLUMN */}
            <WearablesCatalog />
            {/* SELECTED ITEM COLUMN */}
            <InfoPanel
              uiTransform={{
                position: {
                  top: -50 * canvasScaleRatio,
                  left: -20 * canvasScaleRatio
                }
              }}
              canvasScaleRatio={canvasScaleRatio}
              wearable={
                backpackState.selectedURN === null
                  ? null
                  : catalystWearableMap[backpackState.selectedURN]
              }
            />
          </UiEntity>
        </Content>
      </MainContent>
    )
  }

  changeCategory(category: WearableCategory | null): void {
    store.dispatch(updateActiveWearableCategory(category))
    setAvatarPreviewCameraToWearableCategory(category)

    updatePage().catch(console.error)
  }

  async saveAvatar(): Promise<void> {
    try {
      const backpackState = store.getState().backpack

      if (
        [...backpackState.equippedWearables].sort(sortAbc).join(',') !==
        [...(getPlayer()?.wearables ?? [])].sort(sortAbc).join(',')
      ) {
        await BevyApi.setAvatar({
          base: backpackState.outfitSetup.base,
          equip: {
            wearableUrns: getWearablesWithTokenId(
              backpackState.equippedWearables
            ),
            emoteUrns: [] // TODO implements emotes
          }
        })
      }
    } catch (error) {
      console.log('setAvatar error', error)
    }

    function sortAbc(a: string, b: string): number {
      return a.localeCompare(b)
    }
  }

  async init(): Promise<void> {
    store.dispatch(updateCacheKey())

    createAvatarPreview()
    store.dispatch(updateLoadingPage(true))
    const player = getPlayer()
    const wearables: URNWithoutTokenId[] = (getPlayer()?.wearables ?? []).map(
      (urn) => getURNWithoutTokenId(urn as URN)
    ) as URNWithoutTokenId[]
    store.dispatch(
      updateEquippedWearables({
        wearables,
        wearablesData: await fetchWearablesData(...(wearables ?? []))
      })
    )
    store.dispatch(
      updateAvatarBase({
        name: player?.name ?? '',
        eyesColor: player?.avatar?.eyesColor,
        hairColor: player?.avatar?.hairColor,
        skinColor: player?.avatar?.skinColor,
        bodyShapeUrn:
          (player?.avatar?.bodyShapeUrn as URNWithoutTokenId) ?? BASE_MALE_URN
      })
    )

    await updatePage()
  }
}

function MainContent({ children }: any): ReactElement {
  return (
    <UiEntity
      onMouseEnter={() => {}}
      uiTransform={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        pointerFilter: 'block'
      }}
      uiBackground={{
        texture: { src: 'assets/images/menu/background.png' },
        textureMode: 'stretch'
      }}
    >
      {children}
    </UiEntity>
  )
}

function NavBar({ children, canvasScaleRatio }: any): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        width: '100%',
        height: 120 * canvasScaleRatio,
        pointerFilter: 'block'
      }}
      uiBackground={{
        color: { ...Color4.Black(), a: 0.4 }
      }}
    >
      {children}
    </UiEntity>
  )
}

function LeftSection({ children }: any): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        height: '100%',
        flexDirection: 'row',
        padding: 0,
        alignItems: 'flex-start',
        alignSelf: 'flex-start'
      }}
    >
      {children}
    </UiEntity>
  )
}

function NavBarTitle({
  text,
  canvasScaleRatio
}: {
  text: string
  canvasScaleRatio: number
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        padding: 0,
        margin: { top: -8, left: 4 }
      }}
      uiText={{
        value: text,
        fontSize: 64 * canvasScaleRatio
      }}
    />
  )
}

function NavButtonBar({ children }: any): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: { left: 10 * getCanvasScaleRatio() * 2 }
      }}
      uiBackground={{
        color: { ...Color4.Blue(), a: 0.0 }
      }}
    >
      {children}
    </UiEntity>
  )
}

function Content({ children }: any): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: getContentWidth(),
        height: getContentHeight(),
        pointerFilter: 'block'
      }}
    >
      {children}
    </UiEntity>
  )
}

function BackpackNavBar({
  canvasScaleRatio
}: {
  canvasScaleRatio: number
}): ReactElement {
  return (
    <NavBar canvasScaleRatio={canvasScaleRatio}>
      {/* LEFT SECTION */}
      <LeftSection>
        <NavBarTitle
          text={'<b>Backpack</b>'}
          canvasScaleRatio={canvasScaleRatio}
        />
        {/* NAV-BUTTON-BAR */}
        <NavButtonBar>
          <NavButton
            icon={{
              spriteName: 'Wearables',
              atlasName: 'icons'
            }}
            active={true}
            text={'Wearables'}
          />
          <NavButton
            icon={{
              spriteName: 'Emotes',
              atlasName: 'icons'
            }}
            text={'Emotes'}
            uiTransform={{ margin: { left: 12 } }}
          />
        </NavButtonBar>
      </LeftSection>
    </NavBar>
  )
}

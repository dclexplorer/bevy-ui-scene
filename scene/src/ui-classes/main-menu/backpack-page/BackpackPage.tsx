import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { NavButton } from '../../../components/nav-button/NavButton'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { type WearableCategory } from '../../../service/wearable-categories'
import { WearableCategoryList } from '../../../components/backpack/WearableCategoryList'

type BackpackPageState = {
  activeWearableCategory: WearableCategory | null
}

export default class BackpackPage {
  public fontSize: number = 16 * getCanvasScaleRatio() * 2
  private readonly state: BackpackPageState = {
    activeWearableCategory: null
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    const canvasScaleRatio = getCanvasScaleRatio()

    return (
      <UiEntity
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
        {/* NAVBAR */}
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
          {/* LEFT SECTION */}
          <UiEntity
            uiTransform={{
              height: '100%',
              flexDirection: 'row',
              padding: 0,
              alignItems: 'flex-start',
              alignSelf: 'flex-start'
            }}
            uiBackground={{
              color: { ...Color4.Green(), a: 0.0 }
            }}
          >
            <UiEntity
              uiTransform={{
                padding: 0,
                margin: { top: -8, left: 4 }
              }}
              uiText={{
                value: '<b>Backpack</b>',
                fontSize: 64 * canvasScaleRatio
              }}
            ></UiEntity>
            {/* NAV-BUTTON-BAR */}
            <UiEntity
              uiTransform={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: { left: 10 * canvasScaleRatio * 2 }
              }}
              uiBackground={{
                color: { ...Color4.Blue(), a: 0.0 }
              }}
            >
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
            </UiEntity>
          </UiEntity>
          <UiEntity></UiEntity>
        </UiEntity>
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',

            width: '100%',
            height: 'auto',
            flexGrow: 1,
            pointerFilter: 'block'
          }}
        >
          {/* AVATAR */}
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              margin: {
                bottom: this.fontSize,
                right: this.fontSize
              },
              width: 580,
              height: '80%',
              padding: this.fontSize,
              minHeight: canvasInfo.height * 0.9 * 0.85 * 0.1,
              pointerFilter: 'block'
            }}
          ></UiEntity>

          {/* CONTENT */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
              margin: {
                bottom: this.fontSize,
                right: this.fontSize,
                top: this.fontSize
              },
              padding: this.fontSize,
              minHeight: canvasInfo.height * 0.9 * 0.85 * 0.1,
              pointerFilter: 'block'
            }}
            uiBackground={{
              color: { ...Color4.Black(), a: 0.35 },
              textureMode: 'nine-slices',
              texture: {
                src: 'assets/images/backgrounds/rounded.png'
              },
              textureSlices: {
                top: 0.5,
                bottom: 0.5,
                left: 0.5,
                right: 0.5
              }
            }}
          >
            {/* CATEGORY SELECTORS COLUMN */}
            <WearableCategoryList
              activeCategory={this.state.activeWearableCategory}
              onSelectCategory={(category: WearableCategory | null) =>
                (this.state.activeWearableCategory = category)
              }
            />
            {/* GRID COLLECTION COLUMN */}
            {/* SELECTED ITEM COLUMN */}
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}

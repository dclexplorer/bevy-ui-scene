import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { store } from '../../../state/store'
import { NavButton } from '../../../components/nav-button/NavButton'
import { BACKPACK_SECTION } from '../../../state/backpack/state'
import { ITEMS_CATALOG_PAGE_SIZE } from '../../../utils/backpack-constants'
import { getPlayer } from '@dcl/sdk/src/players'
import {
  SORT_OPTIONS,
  SORT_OPTIONS_PARAMS,
  ZERO_ADDRESS
} from '../../../utils/constants'
import {
  changeSectionAction,
  updateSearchFilterAction
} from '../../../state/backpack/actions'
import { updatePage } from './ItemCatalog'
import { fetchWearablesPage } from '../../../utils/wearables-promise-utils'
import { getRealm } from '~system/Runtime'
import {
  playPreviewEmote,
  setAvatarPreviewCameraToWearableCategory
} from '../../../components/backpack/AvatarPreview'
import { fetchEmotesPage } from '../../../utils/emotes-promise-utils'
import { WEARABLE_CATEGORY_DEFINITIONS } from '../../../service/categories'
import { Checkbox } from '../../../components/checkbox'
import { Input } from '@dcl/sdk/react-ecs'
import { COLOR } from '../../../components/color-palette'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { Color4 } from '@dcl/sdk/math'
import { throttle } from '../../../utils/dcl-utils'
import { cloneDeep } from '../../../utils/function-utils'
import { updatePageGeneric } from './backpack-service'
import { DropdownComponent } from '../../../components/dropdown-component'

const throttleSearch = throttle((name: string) => {
  const oldSearchFilter = cloneDeep(store.getState().backpack.searchFilter)

  const newSearchFilter = {
    ...oldSearchFilter,
    name
  }
  if (JSON.stringify(oldSearchFilter) !== JSON.stringify(newSearchFilter)) {
    store.dispatch(updateSearchFilterAction({ name }))
    updatePageGeneric().catch(console.error)
  }
}, 300)

export function BackpackNavBar({
  canvasScaleRatio
}: {
  canvasScaleRatio: number
}): ReactElement {
  const backpackState = store.getState().backpack
  return (
    <NavBar>
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
            active={backpackState.activeSection === BACKPACK_SECTION.WEARABLES}
            text={'Wearables'}
            onClick={() => {
              const backpackState = store.getState().backpack
              if (backpackState.loadingPage) return
              const pageParams = {
                pageNum: backpackState.currentPage,
                pageSize: ITEMS_CATALOG_PAGE_SIZE,
                address: getPlayer()?.userId ?? ZERO_ADDRESS,
                cacheKey: store.getState().backpack.cacheKey
              }
              store.dispatch(changeSectionAction(BACKPACK_SECTION.WEARABLES))
              updatePage(
                async () =>
                  await fetchWearablesPage(
                    (await getRealm({}))?.realmInfo?.baseUrl
                  )({
                    ...pageParams,
                    wearableCategory: backpackState.activeWearableCategory,
                    searchFilter: backpackState.searchFilter
                  })
              ).catch(console.error)
              setAvatarPreviewCameraToWearableCategory(
                backpackState.activeWearableCategory
              )
              playPreviewEmote('')
            }}
          />

          <NavButton
            icon={{
              spriteName: 'Emotes',
              atlasName: 'icons'
            }}
            active={backpackState.activeSection === BACKPACK_SECTION.EMOTES}
            text={'Emotes'}
            uiTransform={{ margin: { left: 12 } }}
            onClick={() => {
              const backpackState = store.getState().backpack
              if (backpackState.loadingPage) return
              store.dispatch(changeSectionAction(BACKPACK_SECTION.EMOTES))
              const pageParams = {
                pageNum: backpackState.currentPage,
                pageSize: ITEMS_CATALOG_PAGE_SIZE,
                address: getPlayer()?.userId ?? ZERO_ADDRESS,
                cacheKey: store.getState().backpack.cacheKey,
                searchFilter: backpackState.searchFilter
              }
              updatePage(async () => await fetchEmotesPage(pageParams)).catch(
                console.error
              )
              setAvatarPreviewCameraToWearableCategory(
                WEARABLE_CATEGORY_DEFINITIONS.body_shape.id
              )
            }}
          />
        </NavButtonBar>
      </LeftSection>
      <RightSection>
        <Checkbox
          uiTransform={{
            margin: { right: '1%' }
          }}
          onChange={() => {
            store.dispatch(
              updateSearchFilterAction({
                ...backpackState.searchFilter,
                collectiblesOnly: !backpackState.searchFilter.collectiblesOnly
              })
            )
            updatePageGeneric().catch(console.error)
          }}
          value={backpackState.searchFilter.collectiblesOnly}
          label={'Collectibles only'}
        />
        <Input
          uiTransform={{
            width: '25%',
            height: '70%',
            alignSelf: 'center',
            borderColor: COLOR.TEXT_COLOR,
            borderWidth: 1,
            borderRadius: getCanvasScaleRatio() * 30,
            padding: getCanvasScaleRatio() * 22
          }}
          uiBackground={{
            color: Color4.White()
          }}
          fontSize={canvasScaleRatio * 32}
          value={backpackState.searchFilter.name}
          placeholder={'Search by name ...'}
          onChange={(name) => {
            // TODO onChange is called continuously, figure out why and replace throttle with debounce
            throttleSearch(name)
          }}
        />
        <UiEntity
          uiTransform={{
            width: 'auto',
            flexShrink: 0,
            flexGrow: 0
          }}
        >
          <UiEntity
            uiTransform={{
              alignSelf: 'center',
              flexShrink: 0
            }}
            uiText={{
              value: 'Sort: ',
              fontSize: canvasScaleRatio * 32
            }}
          />
          <DropdownComponent
            dropdownId={'sort'}
            uiTransform={{
              position: { top: '-10%' },
              width: canvasScaleRatio * 280,
              alignSelf: 'flex-end'
            }}
            options={SORT_OPTIONS}
            value={
              SORT_OPTIONS[
                SORT_OPTIONS_PARAMS.findIndex(([orderBy, orderDirection]) => {
                  return (
                    orderBy ===
                      store.getState().backpack.searchFilter.orderBy &&
                    orderDirection ===
                      store.getState().backpack.searchFilter.orderDirection
                  )
                })
              ]
            }
            fontSize={canvasScaleRatio * 32}
            onChange={(value) => {
              const [orderBy, orderDirection] =
                SORT_OPTIONS_PARAMS[SORT_OPTIONS.indexOf(value)]
              store.dispatch(
                updateSearchFilterAction({ orderBy, orderDirection })
              )
              updatePageGeneric().catch(console.error)
            }}
          />
        </UiEntity>
      </RightSection>
    </NavBar>
  )
}

function NavBar({ children }: { children?: ReactElement }): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
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

function LeftSection({ children }: { children?: ReactElement }): ReactElement {
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

function RightSection({ children }: { children?: ReactElement }): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        height: '100%',
        flexDirection: 'row',
        padding: { right: '1%' },
        justifyContent: 'flex-end',
        flexGrow: 1
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

function NavButtonBar({ children }: { children?: ReactElement }): ReactElement {
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

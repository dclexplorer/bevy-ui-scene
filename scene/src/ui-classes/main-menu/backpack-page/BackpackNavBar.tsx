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
import { debounce } from '../../../utils/dcl-utils'
import { updatePageGeneric } from './backpack-service'
import { DropdownComponent } from '../../../components/dropdown-component'
import Icon from '../../../components/icon/Icon'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'

const debouncedSearch = debounce((name: string) => {
  updatePageGeneric().catch(console.error)
}, 600)

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
        <SearchBox />
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

const state: { searchHistory: string[]; showHistory: boolean } = {
  searchHistory: [],
  showHistory: false
}

function SearchBox(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack

  return (
    <UiEntity
      uiTransform={{
        width: '25%',
        height: '100%'
      }}
    >
      <Icon
        uiTransform={{
          alignSelf: 'center',
          position: { right: canvasScaleRatio * -66 },
          zIndex: 1
        }}
        icon={{ atlasName: 'backpack', spriteName: 'search-icon' }}
        iconSize={canvasScaleRatio * 42}
        iconColor={COLOR.TEXT_COLOR}
      />
      <Input
        uiTransform={{
          width: '100%',
          height: '60%',
          alignSelf: 'center',
          borderWidth: 0,
          borderRadius: canvasScaleRatio * BORDER_RADIUS_F,
          padding: {
            top: canvasScaleRatio * 22,
            left: canvasScaleRatio * 82,
            right: canvasScaleRatio * 22
          }
        }}
        uiBackground={{
          color: Color4.White()
        }}
        fontSize={canvasScaleRatio * 32}
        value={backpackState.searchFilter.name}
        placeholder={'Search by name ...'}
        onChange={(name) => {
          if (name !== backpackState.searchFilter.name) {
            store.dispatch(updateSearchFilterAction({ name }))
            debouncedSearch(name)
          }
        }}
      />

      {state.searchHistory.length && state.showHistory && (
        <UiEntity
          uiTransform={{
            width: '94%',
            positionType: 'absolute',
            position: { top: '90%', left: '6%' },
            zIndex: 2,
            flexDirection: 'column',
            borderRadius: 7,
            borderWidth: 1,
            borderColor: COLOR.TEXT_COLOR
          }}
          uiBackground={{
            color: Color4.White()
          }}
        >
          {state.searchHistory.map((item) => {
            return (
              <UiEntity
                uiTransform={{
                  width: '100%'
                }}
              >
                <UiEntity
                  uiTransform={{
                    padding: { left: '10%' }
                  }}
                  uiText={{
                    value: item,
                    color: COLOR.TEXT_COLOR,
                    textAlign: 'top-left',
                    fontSize: canvasScaleRatio * 32
                  }}
                />
                <Icon
                  icon={{ atlasName: 'backpack', spriteName: 'history-icon' }}
                  iconSize={canvasScaleRatio * 42}
                  uiTransform={{
                    alignSelf: 'center',
                    positionType: 'absolute',
                    position: { left: '5%' }
                  }}
                  iconColor={COLOR.TEXT_COLOR}
                />
              </UiEntity>
            )
          })}
        </UiEntity>
      )}
    </UiEntity>
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

import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { getUiController } from '../../controllers/ui.controller'
import { COLOR } from '../color-palette'
import useEffect = ReactEcs.useEffect
import { store } from '../../state/store'
import useState = ReactEcs.useState
import {
  fromParcelCoordsToPosition,
  fromStringToCoords,
  Place
} from '../../service/map-places'
import { executeTask } from '@dcl/sdk/ecs'
import { Column, Row } from '../layout'
import { ListCard } from './list-card'
import {
  getRightPanelWidth,
  getViewportHeight
} from '../../service/canvas-ratio'
import Icon from '../icon/Icon'
import { Vector3 } from '@dcl/sdk/math'
import { displaceCamera } from '../../service/map/map-camera'
import { updateHudStateAction } from '../../state/hud/actions'
import { Input, UiTransformProps } from '@dcl/sdk/react-ecs'
import { useDebouncedValue } from '../../hooks/use-debounce'
import { BevyApi } from '../../bevy-api'
import { SceneCatalogOrder } from '../../state/hud/state'
import { sleep, waitFor } from '../../utils/dcl-utils'
import { setUiFocus } from '~system/RestrictedActions'
import { truncateWithoutBreakingWords } from '../../utils/ui-utils'
import { getMainMenuHeight } from '../../ui-classes/main-menu/MainMenu'
import { getHudFontSize } from '../../ui-classes/main-hud/scene-info/SceneInfo'
import { currentRealmProviderIsWorld } from '../../service/realm-change'
import { MenuBar } from '../menu-bar'
import { PlaceRepresentation } from '../../ui-classes/main-hud/big-map/big-map-view'

const LIMIT = 20 // TODO maybe calculate how many fits in height? or not?
export type FetchParams = {
  searchText?: string
  categories?: string[]
  currentPage?: number
}
export const PLACE_TYPES: Array<'places' | 'worlds'> = ['places', 'worlds']
export const ORDER_OPTIONS: { orderKey: SceneCatalogOrder; label: string }[] = [
  { orderKey: 'most_active', label: `MOST ACTIVE` },
  { orderKey: 'like_score', label: `MOST LIKED` },
  { orderKey: 'updated_at', label: `MOST FRESH` }
]
export type PlaceListResponse = {
  total: number
  data: Place[]
}
const state = {
  expanded: true
}
let recreatingInputWorkaround = false
export function SceneCatalogPanel(): ReactElement[] {
  const width = getRightPanelWidth()
  if (!state.expanded) {
    return [
      <Expander
        uiTransform={{
          position: { top: '50%', right: -getViewportHeight() * 0.02 }
        }}
      />
    ]
  }
  return [
    <Expander />,
    <UiEntity
      uiTransform={{
        width,
        height: getViewportHeight() - getMainMenuHeight(),
        positionType: 'absolute',
        position: {
          right: 0,
          top: getMainMenuHeight()
        },
        pointerFilter: 'block'
      }}
      uiBackground={{
        color: COLOR.PANEL_BACKGROUND_LIGHT
      }}
    >
      <SceneCatalogContent />
    </UiEntity>
  ]
}
const PLACE_URL_PARAM_CATEGORY = 'categories'

function Expander({
  uiTransform
}: {
  uiTransform?: UiTransformProps
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: getViewportHeight() * 0.04,
        height: getViewportHeight() * 0.05,
        positionType: 'absolute',
        borderColor: COLOR.RED,
        borderRadius: getViewportHeight() * 0.01,
        borderWidth: 0,
        position: {
          top: '50%',
          right: getRightPanelWidth() - getViewportHeight() * 0.02
        },
        ...uiTransform
      }}
      onMouseDown={() => {
        state.expanded = !state.expanded
      }}
      uiBackground={{ color: COLOR.WHITE }}
    >
      <Icon
        uiTransform={{
          positionType: 'absolute',
          position: { top: getViewportHeight() * 0.015, left: '-5%' }
        }}
        iconSize={getViewportHeight() * 0.02}
        icon={{
          spriteName: state.expanded ? 'RightArrow' : 'LeftArrow',
          atlasName: 'icons'
        }}
        iconColor={COLOR.TEXT_COLOR}
      />
      <Icon
        uiTransform={{
          positionType: 'absolute',
          position: { top: getViewportHeight() * 0.015, left: '2%' }
        }}
        iconSize={getViewportHeight() * 0.02}
        icon={{
          spriteName: state.expanded ? 'RightArrow' : 'LeftArrow',
          atlasName: 'icons'
        }}
        iconColor={COLOR.TEXT_COLOR}
      />
    </UiEntity>
  )
}
function SceneCatalogContent(): ReactElement {
  const list = store.getState().hud.sceneList.data
  const [expanded, setExpanded] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebouncedValue(searchText, 300)
  const [loading, setLoading] = useState<boolean>(true)
  const [placeTypeActiveIndex, setPlaceTypeActiveIndex] = useState<number>(
    PLACE_TYPES.indexOf(store.getState().hud.placeType)
  )
  useEffect(() => {
    if (!getUiController().sceneInfoCardVisible) {
      store.dispatch(
        updateHudStateAction({
          placeListActiveItem: null
        })
      )
    }
  }, [])

  useEffect(() => {
    executeTask(async () => {
      setLoading(true)
      const listResponse = await fetchList({
        searchText: debouncedSearchText,
        currentPage
      })
      store.dispatch(
        updateHudStateAction({
          sceneList: listResponse
        })
      )
      setLoading(false)
    })
  }, [
    debouncedSearchText,
    store.getState().hud.mapFilterCategories,
    store.getState().hud.sceneCatalogOrder,
    store.getState().hud.placeType
  ])

  const fontSize = getViewportHeight() * 0.015

  return (
    <Column
      uiTransform={{
        width: '100%'
      }}
    >
      <MenuBar
        items={['GENESIS CITY', 'WORLDS']}
        activeIndex={placeTypeActiveIndex}
        onClick={(index) => {
          setPlaceTypeActiveIndex(index)
          store.dispatch(
            updateHudStateAction({
              placeType: PLACE_TYPES[index]
            })
          )
        }}
      />
      <Row
        uiTransform={{
          width: '100%',
          padding: fontSize / 2
        }}
        uiBackground={{
          color: COLOR.CATALOG_SEARCH_BACKGROUND
        }}
      >
        {!recreatingInputWorkaround && (
          <Input
            uiTransform={{
              elementId: 'sceneSearchInput',
              width: '97.5%',
              height: fontSize * 2,
              padding: fontSize / 2,
              borderRadius: fontSize / 2,
              borderWidth: 0,
              borderColor: COLOR.BLACK_TRANSPARENT
            }}
            fontSize={fontSize}
            placeholder={'Search'}
            uiBackground={{
              color: COLOR.WHITE
            }}
            value={searchText}
            onChange={(_searchText) => {
              executeTask(async () => {
                await waitFor(() => !loading)
                setSearchText(_searchText)
              })
            }}
            onSubmit={() => {
              //workaround to avoid clearing text when pressing ENTER
              recreatingInputWorkaround = true
              executeTask(async () => {
                await sleep(0)
                recreatingInputWorkaround = false
                setUiFocus({ elementId: 'sceneSearchInput' })
              })
            }}
          />
        )}
      </Row>
      <Row
        uiTransform={{
          justifyContent: 'space-between',
          width: '95%'
        }}
      >
        {ORDER_OPTIONS.map(({ orderKey, label }) => {
          return (
            <UiEntity
              uiBackground={{
                color:
                  store.getState().hud.sceneCatalogOrder === orderKey
                    ? COLOR.ACTIVE_BACKGROUND_COLOR
                    : COLOR.NAV_BUTTON_INACTIVE_BACKGROUND
              }}
              uiTransform={{
                margin: getViewportHeight() * 0.005,
                borderWidth: 0,
                borderColor: COLOR.BLACK_TRANSPARENT,
                borderRadius: getViewportHeight() * 0.01
              }}
              uiText={{
                fontSize: getViewportHeight() * 0.015,
                value: `<b>${label}</b>`,
                color:
                  store.getState().hud.sceneCatalogOrder === orderKey
                    ? COLOR.WHITE
                    : COLOR.TEXT_COLOR
              }}
              onMouseDown={() => {
                if (loading || store.getState().hud.movingMap) return
                store.dispatch(
                  updateHudStateAction({
                    sceneCatalogOrder: orderKey
                  })
                )
              }}
            />
          )
        })}
      </Row>
      <Column
        uiTransform={{
          alignItems: 'flex-start',
          scrollVisible: 'vertical',
          overflow: 'scroll',
          height: '85%'
        }}
      >
        {loading && (
          <UiEntity
            uiText={{
              value: 'Loading...',
              color: COLOR.TEXT_COLOR_GREY,
              fontSize
            }}
          />
        )}
        {!loading &&
          list.map((place) => {
            return (
              <ListCard
                uiTransform={{
                  width: '93%'
                }}
                thumbnailSrc={place.image}
                active={
                  store.getState().hud.placeListActiveItem?.id === place.id
                }
                activeFooter={'Click again to show more info'}
                onMouseDown={() => {
                  if (
                    store.getState().hud.placeListActiveItem?.id === place.id
                  ) {
                    getUiController().sceneCard.showByData(
                      place as PlaceRepresentation
                    )
                  } else {
                    if (!place.world && !currentRealmProviderIsWorld()) {
                      displaceCamera(
                        fromParcelCoordsToPosition(
                          fromStringToCoords(place.base_position),
                          { height: 0 }
                        )
                      )
                    }

                    store.dispatch(
                      updateHudStateAction({
                        placeListActiveItem: place
                      })
                    )
                  }
                }}
              >
                <Column
                  uiTransform={{
                    alignItems: 'flex-start'
                  }}
                >
                  <UiEntity
                    uiText={{
                      textWrap: 'wrap',
                      textAlign: 'top-left',
                      value: `<b>${truncateWithoutBreakingWords(
                        place.title,
                        24
                      )}</b>`,
                      color: COLOR.TEXT_COLOR,
                      fontSize
                    }}
                  />
                  <UiEntity
                    uiText={{
                      textAlign: 'top-left',
                      value: `Created by <b>${truncateWithoutBreakingWords(
                        place.owner ?? place.contact_name,
                        12
                      )}</b>`,
                      color: COLOR.TEXT_COLOR,
                      fontSize
                    }}
                  />
                  <Row
                    uiTransform={{
                      margin: { left: '5%' }
                    }}
                  >
                    <Icon
                      icon={{ spriteName: 'LikeSolid', atlasName: 'map2' }}
                      iconColor={COLOR.TEXT_COLOR}
                      iconSize={fontSize}
                    />
                    <UiEntity
                      uiTransform={{
                        width: 'auto'
                      }}
                      uiText={{
                        textAlign: 'top-left',
                        value: `${Math.floor(place.like_score * 100)}%`,
                        color: COLOR.TEXT_COLOR,
                        fontSize
                      }}
                    />
                    <Icon
                      icon={{ spriteName: 'PlayersIcn', atlasName: 'map2' }}
                      iconColor={COLOR.TEXT_COLOR}
                      iconSize={fontSize}
                    />
                    <UiEntity
                      uiTransform={{
                        width: 'auto'
                      }}
                      uiText={{
                        textAlign: 'top-left',
                        value: place.user_visits?.toString() ?? '0',
                        color: COLOR.TEXT_COLOR,
                        fontSize
                      }}
                    />
                  </Row>
                </Column>
              </ListCard>
            )
          })}
      </Column>
    </Column>
  )
}

export function getPlaceAuthor(place: Place) {
  return place.owner ?? place.contact_name
}
const cachedRequests = new Map<string, PlaceListResponse>()

async function fetchList({
  searchText,
  currentPage = 0
}: FetchParams): Promise<{ total: number; data: Place[] }> {
  const categories = store.getState().hud.mapFilterCategories
  const orderKey = store.getState().hud.sceneCatalogOrder
  const placeType = store.getState().hud.placeType
  console.log('placeType', placeType)
  const queryParameters =
    categories?.includes('all') || categories?.includes('favorites')
      ? []
      : [
          ...categories.map((c) => ({
            key: PLACE_URL_PARAM_CATEGORY,
            value: c
          }))
        ]

  let url = `https://places.decentraland.org/api/${placeType}?offset=${
    currentPage * LIMIT
  }&limit=${LIMIT}&${queryParameters
    .map((q) => `${q.key}=${q.value}`)
    .join(
      '&'
    )}&search=${searchText}&order_by=${getOrderKey()}&order=desc&with_realms_detail=true`

  if (categories?.includes('favorites')) {
    url += `&only_favorites=true`
  }

  if (cachedRequests.has(url)) {
    return cachedRequests.get(url) as PlaceListResponse
  }

  const response = await BevyApi.kernelFetch({
    url,
    init: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    },
    meta: JSON.stringify({})
  }).then((r) => JSON.parse(r.body))

  cachedRequests.set(url, response)

  return response

  function getOrderKey() {
    // TODO until fix in places API
    if (placeType === 'worlds') {
      if (orderKey === 'updated_at') {
        return 'created_at'
      }
    }
    return orderKey
  }
}

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
import { Input } from '@dcl/sdk/react-ecs'
import { useDebouncedValue } from '../../hooks/use-debounce'
import { BevyApi } from '../../bevy-api'
import { SceneCatalogOrder } from '../../state/hud/state'
import { sleep, waitFor } from '../../utils/dcl-utils'
import { setUiFocus } from '~system/RestrictedActions'
import { truncateWithoutBreakingWords } from '../../utils/ui-utils'
import { getMainMenuHeight } from '../../ui-classes/main-menu/MainMenu'
import { getHudFontSize } from '../../ui-classes/main-hud/scene-info/SceneInfo'

const LIMIT = 20 // TODO maybe calculate how many fits in height? or not?
export type FetchParams = {
  searchText?: string
  categories?: string[]
  currentPage?: number
}

export const ORDER_OPTIONS: { orderKey: SceneCatalogOrder; label: string }[] = [
  { orderKey: 'most_active', label: `MOST ACTIVE` },
  { orderKey: 'like_score', label: `MOST LIKED` },
  { orderKey: 'updated_at', label: `MOST FRESH` }
]

async function fetchList({
  searchText,
  currentPage = 0
}: FetchParams): Promise<{ total: number; data: Place[] }> {
  const categories = store.getState().hud.mapFilterCategories
  const orderKey = store.getState().hud.sceneCatalogOrder

  const queryParameters =
    categories?.includes('all') || categories?.includes('favorites')
      ? []
      : [
          ...categories.map((c) => ({
            key: PLACE_URL_PARAM_CATEGORY,
            value: c
          }))
        ]

  let url = `https://places.decentraland.org/api/places?offset=${
    currentPage * LIMIT
  }&limit=${LIMIT}&${queryParameters
    .map((q) => `${q.key}=${q.value}`)
    .join(
      '&'
    )}&search=${searchText}&order_by=${orderKey}&order=desc&with_realms_detail=true`

  if (categories?.includes('favorites')) {
    url += `&only_favorites=true`
  }

  const response = await BevyApi.kernelFetch({
    url,
    init: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    },
    meta: JSON.stringify({})
  }).then((r) => JSON.parse(r.body))
  return response
}
let recreatingInputWorkaround = false
export function SceneCatalogPanel(): ReactElement {
  const width = getRightPanelWidth()

  return (
    <UiEntity
      uiTransform={{
        width,
        height: getViewportHeight() - getMainMenuHeight(),
        positionType: 'absolute',
        position: {
          right: -10,
          top: getMainMenuHeight()
        },
        pointerFilter: 'block',
        borderWidth: 5
      }}
      uiBackground={{
        color: COLOR.PANEL_BACKGROUND_LIGHT
      }}
    >
      <SceneCatalogContent />
    </UiEntity>
  )
}
const PLACE_URL_PARAM_CATEGORY = 'categories'

function SceneCatalogContent(): ReactElement {
  const list = store.getState().hud.sceneList.data
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebouncedValue(searchText, 300)
  const [loading, setLoading] = useState<boolean>(true)

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
    store.getState().hud.sceneCatalogOrder
  ])
  useEffect(() => {
    // TODO select appropriate places server/source
    executeTask(async () => {
      const response = await fetchList({
        searchText,
        categories: store.getState().hud.mapFilterCategories,
        currentPage
      })
      setLoading(false)
      store.dispatch(
        updateHudStateAction({
          sceneList: response
        })
      )
    })
  }, [store.getState().hud.mapFilterCategories])
  const fontSize = getViewportHeight() * 0.015

  return (
    <Column
      uiTransform={{
        width: '100%'
      }}
    >
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
          height: '90%'
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
                    const coords = fromStringToCoords(place.base_position)
                    getUiController().sceneCard.showByCoords(
                      Vector3.create(coords.x, 0, coords.y)
                    )
                  } else {
                    const coords = fromStringToCoords(place.base_position)
                    displaceCamera(
                      fromParcelCoordsToPosition(coords, { height: 0 })
                    )
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
                        value: place.user_visits.toString(),
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

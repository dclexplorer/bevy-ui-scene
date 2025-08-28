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
import { getViewportHeight } from '../../service/canvas-ratio'
import Icon from '../icon/Icon'
import { Vector3 } from '@dcl/sdk/math'
import { displaceCamera } from '../../service/map-camera'
import { updateHudStateAction } from '../../state/hud/actions'
import { Input } from '@dcl/sdk/react-ecs'
import { useDebouncedValue } from '../../hooks/use-debounce'

const LIMIT = 20 // TODO maybe calculate how many fits in height? or not?
export type FetchParams = {
  searchText?: string
  categories?: string[]
  currentPage?: number
}
async function fetchList({
  searchText,
  categories = ['poi'],
  currentPage = 0
}: FetchParams): Promise<{ total: number; data: Place[] }> {
  const queryParameters = categories?.includes('all')
    ? []
    : [
        ...categories.map((c) => ({
          key: PLACE_URL_PARAM_CATEGORY,
          value: c
        }))
      ]
  const url = `https://places.decentraland.org/api/places?offset=${
    currentPage * LIMIT
  }&limit=${LIMIT}&${queryParameters
    .map((q) => `${q.key}=${q.value}`)
    .join(
      '&'
    )}&search=${searchText}&order_by=most_active&order=desc&with_realms_detail=true`

  console.log('url', url)

  const response = await fetch(url).then((r) => r.json())
  console.log('places_response', response?.data.length)
  return response
}

export function SceneCatalogPanel(): ReactElement {
  const width = getUiController().sceneCard.panelWidth

  return (
    <UiEntity
      uiTransform={{
        width,
        height: '100%',
        alignSelf: 'flex-end',
        positionType: 'absolute',
        position: {
          right: 0
        }
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
  const [list, setList] = useState<Place[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebouncedValue(searchText, 300)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    executeTask(async () => {
      setLoading(true)
      setList(
        (
          await fetchList({
            searchText: debouncedSearchText,
            currentPage,
            categories: store.getState().hud.mapFilterCategories
          })
        ).data
      )
      setLoading(false)
    })
  }, [debouncedSearchText])
  useEffect(() => {
    // TODO select appropriate places server/source
    executeTask(async () => {
      const response = await fetchList({
        searchText,
        categories: store.getState().hud.mapFilterCategories,
        currentPage
      })
      setLoading(false)
      setList(response.data)
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
          borderRadius: 0,
          borderColor: COLOR.GREEN,
          borderWidth: 1
        }}
      >
        <Input
          uiTransform={{
            width: '94%',
            padding: fontSize / 2
          }}
          fontSize={fontSize}
          placeholder={'Search'}
          uiBackground={{
            color: COLOR.WHITE
          }}
          value={searchText}
          onChange={(_searchText) => {
            setSearchText(_searchText)
          }}
        />
      </Row>
      <Column
        uiTransform={{
          alignItems: 'flex-start',
          scrollVisible: 'vertical',
          overflow: 'scroll',
          height: '100%'
        }}
      >
        {loading && (
          <UiEntity
            uiText={{ value: 'Loading...', color: COLOR.TEXT_COLOR_GREY }}
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
                active={store.getState().hud.placeListActiveItem === place}
                activeFooter={'Click again to show more info'}
                onMouseDown={() => {
                  if (store.getState().hud.placeListActiveItem === place) {
                    const coords = fromStringToCoords(place.base_position)
                    getUiController().sceneCard.showByCoords(
                      Vector3.create(coords.x, 0, coords.y)
                    )
                  } else {
                    const coords = fromStringToCoords(place.base_position)
                    displaceCamera(fromParcelCoordsToPosition(coords))
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
                      textAlign: 'top-left',
                      value: `<b>${place.title}</b>`,
                      color: COLOR.TEXT_COLOR,
                      fontSize
                    }}
                  />
                  <UiEntity
                    uiText={{
                      textAlign: 'top-left',
                      value: `Created by <b>${
                        place.owner ?? place.contact_name
                      }</b>`,
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

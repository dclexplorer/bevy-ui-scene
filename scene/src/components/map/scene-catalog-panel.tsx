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
import { EMPTY_PLACE } from '../../utils/constants'
import { Vector3 } from '@dcl/sdk/math'
import { displaceCamera } from '../../service/map-camera'
import { getVector3Parcel } from '../../service/player-scenes'
import { updateHudStateAction } from '../../state/hud/actions'
import { debounce } from '../../utils/dcl-utils'
import { showErrorPopup } from '../../service/error-popup-service'

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
  const queryParameters = [
    ...categories.map((c) => ({
      key: PLACE_URL_PARAM_CATEGORY,
      value: c
    }))
  ]
  const url = `https://places.decentraland.org/api/places?offset=${
    currentPage * LIMIT
  }&limit=${LIMIT}&${queryParameters
    .map((q) => `${q.key}=${q.value}`)
    .join('&')}`

  console.log('url', url)

  const response = await fetch(url).then((r) => r.json())
  console.log('places_response', response?.data.length)
  return response
}
const debouncedSearch = debounce(({ searchText, currentPage }: FetchParams) => {
  fetchList({
    searchText,
    categories: store.getState().hud.mapFilterCategories,
    currentPage
  }).catch((error: any) => {
    console.error(error)
    showErrorPopup(error)
  })
}, 600)

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
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    // TODO select appropriate places server/source
    executeTask(async () => {
      const response = await fetchList({
        searchText: '',
        categories: store.getState().hud.mapFilterCategories,
        currentPage
      })
      setLoading(false)
      setList(response.data)
    })
  }, [store.getState().hud.mapFilterCategories])

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
      ></Row>
      <Column
        uiTransform={{
          alignItems: 'flex-start',
          scrollVisible: 'vertical',
          overflow: 'scroll',
          height: '100%'
        }}
      >
        {loading && <UiEntity uiText={{ value: 'Loading...' }} />}
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
                      fontSize: getViewportHeight() * 0.015
                    }}
                  />
                  <UiEntity
                    uiText={{
                      textAlign: 'top-left',
                      value: `Created by <b>${
                        place.owner ?? place.contact_name
                      }</b>`,
                      color: COLOR.TEXT_COLOR,
                      fontSize: getViewportHeight() * 0.015
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
                      iconSize={getViewportHeight() * 0.015}
                    />
                    <UiEntity
                      uiTransform={{
                        width: 'auto'
                      }}
                      uiText={{
                        textAlign: 'top-left',
                        value: `${Math.floor(place.like_score * 100)}%`,
                        color: COLOR.TEXT_COLOR,
                        fontSize: getViewportHeight() * 0.015
                      }}
                    />
                    <Icon
                      icon={{ spriteName: 'PlayersIcn', atlasName: 'map2' }}
                      iconColor={COLOR.TEXT_COLOR}
                      iconSize={getViewportHeight() * 0.015}
                    />
                    <UiEntity
                      uiTransform={{
                        width: 'auto'
                      }}
                      uiText={{
                        textAlign: 'top-left',
                        value: place.user_visits.toString(),
                        color: COLOR.TEXT_COLOR,
                        fontSize: getViewportHeight() * 0.015
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

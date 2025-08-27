import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { getUiController } from '../../controllers/ui.controller'
import { COLOR } from '../color-palette'
import useEffect = ReactEcs.useEffect
import { store } from '../../state/store'
import useState = ReactEcs.useState
import { fromStringToCoords, Place } from '../../service/map-places'
import { executeTask } from '@dcl/sdk/ecs'
import { Column, Row } from '../layout'
import { ListCard } from './list-card'
import { getViewportHeight } from '../../service/canvas-ratio'
import Icon from '../icon/Icon'
import { Label } from '@dcl/sdk/react-ecs'
import { EMPTY_PLACE } from '../../utils/constants'
import { Vector3 } from '@dcl/sdk/math'

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

const LIMIT = 20 // TODO maybe calculate how many fits in height? or not?

function SceneCatalogContent(): ReactElement {
  const [list, setList] = useState<Place[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [activeCardPlace, setActiveCardPlace] = useState<Place>(EMPTY_PLACE)
  useEffect(() => {
    // TODO select appropriate places server/source
    executeTask(async () => {
      const queryParameters = [
        ...store.getState().hud.mapFilterCategories.map((c) => ({
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
          alignItems: 'flex-start'
        }}
      >
        {list.map((place) => {
          return (
            <ListCard
              thumbnailSrc={place.image}
              active={activeCardPlace === place}
              onMouseDown={() => {
                if (activeCardPlace === place) {
                  const coords = fromStringToCoords(place.base_position)
                  getUiController().sceneCard.showByCoords(
                    Vector3.create(coords.x, 0, coords.y)
                  )
                } else {
                  setActiveCardPlace(place)
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

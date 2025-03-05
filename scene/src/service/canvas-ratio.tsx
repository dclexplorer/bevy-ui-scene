import {engine, UiCanvasInformation} from '@dcl/sdk/ecs'
import {memoize} from '../utils/function-utils'
import {type ViewportState} from '../state/viewport/state'
import {store} from '../state/store'
const G_CONTENT_WIDTH = 1893
const G_CONTENT_HEIGHT = 900
const G_WIDTH = 1920
const G_HEIGHT = 1200
const CONTENT_WIDTH_HEIGHT_RATIO = G_CONTENT_WIDTH / G_CONTENT_HEIGHT

const _getContentWidth = memoize((viewportState: ViewportState) => {
    return Math.min(
        viewportState.width * G_CONTENT_WIDTH / G_WIDTH,
        (viewportState.height * G_CONTENT_HEIGHT / G_HEIGHT) * CONTENT_WIDTH_HEIGHT_RATIO
    )
})

const _getContentHeight = memoize((viewportState: ViewportState): number => {
    return Math.min(
        (viewportState.height * G_CONTENT_HEIGHT) / G_HEIGHT,
        (viewportState.width * G_CONTENT_WIDTH / G_WIDTH) * 1 / CONTENT_WIDTH_HEIGHT_RATIO
    )
})

export const getContentWidth = (): number => _getContentWidth(store.getState().viewport)
export const getContentHeight = (): number => _getContentHeight(store.getState().viewport)

// TODO remove
export function getCanvasScaleRatio(): number {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return 1
    const minSize: number = Math.min(canvasInfo.height, canvasInfo.width)
    return minSize / 2200
}

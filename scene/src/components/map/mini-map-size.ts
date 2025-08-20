import { getViewportHeight } from '../../service/canvas-ratio'

export const getMapSize = (): number => getViewportHeight() * 0.25

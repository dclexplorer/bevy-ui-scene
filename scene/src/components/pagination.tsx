import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { getCanvasScaleRatio } from '../service/canvas-ratio'
import { ButtonIcon } from './button-icon'
import { NavButton } from './nav-button/NavButton'
import { TRANSPARENT } from '../utils/constants'
import { noop } from '../utils/function-utils'

export type PaginationProps = {
  pages: number
  currentPage: number
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function
  disabled?: boolean
}

const PAGE_BUTTONS = 5

export function Pagination({
  pages,
  currentPage,
  onChange = noop,
  disabled = false
}: PaginationProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
    // TODO memoize [currentPage , totalPage] -> pageElements
  const offset =
    currentPage > 3 ? Math.min(currentPage - 3, pages - PAGE_BUTTONS) : 0
  const pageElements = new Array(Math.min(PAGE_BUTTONS, pages))
    .fill(null)
    .map((_, index) => {
      return offset + index + 1
    })
  return (
    <UiEntity
      uiTransform={{
        justifyContent: 'center',
        positionType: 'relative',
        margin: { top: 100 * canvasScaleRatio }
      }}
      uiBackground={{
        color: Color4.create(1, 0, 0, 0.0)
      }}
    >
      <ButtonIcon
        icon={{ spriteName: 'LeftArrow', atlasName: 'icons' }}
        iconSize={60 * canvasScaleRatio}
      />
      {pageElements.map((pageElement) => (
        <UiEntity key={pageElement}>
          <NavButton
            active={currentPage === pageElement}
            text={pageElement.toString()}
            backgroundColor={
              currentPage === pageElement ? undefined : TRANSPARENT
            }
            color={Color4.White()}
            onClick={() => {
              if (pageElement !== currentPage && !disabled) {
                onChange(pageElement)
              }
            }}
          />
        </UiEntity>
      ))}
      <ButtonIcon
        icon={{ spriteName: 'RightArrow', atlasName: 'icons' }}
        iconSize={60 * canvasScaleRatio}
      />
    </UiEntity>
  )
}

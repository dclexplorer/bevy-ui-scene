import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { ButtonIcon } from '../button-icon'
import { NavButton } from '../nav-button/NavButton'
import { TRANSPARENT } from '../../utils/constants'
import { noop } from '../../utils/function-utils'
import { getPaginationItems } from './pagination-util'

export type PaginationProps = {
  pages: number
  currentPage: number
  onChange: (pageElement: number) => void
  disabled?: boolean
}


export function Pagination({
  pages,
  currentPage,
  onChange = noop,
  disabled = false
}: PaginationProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  // TODO memoize [currentPage , totalPage] -> pageElements
  const pageElements = getPaginationItems({currentPage, total:pages})
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
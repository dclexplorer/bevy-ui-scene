import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { Column, Row } from '../layout'
import { UiTransformProps } from '@dcl/sdk/react-ecs'
import { getViewportHeight } from '../../service/canvas-ratio'
import { COLOR } from '../color-palette'

export type ListCardParams = {
  key?: any
  children?: ReactElement
  thumbnailSrc: string
}
export function ListCard({
  thumbnailSrc,
  children
}: ListCardParams): ReactElement {
  return (
    <Row
      uiTransform={{
        width: '98%',
        padding: '3%',
        margin: '1%',
        borderWidth: 1,
        borderRadius: 0,
        borderColor: COLOR.BLACK_TRANSPARENT
      }}
      uiBackground={{ color: COLOR.WHITE }}
    >
      <Image
        src={thumbnailSrc}
        uiTransform={{
          width: getViewportHeight() * 0.2 * 0.8,
          height: getViewportHeight() * 0.1 * 0.8,
          borderWidth: 0,
          borderRadius: 0, // TODO borderRadius doesn't work with image texture
          borderColor: COLOR.BLACK_TRANSPARENT
        }}
      />
      <Column
        uiTransform={{
          alignItems: 'flex-start'
        }}
      >
        {children}
      </Column>
    </Row>
  )
}

export type ImageParams = {
  key?: any
  src: string
  uiTransform?: UiTransformProps
}
export function Image({ src, uiTransform }: ImageParams): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%',
        ...uiTransform
      }}
      uiBackground={{
        textureMode: 'stretch',
        texture: {
          src
        }
      }}
    ></UiEntity>
  )
}

import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, {
  Label,
  UiEntity
} from '@dcl/sdk/react-ecs'
import Canvas from '../../components/canvas/Canvas'
import { type UIController } from '../../controllers/ui.controller'
import {
  PANEL_BACKGROUND_COLOR
} from '../../utils/constants'
import { getFontSizesByResolution } from 'src/utils/ui-utils'

export default class Photos {
  private readonly uiController: UIController
  public fontSize: number = 16
 
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  TextTest(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    const {title, paragraph, smallText} = getFontSizesByResolution()

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            position: {
              right: 0,
              top: 0
            },
            positionType: 'absolute'
          }}
          uiBackground={{
            color: PANEL_BACKGROUND_COLOR
          }}
        >

         <Label fontSize={title} value='Title'/>
         <Label fontSize={paragraph} value='Paragraph'/>
         <Label fontSize={smallText} value='Small text'/>

        </UiEntity>
      </Canvas>
    )
  }

}

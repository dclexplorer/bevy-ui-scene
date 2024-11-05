import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { openExternalUrl } from '~system/RestrictedActions'
import BottomButtons from '../../ui/main-hud/bottomButtons'

export class BottomButtonsController {
  public gesturesWheelVisible: boolean
  public chatVisible: boolean
  constructor() {
    this.gesturesWheelVisible = false
    this.chatVisible = false
  }

  render(): ReactEcs.JSX.Element {
    return (
      <UiEntity>
        <BottomButtons
          gesturesWheelVisible={false}
          chatVisible={this.chatVisible}
          toggleChat={this.toggleChatVisibility.bind(this)}
        />
      </UiEntity>
    )
  }

  toggleChatVisibility(visibility: boolean): void {
    this.chatVisible = visibility
  }

  openLink(url: string): void {
    openExternalUrl({ url }).catch(console.error)
  }
}

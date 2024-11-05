import { GameController } from '../controllers/game.controller'

let gameInstance: GameController

export function main(): void {
  init(false).catch((e) => {
    console.error('Fatal error during init')
    console.error(e)
  })
}

async function init(retry: boolean): Promise<void> {
  gameInstance = new GameController()
  gameInstance.uiController.loadingAndLogin.startLoading()

  // // UI
  // gameInstance.uiController.loadingUI.finishLoading()
  // gameInstance.uiController.showBottomButtons()
}

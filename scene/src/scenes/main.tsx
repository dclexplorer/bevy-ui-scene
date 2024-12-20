import { BevyApi } from '../bevy-api'
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

  const { description, url } = await BevyApi.checkForUpdate()

  if (url !== '') {
    console.log('There is a new update', description, url)
  } else {
    console.log('No update available')
  }

  const previousLogin = await BevyApi.getPreviousLogin()
  console.log('Previous login', previousLogin)

  if (previousLogin.userId !== null) {
    gameInstance.uiController.loadingAndLogin.setStatus('reuse-login-or-new')
  } else {
    gameInstance.uiController.loadingAndLogin.setStatus('sign-in-or-guest')
  }
}

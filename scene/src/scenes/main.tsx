// import { loadEventsFromApi } from 'src/state/events/actions'
import { BevyApi } from '../bevy-api'
import type { ExplorerSetting } from '../bevy-api/interface'
import { GameController } from '../controllers/game.controller'
import { loadSettingsFromExplorer } from '../state/settings/actions'
import { store } from '../state/store'
// import { fetchEvents } from 'src/utils/promise-utils'

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
  gameInstance.uiController.loadingAndLogin.finishLoading()

  const { description, url } = await BevyApi.checkForUpdate()

  if (url !== '') {
    console.log('There is a new update', description, url)
  } else {
    console.log('No update available')
  }

  const { message } = await BevyApi.messageOfTheDay()
  if (message !== '') {
    gameInstance.uiController.warningPopUp.tittle = 'Message of the day:'
    gameInstance.uiController.warningPopUp.message = message
    gameInstance.uiController.warningPopUp.icon = 'DdlIconColor'
    gameInstance.uiController.warningPopUp.show()
  }

  const settingsArray = await BevyApi.getSettings()
  if (settingsArray.length === 0) {
    console.log('No settings found')
  } else {
    console.log('Settings found: ', settingsArray.length)
  }

  const explorerSettings = settingsArray.reduce(
    (acc: Record<string, ExplorerSetting>, setting) => {
      acc[setting.name] = setting
      return acc
    },
    {}
  )
  store.dispatch(loadSettingsFromExplorer(explorerSettings))

  // const eventsArray = await fetchEvents();
  // if (eventsArray.length === 0) {
  //   console.log('No events found')
  // } else {
  //   console.log('Events found: ', eventsArray.length)
  // }
  // store.dispatch(loadEventsFromApi(eventsArray));

  const previousLogin = await BevyApi.getPreviousLogin()
  if (previousLogin.userId !== null) {
    gameInstance.uiController.loadingAndLogin.setStatus('reuse-login-or-new')
  } else {
    gameInstance.uiController.loadingAndLogin.setStatus('sign-in-or-guest')
  }
}

import { UIController } from './ui.controller'

export class GameController {
  uiController: UIController
  constructor() {
    this.uiController = new UIController(this)
  }
}

let currentGameController: GameController
export function getCurrentGameController(): GameController {
  return currentGameController
}

export function setCurrentGameController(controller: GameController): void {
  currentGameController = controller
}

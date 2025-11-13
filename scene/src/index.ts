import { init } from './scenes/main'
import { initRealmProviderChangeListener } from './service/realm-change'
import { initAvatarTags } from './components/avatar-tags/avatar-name-tag-3d'
import { showErrorPopup } from './service/error-popup-service'

export function main(): void {
  const _consoleError = console.error
  console.error = (...args) => {
    try {
      _consoleError('console.error', ...args)
      showErrorPopup(`ConsoleError from System scene: ${args.join('\n')}`)
    } catch (error) {
      console.error(error, ...args)
    }
  }
  initRealmProviderChangeListener()

  init(false).catch((e) => {
    console.error('Fatal error during init')
    console.error(e)
  })
  initAvatarTags().catch(console.error)
}

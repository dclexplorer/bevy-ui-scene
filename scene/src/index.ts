import { init } from './scenes/main'
import { initRealmProviderChangeListener } from './service/realm-change'

// tests scenes
// export * from './scenes/tests/test-main-hud'

export function main(): void {
  initRealmProviderChangeListener()
  init(false).catch((e) => {
    console.error('Fatal error during init')
    console.error(e)
  })
}

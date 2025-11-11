import { init } from './scenes/main'
import { initRealmProviderChangeListener } from './service/realm-change'
import { initAvatarTags } from './components/avatar-tags/avatar-name-tag-3d'

export function main(): void {
  initRealmProviderChangeListener()

  init(false).catch((e) => {
    console.error('Fatal error during init')
    console.error(e)
  })
  initAvatarTags()
}

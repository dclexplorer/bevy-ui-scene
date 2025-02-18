import { init } from './scenes/main'

// tests scenes
// export * from './scenes/tests/test-main-hud'

export function main(): void {
  init(false).catch((e) => {
    console.error('Fatal error during init')
    console.error(e)
  })
}

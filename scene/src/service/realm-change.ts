import { executeTask } from '@dcl/sdk/ecs'
import { sleep } from '../utils/dcl-utils'
import { BevyApi } from '../bevy-api'
import { memoize } from '../utils/function-utils'
import { getRealm } from '~system/Runtime'

const INTERVAL_MS = 2000

type RealmChangeCallback = (provider: string, previous?: string) => void

const state: { realmProvider: string } = {
  realmProvider: ''
}

const callbacks: { onChange: RealmChangeCallback[] } = {
  onChange: []
}

export function onChangeRealmProvider(fn: RealmChangeCallback): () => void {
  callbacks.onChange.push(fn)
  return () => {
    const idx = callbacks.onChange.indexOf(fn)
    if (idx !== -1) callbacks.onChange.splice(idx, 1)
  }
}

export function initRealmProviderChangeListener() {
  executeTask(async () => {
    while (true) {
      try {
        await sleep(INTERVAL_MS)
        // TODO maybe change to just SDK getRealm()
        const latest = await BevyApi.getRealmProvider()
        console.log(
          '(await getRealm({})).realmInfo',
          (await getRealm({})).realmInfo
        )
        if (latest !== state.realmProvider) {
          const prev = state.realmProvider
          state.realmProvider = latest

          for (const cb of callbacks.onChange) {
            try {
              cb(latest, prev || undefined)
            } catch (err) {
              console.error('onChangeRealmProvider callback error', err)
            }
          }
        }
      } catch (error) {
        console.log('Error XXXXXXXXXXXXXX', error)
      }
    }
  })
}

const _isWorldRealmProvider = (URL: string) => {
  return (
    URL.indexOf('https://worlds-content-server.decentraland.org/world/') === 0
  )
} // TODO We cannot rely on this, if world provider URL changes, code relying on this will fail

export function currentRealmProviderIsWorld() {
  return _isWorldRealmProvider(state.realmProvider)
}

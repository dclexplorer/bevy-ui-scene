import {
  CATALYST_BASE_URL_FALLBACK,
  LOCAL_STORAGE_OUTFITS_KEY
} from './constants'
import { getRealm } from '~system/Runtime'
import { fetchJsonOrTryFallback } from './promise-utils'
import { type OutfitsMetadata } from './outfit-definitions'
import { getPlayer } from '@dcl/sdk/src/players'

declare const localStorage: any

export type OutfitMetadataRequestParams = { address: string }

export async function fetchPlayerOutfitMetadata({
  address
}: OutfitMetadataRequestParams): Promise<OutfitsMetadata> {
  const localStorageOutfitsMetadata: string = localStorage.getItem(
    getOutfitLocalKey()
  )
  if (localStorageOutfitsMetadata) {
    return JSON.parse(localStorageOutfitsMetadata)
  }

  const realm = await getRealm({})
  const catalystBaseURl = realm.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
  const outfitsMetadataURL = `${catalystBaseURl}/lambdas/outfits/${address}`
  const outfitsMetadataResponse =
    await fetchJsonOrTryFallback(outfitsMetadataURL)

  return (
    outfitsMetadataResponse?.metadata ||
    ({ outfits: [], namesForExtraSlots: [] } satisfies OutfitsMetadata)
  )
}

export function getOutfitLocalKey(): string {
  return `${LOCAL_STORAGE_OUTFITS_KEY}:${getPlayer()?.userId}`
}

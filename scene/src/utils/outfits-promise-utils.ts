import { CATALYST_BASE_URL_FALLBACK } from './constants'
import { getRealm } from '~system/Runtime'
import { fetchJsonOrTryFallback } from './promise-utils'
import { type OutfitsMetadata } from './outfit-definitions'

export type OutfitMetadataRequestParams = { address: string }

export async function fetchPlayerOutfitMetadata({
  address
}: OutfitMetadataRequestParams): Promise<OutfitsMetadata> {
  const realm = await getRealm({})
  const catalystBaseURl = realm.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
  const outfitsMetadataURL = `${catalystBaseURl}/lambdas/outfits/${address}`
  const outfitsMetadataResponse =
    await fetchJsonOrTryFallback(outfitsMetadataURL)
  return outfitsMetadataResponse?.metadata
}

import { timers } from '@dcl-sdk/utils'

export const dclSleep = async (delay: number): Promise<any> =>
  await new Promise((resolve) => timers.setTimeout(resolve as any, delay))

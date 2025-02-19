import {timers} from "@dcl-sdk/utils";

export function noop(): void {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/ban-ts-comment
// @ts-expect-error
export const sleep = async (delay:number) => await new Promise((resolve) => timers.setTimeout((resolve), delay))

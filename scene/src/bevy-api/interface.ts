import {type URN} from "../utils/definitions";

export type ExplorerSetting = {
  name: string
  category: string
  description: string
  minValue: number
  maxValue: number
  namedVariants: [{ name: string; description: string }]
  value: number
}

export type KernelFetch = {
  url: string
  init: {
    method: 'PATCH' | 'POST' | 'GET' | 'DELETE'
    headers: Record<string, string>
    body: string
  }
}

export type KernelFetchRespose = {
  ok: boolean
  status: number
  statusText: string
  headers: Array<Record<string, string>>
  body: string
}

type PBAvatarEquippedData = {
  wearableUrns: URN[];
  emoteUrns: URN[];
};
type RGBColor = { r: number, g: number, b: number }
type PbAvatarBase = {
  name: string;
  skinColor?: RGBColor;
  eyesColor?: RGBColor;
  hairColor?: RGBColor;
  bodyShapeUrn: string;
};

type SetAvatarData = {
  base?: PbAvatarBase;
  equip?: PBAvatarEquippedData;
};
export type BevyApiInterface = {
  setAvatar: (avatarData:SetAvatarData) => Promise<any> // TODO set profile type
  openSceneLogger: () => Promise<void>
  checkForUpdate: () => Promise<{ description: string; url: string }>
  messageOfTheDay: () => Promise<{ message: string }>
  getPreviousLogin: () => Promise<{ userId: string }>
  loginPrevious: () => Promise<{ success: boolean; error: string }>
  loginNew: () => {
    code: Promise<number>
    success: Promise<void>
  }
  loginCancel: () => void
  loginGuest: () => void
  logout: () => void

  getSettings: () => Promise<ExplorerSetting[]>
  setSetting: (name: string, value: number) => Promise<void>
  kernelFetch: (requestBody: KernelFetch) => Promise<KernelFetchRespose>
}

// system api module

// const { op_check_for_update, op_motd, op_get_current_login, op_get_previous_login, op_login_previous, op_login_new_code, op_login_new_success, op_login_cancel, op_login_guest, op_logout } = Deno.core.ops;

// // (description: option<string>, url: option<string>)
// module.exports.checkForUpdate = async function() {
//     let (description, url) = await op_check_for_update();
//     return {
//         description,
//         url
//     }
// }

// // (message: string)
// module.exports.messageOfTheDay = async function() {
//     return {
//         message: await op_motd()
//     }
// }

// // (currentLogin: option<string>)
// module.exports.getCurrentLogin = function() {
//     return {
//         current_login: op_get_current_login()
//     }
// }

// // (userId: option<string>)
// module.exports.getPreviousLogin = async function() {
//     return {
//         userId: await op_get_previous_login()
//     }
// }

// // (success: bool, error: option<string>)
// module.exports.loginPrevious = async function() {
//     return await op_login_previous()
// }

// // (code: Promise<option<string>>, success: Promise<(success: bool, error: option<string>)>)
// module.exports.loginNew = function() {
//     return {
//         code: op_login_new_code(),
//         success: op_login_new_success(),
//     }
// }

// // nothing
// module.exports.loginGuest = function() {
//     op_login_guest()
// }

// // nothing
// module.exports.loginCancel = function() {
//     op_login_cancel()
// }

// // nothing
// module.exports.logout = function() {
//     op_logout()
// }

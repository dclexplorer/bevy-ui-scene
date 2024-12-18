export type BevyApiInterface = {
  openSceneLogger: () => Promise<void>
  checkForUpdate: () => Promise<{ description: string; url: string }>
  messageOfTheDay: () => Promise<{ message: string }>
  getPreviousLogin: () => Promise<{ user_id: string }>
  loginPrevious: () => Promise<{ success: boolean; error: string }>
  loginNew: () => Promise<{
    code: Promise<number>
    success: Promise<{ success: boolean; error: string }>
  }>
  loginCancel: () => Promise<void>
  loginGuest: () => Promise<{ success: boolean; error: string }>
  logout: () => Promise<void>
}

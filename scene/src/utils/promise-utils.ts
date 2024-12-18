
// export async function waitOrTimeout<T>(func: () => Promise<T>, timeout: number, defaultValue: T): Promise<T> {
//   const timeoutPromise = new Promise<T>((resolve) => setTimeout(() => resolve(defaultValue), timeout))
//   return Promise.race([func(), timeoutPromise])
// }

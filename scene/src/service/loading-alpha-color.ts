export const getLoadingAlphaValue = (): number => {
  const t = (Date.now() % 2000) / 1000
  const loadingAlpha = t < 1 ? t : 2 - t
  return loadingAlpha
}

export const roundToStep = (val: number, stepSize?: number): number => {
  if (stepSize === undefined || stepSize === 0) return val

  const decimals = stepSize.toString().split('.')[1]?.length ?? 0
  const rounded = Math.round(val / stepSize) * stepSize
  // Fix floating-point precision issues by rounding to the correct decimal places
  return parseFloat(rounded.toFixed(decimals))
}

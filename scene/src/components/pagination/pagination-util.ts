const PAGE_BUTTONS = 5

export function getPaginationItems({
  currentPage,
  total
}: {
  currentPage: number
  total: number
}): number[] {
  const offset =
    currentPage > 3
      ? Math.min(
          currentPage - Math.ceil(PAGE_BUTTONS / 2),
          total - PAGE_BUTTONS + 1
        )
      : 0
  console.log('ofset', offset)
  return new Array(Math.min(PAGE_BUTTONS, total)).fill(null).map((_, index) => {
    return offset + index + 1
  })
}

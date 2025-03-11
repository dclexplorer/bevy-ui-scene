const PAGE_BUTTONS = 5

export function getPaginationItems(
  currentPage: number,
  total: number
): number[] {
  const offset =
    currentPage > 3
      ? Math.min(
          currentPage - Math.ceil(PAGE_BUTTONS / 2),
          total - PAGE_BUTTONS
        )
      : 0

  return new Array(Math.min(PAGE_BUTTONS, total)).fill(null).map((_, index) => {
    if (total < PAGE_BUTTONS) {
      return index + 1
    } else {
      return offset + index + 1
    }
  })
}

export const minPerPage = 10
export const maxPerPage = 256
export const defaultPerPage = 12

export const calculatePagesNumber = (itemsNumber: number, perPage: number): number => {
  const pageNumber = Math.floor(itemsNumber / perPage)

  const reminder = itemsNumber % perPage

  if (reminder > 0) {
    return pageNumber + 1
  }

  return pageNumber
}

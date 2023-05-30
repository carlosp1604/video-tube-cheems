export const minPerPage = 10
export const maxPerPage = 256
export const defaultPerPage = 20

export const calculatePagesNumber = (itemsNumber: number, perPage: number): number => {
  if (Number.isInteger(itemsNumber / perPage)) {
    const pages = itemsNumber / perPage

    if (pages === 0) {
      return 1
    }
  }

  return Math.floor(itemsNumber / perPage) + 1
}

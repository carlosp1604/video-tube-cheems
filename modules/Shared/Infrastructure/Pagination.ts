export const minPostsPerPage = 10
export const maxPostsPerPage = 256
export const defaultPostsPerPage = 20

export const calculatePagesNumber = (itemsNumber: number, perPage: number): number => {
  if (Number.isInteger(itemsNumber / perPage)) {
    const pages = itemsNumber / perPage
    if (pages === 0) {
      return 1
    }
  }

  return Math.floor(itemsNumber/perPage) + 1
}
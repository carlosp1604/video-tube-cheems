export const minPerPage = 10
export const maxPerPage = 256
export const defaultPerPage = 36
export const defaultPerPageWithoutAds = 36
export const topPostsDefaultNumber = 60

export class PaginationHelper {
  public static getPagesAfterCurrentPage (
    currentPage: number,
    maxPagesNumber: number,
    pagesToShowAfterCurrent: number
  ): Array<number> {
    const pagesAfterCurrentPage: Array<number> = []

    let i = 1

    while (
      (currentPage + i) <= maxPagesNumber &&
      i <= pagesToShowAfterCurrent
    ) {
      pagesAfterCurrentPage.push(currentPage + i)
      i++
    }

    return pagesAfterCurrentPage
  }

  public static getPagesBeforeCurrentPage (
    currentPage: number,
    pagesToShowBeforeCurrent: number
  ): Array<number> {
    const pagesBeforeCurrentPage: Array<number> = []

    let i = 1

    while (
      currentPage - i >= 1 &&
      i <= pagesToShowBeforeCurrent
    ) {
      pagesBeforeCurrentPage.unshift(currentPage - i)
      i++
    }

    return pagesBeforeCurrentPage
  }

  public static getShowablePages (currentPage: number, pagesNumber: number): Array<number> {
    let pagesToShowBefore = PaginationHelper.getPagesBeforeCurrentPage(currentPage, 2)
    let pagesToShowAfter = PaginationHelper.getPagesAfterCurrentPage(currentPage, pagesNumber, 2)

    if (pagesToShowBefore.length < 2) {
      const extraPagesToShowAfter = PaginationHelper.getPagesAfterCurrentPage(
        currentPage + pagesToShowAfter.length,
        pagesNumber,
        2 - pagesToShowBefore.length
      )

      pagesToShowAfter = pagesToShowAfter.concat(extraPagesToShowAfter)
    }

    if (pagesToShowAfter.length < 2) {
      const extraPagesToShowBefore = PaginationHelper.getPagesBeforeCurrentPage(
        currentPage - pagesToShowBefore.length,
        2 - pagesToShowAfter.length
      )

      pagesToShowBefore = extraPagesToShowBefore.concat(pagesToShowBefore)
    }

    return [...pagesToShowBefore, currentPage, ...pagesToShowAfter]
  }

  public static calculatePagesNumber (itemsNumber: number, perPage: number): number {
    const pageNumber = Math.floor(itemsNumber / perPage)

    const reminder = itemsNumber % perPage

    if (reminder > 0) {
      return pageNumber + 1
    }

    return pageNumber
  }
}

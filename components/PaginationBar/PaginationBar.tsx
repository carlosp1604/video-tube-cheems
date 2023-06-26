import { Dispatch, FC, SetStateAction, useState } from 'react'
import styles from './PaginationBar.module.scss'
import { BsCaretLeft, BsCaretRight, BsSkipEnd, BsSkipStart } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'

const getPagesAfterCurrentPage = (
  currentPage: number,
  maxPagesNumber: number,
  pagesToShowAfterCurrent: number
): Array<number> => {
  const pagesAfterCurrentPage: Array<number> = []

  let i = 1

  while (
    currentPage + i <= maxPagesNumber &&
    i <= pagesToShowAfterCurrent
  ) {
    pagesAfterCurrentPage.push(currentPage + i)
    i++
  }

  return pagesAfterCurrentPage
}

const getPagesBeforeCurrentPage = (
  currentPage: number,
  pagesToShowBeforeCurrent: number
): Array<number> => {
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

const getShowablePages = (currentPage: number, pagesNumber: number): Array<number> => {
  let pagesToShowBefore = getPagesBeforeCurrentPage(currentPage, 2)
  let pagesToShowAfter = getPagesAfterCurrentPage(currentPage, pagesNumber, 2)

  if (pagesToShowBefore.length < 2) {
    const extraPagesToShowAfter = getPagesAfterCurrentPage(
      currentPage + pagesToShowAfter.length,
      pagesNumber,
      2 - pagesToShowBefore.length
    )

    pagesToShowAfter = pagesToShowAfter.concat(extraPagesToShowAfter)
  }

  if (pagesToShowAfter.length < 2) {
    const extraPagesToShowBefore = getPagesBeforeCurrentPage(
      currentPage - pagesToShowBefore.length,
      2 - pagesToShowAfter.length
    )

    pagesToShowBefore = extraPagesToShowBefore.concat(pagesToShowBefore)
  }

  return [...pagesToShowBefore, currentPage, ...pagesToShowAfter]
}

interface Props {
  pageNumber: number
  setPageNumber: Dispatch<SetStateAction<number>>
  pagesNumber: number
}

export const PaginationBar: FC<Props> = ({
  pagesNumber,
  setPageNumber,
  pageNumber,
}) => {
  const [pages, setPages] = useState<Array<number>>(getShowablePages(pageNumber, pagesNumber))

  const { t } = useTranslation('pagination_bar')

  const handleChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber)
    setPages(getShowablePages(pageNumber, pagesNumber))
  }

  return (
    <div className={ styles.paginationBar__container }>
      <button
        className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === 1 ? styles.paginationBar__leftPageButtonHide : ''}
        ` }
        disabled={ pageNumber === 1 }
        onClick={ () => handleChange(1) }
        title={ t('first_page_button_title') }
      >
        <BsSkipStart />
      </button>
      <button
        className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === 1 ? styles.paginationBar__leftPageButtonHide : ''}
        ` }
        disabled={ pageNumber === 1 }
        onClick={ () => handleChange(pageNumber - 1) }
        title={ t('previous_page_button_title') }
      >
        <BsCaretLeft />
      </button>
      { pages.map((page) => {
        return (
          <button
            className={ `
              ${styles.paginationBar__pageNumberButton}
              ${pageNumber === page ? styles.paginationBar__pageNumberButton__active : ''}
            ` }
            key={ page }
            onClick={ () => handleChange(page) }
            title={ t('n_page_button_title', { pageNumber: page }) }
          >
            { page }
          </button>
        )
      }) }
      <button
        className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === pagesNumber ? styles.paginationBar__rightPageButtonHide : ''}
        ` }
        disabled={ pageNumber === pagesNumber }
        onClick={ () => handleChange(pageNumber + 1) }
        title={ t('next_page_button_title') }
      >
        <BsCaretRight />
      </button>
      <button
        className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === pagesNumber ? styles.paginationBar__rightPageButtonHide : ''}
        ` }
        disabled={ pageNumber === pagesNumber }
        onClick={ () => handleChange(pagesNumber) }
        title={ t('last_page_button_title') }
      >
        <BsSkipEnd />
      </button>
    </div>
  )
}

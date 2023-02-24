import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import styles from './PaginationBar.module.scss'
import { BsCaretLeft, BsCaretRight, BsSkipEnd, BsSkipStart } from 'react-icons/bs'

const getPagesAfterCurrentPage = (
  currentPage: number,
  maxPagesNumber: number,
  pagesToShowAfterCurrent: number,
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
  pagesToShowBeforeCurrent: number,
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
  let pagesToShowBefore = getPagesBeforeCurrentPage(currentPage,2)
  let pagesToShowAfter = getPagesAfterCurrentPage(currentPage,pagesNumber, 2)


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
  scrollToTopWhenPageChanges: boolean
}

export const PaginationBar: FC<Props> = ({
   pagesNumber,
   setPageNumber,
   pageNumber,
   scrollToTopWhenPageChanges
}) => {
  const [pages, setPages] = useState<Array<number>>(getShowablePages(pageNumber, pagesNumber))

  useEffect(() => {
    setPages(getShowablePages(pageNumber, pagesNumber))
  }, [pageNumber, pagesNumber])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className={ styles.paginationBar__container }>
      <button
        className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === 1 ? styles.paginationBar__leftPageButtonHide : ''}
        `}
        disabled={ pageNumber === 1 }
        onClick={ async () => {
          setPageNumber(1)
          if (scrollToTopWhenPageChanges) {
            await setTimeout( () => {
              scrollToTop()
            }, 500)
          }
        }}
      >
        <BsSkipStart />
      </button>
      <button
        className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === 1 ? styles.paginationBar__leftPageButtonHide : ''}
        `}
        disabled={ pageNumber === 1 }
        onClick={ async () => {
          setPageNumber(pageNumber - 1)
          if (scrollToTopWhenPageChanges) {
            await setTimeout( () => {
              scrollToTop()
            }, 500)
          }
        }}
      >
        <BsCaretLeft />
      </button>
      { pages.map((page) => {
        return (
          <button
            className={`
              ${styles.paginationBar__pageNumberButton}
              ${pageNumber === page ? styles.paginationBar__pageNumberButton__active : '' }
            `}
            key={ page }
            onClick={ async () => {
              setPageNumber(page)
              if (scrollToTopWhenPageChanges) {
                await setTimeout( () => {
                  scrollToTop()
                }, 500)
              }
            }}
          >
            { page }
          </button>
        )
      })}
      <button
        className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === pagesNumber ? styles.paginationBar__rightPageButtonHide : ''}
        `}
        disabled={ pageNumber === pagesNumber }
        onClick={ async () => {
          setPageNumber(pageNumber + 1)
          if (scrollToTopWhenPageChanges) {
            await setTimeout( () => {
              scrollToTop()
            }, 500)
          }
        }}
      >
        <BsCaretRight />
      </button>
      <button
        className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === pagesNumber ? styles.paginationBar__rightPageButtonHide : ''}
        `}
        disabled={ pageNumber === pagesNumber }
        onClick={ async () => {
          setPageNumber(pagesNumber)
          if (scrollToTopWhenPageChanges) {
            await setTimeout( () => {
              scrollToTop()
            }, 500)
          }
        }}
      >
        <BsSkipEnd />
      </button>
    </div>
  )
}
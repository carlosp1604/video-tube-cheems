import { FC, ReactElement, useMemo } from 'react'
import styles from './PaginationBar.module.scss'
import { BsCaretLeft, BsCaretRight, BsSkipEnd, BsSkipStart, BsXCircle } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { TbNumber1 } from 'react-icons/tb'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Props {
  availablePages: Array<number>
  pageNumber: number
  pagesNumber: number
  onePageStateTitle: string
  disabled: boolean
  shallowNavigation: boolean
  scroll: boolean
}

export const PaginationBar: FC<Partial<Props>
  & Pick<Props, 'availablePages' | 'pagesNumber' | 'pageNumber' >> = ({
    availablePages,
    pagesNumber,
    pageNumber,
    onePageStateTitle,
    disabled = false,
    shallowNavigation = true,
    scroll = true,
  }) => {
    const { t } = useTranslation('pagination_bar')

    const { pathname, query } = useRouter()

    const buildQuery = (page: number) => {
      const newQuery = { ...query }

      if (page === 1) {
        delete newQuery.page
      } else {
        newQuery.page = String(page)
      }

      return newQuery
    }

    const pageElements = useMemo(() => {
      return availablePages.map((availablePage) => {
        return (
          <li className={ `
          ${styles.paginationBar__pageNumberItem}
          ${availablePage === pageNumber ? styles.paginationBar__pageNumberItem_currentPage : ''}
        ` }
            title={ t('n_page_button_title', { pageNumber: availablePage }) }
            key={ t('n_page_button_title', { pageNumber: availablePage }) }
          >
            <Link href={ { pathname, query: buildQuery(availablePage) } }
              className={ `
                ${styles.paginationBar__pageNumberLink}
                ${availablePage === pageNumber ? styles.paginationBar__pageNumberLink_currentPage : ''}
              ` }
              scroll={ scroll }
              shallow={ shallowNavigation }
            >
              { availablePage }
            </Link>
          </li>
        )
      })
    }, [pageNumber, pagesNumber, availablePages])

    if (availablePages.length === 1) {
      if (onePageStateTitle && !disabled) {
        return (
          <span className={ styles.paginationBar__noPaginatedState }>
            <TbNumber1 className={ styles.paginationBar__noPaginatedStateIcon }/>
            { onePageStateTitle }
          </span>
        )
      }

      return null
    }

    const errorState: ReactElement = (
      <div className={ styles.paginationBar__errorState }>
        <BsXCircle className={ styles.paginationBar__errorIcon }/>
        { t('error_state_description') }
        <Link
          href={ { pathname, query: buildQuery(1) } }
          className={ styles.paginationBar__errorButton }
          title={ t('error_state_button_title') }
        >
          { t('error_state_button_title') }
        </Link>
      </div>
    )

    return (
      pageNumber > pagesNumber && !disabled
        ? errorState
        : <div className={ styles.paginationBar__container }>
          <ul className={ styles.paginationBar__listContainer }>
            <li className={ `
              ${styles.paginationBar__pageNumberItem}
              ${disabled || (pageNumber === 1) ? styles.paginationBar__leftPageButtonHide : ''}
            ` }
              title={ t('first_page_button_title') }
              key={ t('first_page_button_title') }
            >
              <Link href={ { pathname, query: buildQuery(1) } }
                className={ styles.paginationBar__pageNumberLink }
                scroll={ scroll }
                shallow={ shallowNavigation }
              >
                <BsSkipStart className={ styles.paginationBar__stepIcon }/>
              </Link>
            </li>

            <li className={ `
              ${styles.paginationBar__pageNumberItem}
              ${disabled || (pageNumber === 1) ? styles.paginationBar__leftPageButtonHide : ''}
            ` }
              key={ t('previous_page_button_title') }
              title={ t('previous_page_button_title') }
            >
              <Link href={ { pathname, query: buildQuery(pageNumber - 1) } }
                className={ styles.paginationBar__pageNumberLink }
                scroll={ scroll }
                shallow={ shallowNavigation }
              >
                <BsCaretLeft className={ styles.paginationBar__stepIcon }/>
              </Link>
            </li>

            { pageElements }

            <li className={ `
              ${styles.paginationBar__pageNumberItem}
              ${disabled || (pageNumber === pagesNumber) ? styles.paginationBar__rightPageButtonHide : ''}
            ` }
              key={ t('next_page_button_title') }
              title={ t('next_page_button_title') }
            >
              <Link href={ { pathname, query: buildQuery(pageNumber + 1) } }
                className={ styles.paginationBar__pageNumberLink }
                scroll={ scroll }
                shallow={ shallowNavigation }
              >
                <BsCaretRight className={ styles.paginationBar__stepIcon }/>
              </Link>
            </li>

            <li className={ `
              ${styles.paginationBar__pageNumberItem}
              ${disabled || (pageNumber === pagesNumber) ? styles.paginationBar__rightPageButtonHide : ''}
            ` }
              key={ t('last_page_button_title') }
              title={ t('last_page_button_title') }
            >
              <Link href={ { pathname, query: buildQuery(pagesNumber) } }
                className={ styles.paginationBar__pageNumberLink }
                scroll={ scroll }
                shallow={ shallowNavigation }
              >
                <BsSkipEnd className={ styles.paginationBar__stepIcon }/>
              </Link>
            </li>
          </ul>
        </div>
    )
  }

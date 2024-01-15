import { FC, ReactElement, useMemo } from 'react'
import styles from './PaginationBar.module.scss'
import { BsCaretLeft, BsCaretRight, BsSkipEnd, BsSkipStart, BsXCircle } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { TbNumber1 } from 'react-icons/tb'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'

interface Props {
  availablePages: Array<number>
  pageNumber: number
  pagesNumber: number
  onePageStateTitle: string
  disabled: boolean
  linkMode: ElementLinkMode
  onPageChange: (page: number) => void
}

export const PaginationBar: FC<Partial<Props>
  & Pick<Props, 'availablePages' | 'pagesNumber' | 'pageNumber' | 'linkMode'>> = ({
    availablePages,
    pagesNumber,
    pageNumber,
    onePageStateTitle,
    linkMode,
    disabled = false,
    onPageChange = undefined,
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
            onClick={ () => { if (onPageChange) { onPageChange(availablePage) } } }
          >
            <Link href={ { pathname, query: buildQuery(availablePage) } }
              className={ `
                ${styles.paginationBar__pageNumberLink}
                ${availablePage === pageNumber ? styles.paginationBar__pageNumberLink_currentPage : ''}
              ` }
              scroll={ linkMode.scrollOnClick }
              shallow={ linkMode.shallowNavigation }
              replace={ linkMode.replace }
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
          shallow={ linkMode.shallowNavigation }
          scroll={ linkMode.scrollOnClick }
          replace={ true }
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
              onClick={ () => { if (onPageChange) { onPageChange(1) } } }
            >
              <Link href={ { pathname, query: buildQuery(1) } }
                className={ styles.paginationBar__pageNumberLink }
                scroll={ linkMode.scrollOnClick }
                shallow={ linkMode.shallowNavigation }
                replace={ linkMode.replace }
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
              onClick={ () => { if (onPageChange) { onPageChange(pageNumber - 1) } } }
            >
              <Link href={ { pathname, query: buildQuery(pageNumber - 1) } }
                className={ styles.paginationBar__pageNumberLink }
                scroll={ linkMode.scrollOnClick }
                shallow={ linkMode.shallowNavigation }
                replace={ linkMode.replace }
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
              onClick={ () => { if (onPageChange) { onPageChange(pageNumber + 1) } } }
            >
              <Link href={ { pathname, query: buildQuery(pageNumber + 1) } }
                className={ styles.paginationBar__pageNumberLink }
                scroll={ linkMode.scrollOnClick }
                shallow={ linkMode.shallowNavigation }
                replace={ linkMode.replace }
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
              onClick={ () => { if (onPageChange) { onPageChange(pagesNumber) } } }
            >
              <Link href={ { pathname, query: buildQuery(pagesNumber) } }
                className={ styles.paginationBar__pageNumberLink }
                scroll={ linkMode.scrollOnClick }
                shallow={ linkMode.shallowNavigation }
                replace={ linkMode.replace }
              >
                <BsSkipEnd className={ styles.paginationBar__stepIcon }/>
              </Link>
            </li>
          </ul>
        </div>
    )
  }

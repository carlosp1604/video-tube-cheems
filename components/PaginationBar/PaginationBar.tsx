import { FC, ReactElement, useMemo } from 'react'
import styles from './PaginationBar.module.scss'
import { BsCaretLeft, BsCaretRight, BsSkipEnd, BsSkipStart, BsXCircle } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { TbNumber1 } from 'react-icons/tb'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PaginationBarButton } from '~/components/PaginationBar/PaginationBarButton/PaginationBarButton'

interface Props {
  pageNumber: number
  pagesNumber: number
  onePageStateTitle: string
  disabled: boolean
  linkMode: ElementLinkMode
  onPageChange: (page: number) => void
}

export const PaginationBar: FC<Partial<Props> & Pick<Props, 'pagesNumber' | 'pageNumber' | 'linkMode'>> = ({
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

  const availablePages = useMemo(() => {
    return PaginationHelper.getShowablePages(
      pageNumber, pagesNumber)
  }, [pageNumber, pagesNumber])

  const pageElements = availablePages.map((availablePage) => {
    return (
      <PaginationBarButton
        title={ t('n_page_button_title', { pageNumber: availablePage }) }
        linkTitle={ String(availablePage) }
        href={ { pathname, query: buildQuery(availablePage) } }
        active={ availablePage === pageNumber }
        linkMode={ linkMode }
        onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(availablePage) } } }
        key={ t('n_page_button_title', { pageNumber: availablePage }) }
        disabled={ disabled }
      />
    )
  })

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

  let content: ReactElement

  if (pageNumber > pagesNumber && !disabled) {
    content = (
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
  } else {
    content = (
      <div className={ styles.paginationBar__container }>
        <ul className={ styles.paginationBar__listContainer }>
          <PaginationBarButton
            title={ t('first_page_button_title') }
            linkTitle={ <BsSkipStart className={ styles.paginationBar__stepIcon }/> }
            href={ { pathname, query: buildQuery(1) } }
            active={ false }
            linkMode={ linkMode }
            onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(1) } } }
            key={ t('first_page_button_title') }
            disabled={ disabled || pageNumber === 1 }
            hideDirection={ 'left' }
          />
          <PaginationBarButton
            title={ t('previous_page_button_title') }
            linkTitle={ <BsCaretLeft className={ styles.paginationBar__stepIcon }/> }
            href={ { pathname, query: buildQuery(pageNumber - 1) } }
            active={ false }
            linkMode={ linkMode }
            onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(pageNumber - 1) } } }
            key={ t('previous_page_button_title') }
            disabled={ disabled || pageNumber === 1 }
            hideDirection={ 'left' }
          />

          { pageElements }

          { !(availablePages.includes(pagesNumber))
            ? <PaginationBarButton
              title={ t('n_page_button_title', { pageNumber: pagesNumber }) }
              linkTitle={ String(pagesNumber) }
              href={ { pathname, query: buildQuery(pagesNumber) } }
              active={ pagesNumber === pageNumber }
              linkMode={ linkMode }
              onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(pagesNumber) } } }
              key={ t('n_page_button_title', { pageNumber: pagesNumber }) }
              disabled={ disabled }
            />
            : null
          }

          <PaginationBarButton
            title={ t('next_page_button_title') }
            linkTitle={ <BsCaretRight className={ styles.paginationBar__stepIcon }/> }
            href={ { pathname, query: buildQuery(pageNumber + 1) } }
            active={ false }
            linkMode={ linkMode }
            onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(pageNumber - 1) } } }
            key={ t('next_page_button_title') }
            disabled={ disabled || pageNumber === pagesNumber }
            hideDirection={ 'right' }
          />

          <PaginationBarButton
            title={ t('last_page_button_title') }
            linkTitle={ <BsSkipEnd className={ styles.paginationBar__stepIcon }/> }
            href={ { pathname, query: buildQuery(pageNumber + 1) } }
            active={ false }
            linkMode={ linkMode }
            onClickButton={ () => { if (onPageChange && !disabled) { onPageChange(pageNumber - 1) } } }
            key={ t('last_page_button_title') }
            disabled={ disabled || pageNumber === pagesNumber }
            hideDirection={ 'right' }
          />
        </ul>
      </div>
    )
  }

  return (content)
}

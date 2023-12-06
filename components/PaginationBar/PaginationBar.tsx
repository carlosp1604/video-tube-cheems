import { FC, ReactElement } from 'react'
import styles from './PaginationBar.module.scss'
import { BsCaretLeft, BsCaretRight, BsSkipEnd, BsSkipStart, BsXCircle } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { TbNumber1 } from 'react-icons/tb'

interface Props {
  availablePages: Array<number>
  pageNumber: number
  pagesNumber: number
  onPageNumberChange: (pageNumber: number) => void
  onePageStateTitle: string
}

export const PaginationBar: FC<Partial<Props>
  & Pick<Props, 'availablePages' | 'pagesNumber' | 'pageNumber' | 'onPageNumberChange'>> = ({
    availablePages,
    pagesNumber,
    pageNumber,
    onPageNumberChange,
    onePageStateTitle,
  }) => {
    const { t } = useTranslation('pagination_bar')

    if (availablePages.length === 1) {
      if (onePageStateTitle) {
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
      <button
        className={ styles.paginationBar__errorButton }
        onClick={ () => onPageNumberChange(1) }
        title={ t('error_state_button_title') }
      >
        { t('error_state_button_title') }
      </button>
    </div>
    )

    const handleChange = (newPageNumber: number) => {
      if (newPageNumber !== pageNumber) {
        onPageNumberChange(newPageNumber)
      }
    }

    return (
      pageNumber > pagesNumber
        ? errorState
        : <div className={ styles.paginationBar__container }>
        <button
          className={ `
          ${styles.paginationBar__stepPageButton}
          ${pageNumber === 1 ? styles.paginationBar__leftPageButtonHide : ''}
        ` }
          disabled={ pageNumber === 1 }
          onClick={ () => handleChange(1) }
          title={ t('first_page_button_title') }
        >
          <BsSkipStart/>
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
          <BsCaretLeft/>
        </button>
        { availablePages.map((page) => {
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
          <BsCaretRight/>
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
          <BsSkipEnd/>
        </button>
      </div>
    )
  }

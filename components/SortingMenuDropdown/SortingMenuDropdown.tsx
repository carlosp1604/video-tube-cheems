import { FC, useMemo, useState } from 'react'
import styles from './SortingMenuDropdown.module.scss'
import { BsSortDown } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { IconButton } from '~/components/IconButton/IconButton'
import { PostsPaginationQueryParams } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
  activeOption: PostsPaginationSortingType
  options: PostsPaginationSortingType[]
  loading: boolean
  visible: boolean
  scrollOnClick: boolean
  shallowNavigation: boolean
}

export const SortingMenuDropdown: FC<Partial<Props>
  & Omit<Props, 'loading' | 'visible' | 'scrollOnClick' | 'shallowNavigation'>> = ({
    activeOption,
    options,
    loading = false,
    visible = true,
    scrollOnClick = true,
    shallowNavigation = false,
  }) => {
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const { t } = useTranslation('sorting_menu_dropdown')

    const { pathname, query } = useRouter()

    const componentActiveSortingOption = useMemo(() =>
      PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(activeOption),
    [activeOption])

    return (
    <div className={ `
      ${styles.sortingMenuDropdown__container}
      ${visible || loading ? styles.sortingMenuDropdown__container_visible : ''}
    ` }>
      <span className={ styles.sortingMenuDropdown__dropdownButton }>
        <IconButton
          onClick={ () => setOpenMenu(!openMenu) }
          icon={ <BsSortDown /> }
          title={ t('dropdown_sort_button_title', { criteria: t(componentActiveSortingOption.translationKey) }) }
          disabled={ loading }
        />
        { loading
          ? <span className={ styles.sortingMenuDropdown__currentOrderTitleSkeleton } />
          : t(componentActiveSortingOption.translationKey)
        }
      </span>

      <ul className={ `
        ${styles.sortingMenuDropdown__dropdownContainer}
        ${openMenu && !loading ? styles.sortingMenuDropdown__dropdownContainer_open : ''}
      ` }
        onMouseLeave={ () => setOpenMenu(false) }
        onClick={ () => setOpenMenu(!openMenu) }
      >
        { options.map((option) => {
          const componentOption = PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(option)

          const newQuery = { ...query }

          delete newQuery.page
          newQuery.order = option

          return (
            <li
              className={ styles.sortingMenuDropdown__dropdownItem }
              title={ t('dropdown_sort_option_title', { criteria: t(componentOption.translationKey) }) }
              key={ componentOption.translationKey }
            >
              <Link
                className={ ` ${styles.sortingMenuDropdown__dropdownItemLink}
                  ${componentOption.translationKey === componentActiveSortingOption.translationKey
                    ? styles.sortingMenuDropdown__dropdownItemLink_active
                    : ''}
                ` }
                href={ { pathname, query: newQuery } }
                scroll={ scrollOnClick }
                shallow={ shallowNavigation }
              >
                { t(componentOption.translationKey) }
              </Link>
            </li>
          )
        }) }
      </ul>
    </div>
    )
  }

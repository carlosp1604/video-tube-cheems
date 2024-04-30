import { FC, ReactElement, useMemo, useState } from 'react'
import styles from './SortingMenuDropdown.module.scss'
import { BsSortDown } from 'react-icons/bs'
import useTranslation from 'next-translate/useTranslation'
import { IconButton } from '~/components/IconButton/IconButton'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { usePathname } from 'next/navigation'

interface Props {
  activeOption: PaginationSortingType
  options: PaginationSortingType[]
  loading: boolean
  visible: boolean
  linkMode: ElementLinkMode | undefined
  onClickOption: ((option: PaginationSortingType) => void) | undefined
}
export const SortingMenuDropdown: FC<Partial<Props>
  & Omit<Props, 'loading' | 'visible' | 'linkMode' | 'onClickOption'>> = ({
    activeOption,
    options,
    loading = false,
    visible = true,
    linkMode = undefined,
    onClickOption = undefined,
  }) => {
    const [openMenu, setOpenMenu] = useState<boolean>(false)

    const { t } = useTranslation('sorting_menu_dropdown')
    const { query } = useRouter()
    const pathname = usePathname()

    const componentActiveSortingOption = useMemo(() =>
      fromOrderTypeToComponentSortingOption(activeOption),
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
          const componentOption = fromOrderTypeToComponentSortingOption(option)

          let content: ReactElement = (
            <span className={ `
              ${styles.sortingMenuDropdown__dropdownItemLink}
              ${componentOption.translationKey === componentActiveSortingOption.translationKey
              ? styles.sortingMenuDropdown__dropdownItemLink_active
              : ''} ` }
            >
              { t(componentOption.translationKey) }
            </span>
          )

          if (linkMode) {
            const newQuery = { ...query }

            delete newQuery.page
            newQuery.order = String(option)

            const search = new URLSearchParams()

            Object.entries(newQuery).forEach(([key, value]) => {
              search.append(key, `${value}`)
            })

            content = (
              <Link className={ `${styles.sortingMenuDropdown__dropdownItemLink}
                ${componentOption.translationKey === componentActiveSortingOption.translationKey
                ? styles.sortingMenuDropdown__dropdownItemLink_active
                : ''} ` }
                href={ `${pathname}?${search.toString()}` }
                scroll={ linkMode.scrollOnClick }
                shallow={ linkMode.shallowNavigation }
                replace={ linkMode.replace }
              >
                { t(componentOption.translationKey) }
              </Link>
            )
          }

          return (
            <li
              className={ styles.sortingMenuDropdown__dropdownItem }
              title={ t('dropdown_sort_option_title', { criteria: t(componentOption.translationKey) }) }
              key={ componentOption.translationKey }
              onClick={ () => { if (onClickOption) { onClickOption(option) } } }
            >
              { content }
            </li>
          )
        }) }
      </ul>
    </div>
    )
  }

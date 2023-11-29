import { FC, useMemo, useState } from 'react'
import styles from './SortingMenuDropdown.module.scss'
import { BsSortDown } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { IconButton } from '~/components/IconButton/IconButton'
import { PostsPaginationQueryParams } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationQueryParams'
import { PostsPaginationSortingType } from '~/modules/Shared/Infrastructure/FrontEnd/PostsPaginationSortingType'

interface Props {
  activeOption: PostsPaginationSortingType
  onChangeOption: (option: PostsPaginationSortingType) => void
  options: PostsPaginationSortingType[]
}

export const SortingMenuDropdown: FC<Props> = ({ activeOption, onChangeOption, options }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const { t } = useTranslation('sorting_menu_dropdown')

  const componentActiveSortingOption = useMemo(() =>
    PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(activeOption),
  [activeOption])

  return (
    <div className={ styles.sortingMenuDropdown__container }>
      <span className={ styles.sortingMenuDropdown__dropdownButton }>
        <IconButton
          onClick={ () => setOpenMenu(!openMenu) }
          icon={ <BsSortDown /> }
          title={ t('dropdown_sort_button_title', { criteria: t(componentActiveSortingOption.translationKey) }) }
        />
        { t(componentActiveSortingOption.translationKey) }
      </span>

      <div className={ `
        ${styles.sortingMenuDropdown__dropdownContainer}
        ${openMenu ? styles.sortingMenuDropdown__dropdownContainer_open : ''}
      ` }
        onMouseLeave={ () => setOpenMenu(false) }
        onClick={ () => setOpenMenu(!openMenu) }
      >
        { options.map((option) => {
          const componentOption = PostsPaginationQueryParams.fromOrderTypeToComponentSortingOption(option)

          return (
            <span
              key={ componentOption.translationKey }
              className={ `
              ${styles.sortingMenuDropdown__dropdownItem}
              ${componentOption.translationKey === componentActiveSortingOption.translationKey
                ? styles.sortingMenuDropdown__dropdownItem_active
                : ''}
            ` }
              onClick={ () => { if (activeOption !== option) { onChangeOption(option) } } }
              title={ t('dropdown_sort_option_title', { criteria: t(componentOption.translationKey) }) }
            >
              { t(componentOption.translationKey) }
            </span>
          )
        }) }
      </div>
    </div>
  )
}

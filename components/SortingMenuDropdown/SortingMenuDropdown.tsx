import { FC, useState } from 'react'
import styles from './SortingMenuDropdown.module.scss'
import { BsFilter } from 'react-icons/bs'
import { SortingOption } from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { useTranslation } from 'next-i18next'

interface Props {
  activeOption: SortingOption
  onChangeOption: (option: SortingOption) => void
  options: SortingOption[]
}

export const SortingMenuDropdown: FC<Props> = ({ activeOption, onChangeOption, options }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const { t } = useTranslation('sorting_menu_dropdown')

  return (
    <div
      className={ styles.sortingMenuDropdown__container }
      onClick={ () => setOpenMenu(!openMenu) }
    >
      <button className={ styles.sortingMenuDropdown__dropdownButton }>
        <BsFilter className={ styles.sortingMenuDropdown__dropdownButtonIcon }/>
      </button>
      <div className={ `
        ${styles.sortingMenuDropdown__dropdownContainer}
        ${openMenu ? styles.sortingMenuDropdown__dropdownContainer_open : ''}
      ` }>
        { options.map((option) => {
          return (
            <span
              key={ option.translationKey }
              className={ `
              ${styles.sortingMenuDropdown__dropdownItem}
              ${option.translationKey === activeOption.translationKey
                ? styles.sortingMenuDropdown__dropdownItem_active
                : ''}
            ` }
              onClick={ () => onChangeOption(option) }
            >
              { t(option.translationKey) }
            </span>
          )
        }) }
      </div>
    </div>
  )
}

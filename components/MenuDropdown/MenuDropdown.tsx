import { Dispatch, FC, ReactElement, SetStateAction } from 'react'
import styles from './MenuDropdown.module.scss'

export interface MenuDropdownOption {
  title: string
  onClick: () => void
  icon: ReactElement
}

interface Props {
  title: string
  buttonIcon: ReactElement
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  options: MenuDropdownOption[]
}

export const MenuDropdown: FC<Props> = ({ title, buttonIcon, isOpen, setIsOpen, options }) => {
  return (
    <div
      className={ styles.menuDropdown__container }
      onClick={ () => setIsOpen(!isOpen) }
      title={ title }
    >
      { buttonIcon }
      <div className={ `
        ${styles.menuDropdown__dropdownContainer}
        ${isOpen ? styles.menuDropdown__dropdownContainer_open : ''}
      ` }
         onMouseLeave={ () => setIsOpen(false) }
      >
        { options.map((option) => {
          return (
            <span
              key={ option.title }
              className={ styles.menuDropdown__dropdownItem }
              onClick={ () => option.onClick() }
              title={ option.title }
            >
              { option.icon }
              { option.title }
            </span>
          )
        }) }
      </div>
    </div>
  )
}

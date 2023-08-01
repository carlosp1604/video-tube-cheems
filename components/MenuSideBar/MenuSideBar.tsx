import { FC, useState } from 'react'
import styles from './MenuSideBar.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getMobileMenuOptions } from '~/components/AppMenu/MobileMenuOptions'
import { MenuOptionInterface } from '~/components/MenuOptions/MenuOptionInterface'
import { useTranslation } from 'next-i18next'
import { BsList } from 'react-icons/bs'

interface MenuSideBarOptionProps {
  menuOption: MenuOptionInterface
  menuOpen: boolean
}

const MenuSideBarOption: FC<MenuSideBarOptionProps> = ({ menuOption, menuOpen }) => {
  const { t } = useTranslation('menu_options')

  return (
    <div className={ `
      ${styles.menuSideBar__menuItem}
      ${menuOption.isActive ? styles.menuSideBar__menuItem_active : ''}
      ` }
       key={ menuOption.translationKey }
       onClick={ menuOption.onClick }
    >
      <Link
        href={ menuOption.action }
        className={ `
          ${styles.menuSideBar__menuItemContent}
          ${menuOpen ? styles.menuSideBar__menuItemContent_open : ''}
        ` }
      >
        <span className={ styles.menuSideBar__menuItemIcon }>
          { menuOption.icon }
        </span>
        <span className={ `
          ${styles.menuSideBar__menuItemText}
          ${menuOpen ? styles.menuSideBar__menuItemText_open : ''}
        ` }>
          { t(menuOption.translationKey) }
        </span>
      </Link>
    </div>
  )
}

export const MenuSideBar: FC = () => {
  const { pathname } = useRouter()

  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  return (
    <aside className={ styles.menuSideBar__container }>
      <div className={ `
        ${styles.menuSideBar__asideSlideOut}
        ${menuOpen ? styles.menuSideBar__asideSlideOut_open : ''}
      ` }>
        <BsList
          className={ styles.menuSideBar__menuIcon }
          onClick={ () => setMenuOpen(!menuOpen) }
        />
        <div className={ `
          ${styles.menuSideBar__menuContainer}
          ${menuOpen ? styles.menuSideBar__menuContainer_open : ''}
        ` }>
          { getMobileMenuOptions(pathname).map((menuOption) => {
            return (
              <MenuSideBarOption
                menuOption={ menuOption }
                menuOpen={ menuOpen }
                key={ menuOption.translationKey }
              />
            )
          }) }
        </div>

        <div className={ `
          ${styles.menuSideBar__copyrightContainer}
          ${menuOpen ? styles.menuSideBar__copyrightContainer_open : ''}
        ` }>
          Cheems © 2023.
        </div>

      </div>
    </aside>
  )
}

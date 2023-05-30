import { FC } from 'react'
import styles from './MenuSideBar.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getMobileMenuOptions } from '~/components/AppMenu/MobileMenuOptions'
import { MenuOptionInterface } from '~/components/MenuOptions/MenuOptionInterface'
import { useTranslation } from 'next-i18next'

interface MenuSideBarOptionProps {
  menuOption: MenuOptionInterface
}

const MenuSideBarOption: FC<MenuSideBarOptionProps> = ({ menuOption }) => {
  const { t } = useTranslation('menu_options')

  return (
    <div className={ `
      ${styles.menuSideBar__menuItem}
      ${menuOption.isActive ? styles.menuSideBar__menuItemActive : ''}
      ` }
       key={ menuOption.translationKey }
       onClick={ menuOption.onClick }
    >
      <Link
        href={ menuOption.action }
        className={ styles.menuSideBar__menuItemContent }
      >
        <span className={ styles.menuSideBar__menuItemIcon }>
          { menuOption.icon }
        </span>
        { t(menuOption.translationKey) }
      </Link>
    </div>
  )
}

export const MenuSideBar: FC = () => {
  const { pathname } = useRouter()

  return (
    <aside className={ styles.menuSideBar__container }>
      <div className={ styles.menuSideBar__asideSlideOut }>
        <div className={ styles.menuSideBar__logoContainer }>
          <img
            className={ styles.menuSideBar__logo }
            src='/img/cheems-logo.png'
          />
        </div>

        <div className={ styles.menuSideBar__menuContainer }>
          { getMobileMenuOptions(pathname).map((menuOption) => {
            return (
              <MenuSideBarOption
                menuOption={ menuOption }
                key={ menuOption.translationKey }
              />
            )
          }) }
        </div>

        <div className={ styles.menuSideBar__footerContainer }>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={ '/' }
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={ '/' }
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={ '/' }
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={ '/' }
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={ '/' }
          >
            Home
          </Link>
          <Link
            className={ styles.menuSideBar__footerItem }
            href={ '/' }
          >
            Home
          </Link>
        </div>

        <div className={ styles.menuSideBar__copyrightContainer }>
          Cheems © 2023. Made with ❤️ by CP.
        </div>

      </div>
    </aside>
  )
}

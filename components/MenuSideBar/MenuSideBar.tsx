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
        <span className={ styles.menuSideBar__menuItemText }>
          { t(menuOption.translationKey) }
        </span>
      </Link>
    </div>
  )
}

export const MenuSideBar: FC = () => {
  const { pathname } = useRouter()

  return (
    <aside className={ styles.menuSideBar__container }>
      <div className={ styles.menuSideBar__asideSlideOut }>
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

        <div className={ styles.menuSideBar__copyrightContainer }>
          Cheems © 2023.
        </div>

      </div>
    </aside>
  )
}

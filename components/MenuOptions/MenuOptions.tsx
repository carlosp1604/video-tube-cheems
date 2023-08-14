import { FC } from 'react'
import styles from './MenuOptions.module.scss'
import Link from 'next/link'
import { MenuOptionInterface } from '~/components/MenuOptions/MenuOptionInterface'
import { useTranslation } from 'next-i18next'

interface Props {
  menuOptions: MenuOptionInterface[]
}

export const MenuOptions: FC<Props> = ({ menuOptions }) => {
  const { t } = useTranslation('menu')

  return (
    <div className={ styles.menuOptions__menuContainer }>
      { menuOptions.map((menuOption) => {
        return (
          <div className={ `
            ${styles.menuOptions__menuItem}
            ${menuOption.isActive ? styles.menuOptions__menuItemActive : ''}
          ` }
            key={ menuOption.translationKey }
            onClick={ menuOption.onClick }
          >
            <Link
              href={ menuOption.action }
              className={ styles.menuOptions__menuItemContent }
            >
              <span className={ styles.menuOptions__menuIcon }>
                { menuOption.icon }
              </span>

              { t(menuOption.translationKey) }
            </Link>
          </div>
        )
      }) }
    </div>
  )
}

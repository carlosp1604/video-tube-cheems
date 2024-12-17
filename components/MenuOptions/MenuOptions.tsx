import { FC, ReactElement } from 'react'
import styles from './MenuOptions.module.scss'
import Link from 'next/link'

export interface ActionInterface {
  url: string
  blank: boolean
}

export interface MenuOptionComponentInterface {
  isActive: boolean
  title: string
  action: ActionInterface | undefined
  picture: ReactElement
  onClick: (() => void) | undefined
}

interface Props {
  menuOptions: MenuOptionComponentInterface[]
}

export const MenuOptions: FC<Props> = ({ menuOptions }) => {
  const buildOptionContent = (menuOption: MenuOptionComponentInterface): ReactElement => {
    if (menuOption.action) {
      return (
        <div
          className={ styles.menuOptions__menuItemContent }
          key={ menuOption.title }
        >
          <Link
            href={ menuOption.action.url }
            className={ `
              ${styles.menuOptions__itemContent} 
              ${menuOption.isActive ? styles.menuOptions__itemContent_active : ''}  
            ` }
            target={ menuOption.action.blank ? '_blank' : '_self' }
            onClick={ menuOption.onClick }
          >
            <div className={ styles.menuOptions__menuIconWraper }>
              { menuOption.picture }
            </div>
            { menuOption.title }
          </Link>
        </div>
      )
    }

    return (
      <div
        className={ styles.menuOptions__menuItemContent }
        key={ menuOption.title }
      >
        <div
          className={ `
            ${styles.menuOptions__itemContent}
            ${menuOption.isActive ? styles.menuOptions__itemContent_active : ''}
          ` }
          onClick={ menuOption.onClick }
        >
          <div className={ styles.menuOptions__menuIconWraper }>
            { menuOption.picture }
          </div>
          { menuOption.title }
        </div>
      </div>
    )
  }

  return (
        <div className={ styles.menuOptions__menuContainer }>
          { menuOptions.map((menuOption) => {
            return buildOptionContent(menuOption)
          }) }
        </div>
  )
}

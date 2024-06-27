import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'
import { FC, ReactElement, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ReactDOM from 'react-dom'
import Link from 'next/link'
import styles from './MenuSideBarOption.module.scss'
import { Tooltip } from '~/components/Tooltip/Tooltip'

interface Props {
  menuOption: MenuOptionComponentInterface
  menuOpen: boolean
}

export const MenuSideBarOption: FC<Props> = ({ menuOption, menuOpen }) => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuidv4())
  }, [])

  const buildPortal = (component: ReactElement) => {
    return ReactDOM.createPortal(component, document.getElementById('tooltip-container') as HTMLElement)
  }

  if (menuOption.action) {
    return (
      <Link
        href={ menuOption.action.url }
        className={ `
          ${styles.menuSidebarOption__menuItemContent}
          ${menuOpen ? styles.menuSidebarOption__menuItemContent__open : ''}
          ${menuOption.isActive ? styles.menuSidebarOption__menuItemContent__active : ''}
        ` }
        target={ menuOption.action.blank ? '_blank' : '_self' }
        data-tooltip-id={ tooltipId }
        data-tooltip-content={ menuOption.title }
      >
        { !menuOpen && mounted
          ? buildPortal(<Tooltip
            tooltipId={ tooltipId }
            place={ 'right' }
          />)
          : null
        }
        <span className={ styles.menuSidebarOption__menuItemIcon }>
        { menuOption.picture }
      </span>
        <span className={ `
        ${styles.menuSidebarOption__menuItemText}
        ${menuOpen ? styles.menuSidebarOption__menuItemText__open : ''}
      ` }>
        { menuOption.title }
      </span>
      </Link>
    )
  }

  if (menuOption.onClick) {
    return (
      <div
        className={ `
        ${styles.menuSidebarOption__menuItemContent}
        ${menuOpen ? styles.menuSidebarOption__menuItemContent__open : ''}
        ${menuOption.isActive ? styles.menuSidebarOption__menuItemContent__active : ''}
      ` }
        onClick={ menuOption.onClick }
        data-tooltip-id={ tooltipId }
        data-tooltip-content={ menuOption.title }
      >
        { !menuOpen && mounted
          ? buildPortal(<Tooltip
            tooltipId={ tooltipId }
            place={ 'right' }
          />)
          : null
        }
        <span className={ styles.menuSidebarOption__menuItemIcon }>
        { menuOption.picture }
      </span>
        <span className={ `
        ${styles.menuSidebarOption__menuItemText}
        ${menuOpen ? styles.menuSidebarOption__menuItemText__open : ''}
      ` }>
        { menuOption.title }
      </span>
      </div>
    )
  }

  return null
}

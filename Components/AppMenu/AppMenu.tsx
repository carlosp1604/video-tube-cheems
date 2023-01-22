import { FC } from 'react'
import styles from './AppMenu.module.scss'
import Link from 'next/link'

export const AppMenu: FC = () => {
  return (
    <nav className={ styles.appMenu__layer }>
      <div className={ styles.appMenu__container}>
        <Link href='/'>
          <img
            className={ styles.appMenu__logoImage }
            src='/img/cheems-logo.png'
          />
        </Link>
      </div>
    </nav>
  )
}
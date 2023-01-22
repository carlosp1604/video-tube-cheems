import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { AppMenu } from '../Components/AppMenu/AppMenu'
import styles from '/styles/pages/_app.module.scss'
import { FloatingActionAppMenu } from '../Components/FloatingActionAppMenu/FloatingActionAppMenu'
import { MenuSideBar } from '../Components/MenuSideBar/MenuSideBar'
import { useState } from 'react'
import { MobileMenu } from '../Components/AppMenu/MobileMenu'

export default function App({ Component, pageProps }: AppProps) {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  return (
    <>
      <main className={ styles.app__layout } >
        <MenuSideBar />

        <div className={ styles.app__container }>
          <AppMenu />

          <MobileMenu openMenu={ openMenu } setOpenMenu={ setOpenMenu } />

          <FloatingActionAppMenu openMenu={ openMenu } setOpenMenu={ setOpenMenu }/>

          <Component {...pageProps} />
        </div>
      </main>
    </>
  )
}

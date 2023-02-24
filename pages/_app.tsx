import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { AppMenu } from '../Components/AppMenu/AppMenu'
import styles from '/styles/pages/_app.module.scss'
import { FloatingActionAppMenu } from '../Components/FloatingActionAppMenu/FloatingActionAppMenu'
import { MenuSideBar } from '../Components/MenuSideBar/MenuSideBar'
import { useState } from 'react'
import { MobileMenu } from '../Components/AppMenu/MobileMenu'
import { AppFooter } from '../Components/AppFooter/AppFooter'
import { SessionProvider } from 'next-auth/react'
import UserProvider from '../modules/Auth/Infrastructure/Components/UserProvider'

export default function App({
  Component,
  pageProps: {
    session,
    ...pageProps
  } 
}: AppProps) {
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  
  return (
    <SessionProvider session={ session }>
      <UserProvider>
        <main className={ styles.app__layout } >
          <MenuSideBar />

          <div className={ styles.app__container }>
            <AppMenu />

            <MobileMenu openMenu={ openMenu } setOpenMenu={ setOpenMenu } />

            <FloatingActionAppMenu openMenu={ openMenu } setOpenMenu={ setOpenMenu }/>

            <Component {...pageProps} />

            <AppFooter />
          </div>
        </main>
      </UserProvider>
    </SessionProvider>
  )
}

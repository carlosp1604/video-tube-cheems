import '~/styles/globals.scss'
import type { AppProps } from 'next/app'
import { AppMenu } from '~/components/AppMenu/AppMenu'
import styles from '~/styles/pages/_app.module.scss'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import UserProvider from '~/modules/Auth/Infrastructure/Components/UserProvider'
import { MenuSideBar } from '~/components/MenuSideBar/MenuSideBar'
import { MobileMenu } from '~/components/AppMenu/MobileMenu'
import { FloatingActionAppMenu } from '~/components/FloatingActionAppMenu/FloatingActionAppMenu'
import { appWithTranslation } from 'next-i18next'

function App ({
  Component,
  pageProps: {
    session,
    ...pageProps
  },
}: AppProps) {
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  return (
    <SessionProvider session={ session }>
      <UserProvider>
        <main className={ styles.app__layout } >
        <AppMenu />
          <MenuSideBar />
          <div className={ styles.app__container }>
            <MobileMenu
              openMenu={ openMenu }
              setOpenMenu={ setOpenMenu }
            />
            <FloatingActionAppMenu
              openMenu={ openMenu }
              setOpenMenu={ setOpenMenu }
            />
            <Component { ...pageProps } />
          </div>
        </main>
      </UserProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(App)

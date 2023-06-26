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
import { appWithTranslation, useTranslation } from 'next-i18next'
import { Settings } from 'luxon'

function App ({
  Component,
  pageProps: {
    session,
    ...pageProps
  },
}: AppProps) {
  const [openMenu, setOpenMenu] = useState<boolean>(false)

  const { i18n } = useTranslation()

  Settings.defaultLocale = i18n.language || 'en'

  // TODO: find the way to get user timezone and set it on Luxon Settings
  Settings.defaultZone = 'Europe/Madrid'

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

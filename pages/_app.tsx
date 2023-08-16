import '~/styles/globals.scss'
import type { AppProps } from 'next/app'
import styles from '~/styles/pages/_app.module.scss'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import UserProvider from '~/modules/Auth/Infrastructure/Components/UserProvider'
import { MobileMenu } from '~/components/AppMenu/MobileMenu'
import { FloatingActionAppMenu } from '~/components/FloatingActionAppMenu/FloatingActionAppMenu'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { Settings } from 'luxon'
import { Toaster } from 'react-hot-toast'
import LoginProvider from '~/modules/Auth/Infrastructure/Components/LoginProvider'
import { AppMenu } from '~/components/AppMenu/AppMenu'
import { MenuSideBar } from '~/components/MenuSideBar/MenuSideBar'

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
        <LoginProvider>
          <div className={ styles.app__layout }>
            <MenuSideBar />

            <MobileMenu
              openMenu={ openMenu }
              setOpenMenu={ setOpenMenu }
            />
            <FloatingActionAppMenu
              openMenu={ openMenu }
              setOpenMenu={ setOpenMenu }
            />
            <main className={ styles.app__container } >
              <Toaster
                position={ 'top-center' }
                containerStyle={ {
                  marginTop: '40px',
                } }
                toastOptions={ {
                  className: 'rounded-lg bg-brand-700 text-base-100 px-2 py-1 shadow-lg shadow-body',
                  iconTheme: {
                    secondary: '#FAFAF9',
                    primary: '#b88b5c',
                  },
                } }
              />
              <AppMenu />

              <Component { ...pageProps } />
            </main>
          </div>
        </LoginProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(App)

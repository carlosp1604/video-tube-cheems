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
import { Post } from '~/modules/Posts/Domain/Post'
import { ReactionableModel } from '~/modules/Reactions/Domain/ReactionableModel'
import { TranslatableModel } from '~/modules/Translations/Domain/TranslatableModel'
import { Roboto } from '@next/font/google'
import UsingRouterProvider from '~/modules/Shared/Infrastructure/Components/UsingRouterProvider'

function applyMixins (derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null)
      )
    })
  })
}

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
  style: 'normal',
  subsets: ['latin'],
})

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

  applyMixins(Post, [ReactionableModel, TranslatableModel])

  return (
    <SessionProvider session={ session }>
      <UserProvider>
        <UsingRouterProvider >
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
              <main className={ `
                ${styles.app__container}
                ${roboto.variable}
              ` } >
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
                    error: {
                      className: 'rounded-lg bg-[#DC143C] text-white px-2 py-1 shadow-lg shadow-body',
                      iconTheme: {
                        secondary: '#DC143C',
                        primary: '#FFA07A',
                      },
                    },
                  } }
                />
                <AppMenu />

                <Component { ...pageProps }/>
              </main>
            </div>
          </LoginProvider>
        </UsingRouterProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(App)

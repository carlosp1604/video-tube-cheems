import '~/styles/globals.scss'
import type { AppProps } from 'next/app'
import styles from '~/styles/pages/_app.module.scss'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { Settings } from 'luxon'
import LoginProvider from '~/modules/Auth/Infrastructure/Components/LoginProvider'
import { Post } from '~/modules/Posts/Domain/Post'
import { ReactionableModel } from '~/modules/Reactions/Domain/ReactionableModel'
import { TranslatableModel } from '~/modules/Translations/Domain/TranslatableModel'
import { Roboto } from '@next/font/google'
import UsingRouterProvider from '~/modules/Shared/Infrastructure/Components/UsingRouterProvider'
import 'react-tooltip/dist/react-tooltip.css'
import dynamic from 'next/dynamic'
import NextNProgress from 'nextjs-progressbar'
import { useRouter } from 'next/router'
import { Footer } from '~/components/Footer/Footer'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'

const AppMenu = dynamic(() => import('~/components/AppMenu/AppMenu')
  .then((module) => module.AppMenu)
)

const Toaster = dynamic(() => import('react-hot-toast')
  .then((module) => module.Toaster)
)

const MobileMenu = dynamic(() => import('~/components/AppMenu/MobileMenu')
  .then((module) => module.MobileMenu)
)

const MenuSideBar = dynamic(() => import('~/components/MenuSideBar/MenuSideBar')
  .then((module) => module.MenuSideBar)
)

const LanguageMenu = dynamic(() => import('~/modules/Shared/Infrastructure/Components/LanguageMenu/LanguageMenu')
  .then((module) => module.LanguageMenu)
)

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
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [openLanguageMenu, setOpenLanguageMenu] = useState<boolean>(false)

  const { i18n } = useTranslation()
  const { pathname } = useRouter()

  Settings.defaultLocale = i18n.language || 'en'

  // TODO: find the way to get user timezone and set it on Luxon Settings
  Settings.defaultZone = 'Europe/Madrid'

  applyMixins(Post, [ReactionableModel, TranslatableModel])

  /** Post video embed page **/
  if (pathname.startsWith('/posts/videos/embed')) {
    return (
      <main className={ styles.app__embedContainer }>
        <Component { ...pageProps }/>
      </main>
    )
  }

  return (
    <SessionProvider session={ session }>
      <UsingRouterProvider >
        <LoginProvider>
          <div className={ `${styles.app__layout} ${roboto.variable}` }>
            <Toaster
              position={ 'top-center' }
              containerStyle={ {
                marginTop: '40px',
              } }
              toastOptions={ {
                className: 'rounded-lg bg-brand-700 text-base-100 px-2 py-1 shadow-lg shadow-body font-roboto',
                iconTheme: {
                  secondary: '#FAFAF9',
                  primary: '#b88b5c',
                },
                error: {
                  className: 'rounded-lg bg-[#DC143C] text-white px-2 py-1 shadow-lg shadow-body font-roboto',
                  iconTheme: {
                    secondary: '#DC143C',
                    primary: '#FFA07A',
                  },
                },
              } }
            />

            <LanguageMenu isOpen={ openLanguageMenu } onClose={ () => setOpenLanguageMenu(false) }/>

            <MobileMenu
              setOpenLanguageMenu={ setOpenLanguageMenu }
              openMenu={ menuOpen }
              setOpenMenu={ setMenuOpen }
            />

            <NextNProgress
              color={ '#a06c3f' }
              options={ {
                showSpinner: false,
              } }
              showOnShallow={ true }
              height={ 2 }
            />

            <AppMenu onClickMenuButton={ () => setMenuOpen(!menuOpen) }/>

            <MenuSideBar
              menuOpen={ menuOpen }
              setOpenLanguageMenu={ setOpenLanguageMenu }
            />

            { /** Workaround to work with the sidebar fixed **/ }
            <div className={ `
              ${styles.app__mainLayout}
              ${menuOpen ? styles.app__mainLayout__open : ''}
              ${roboto.variable}
            ` }>
              <main className={ styles.app__container }>
                <Component { ...pageProps }/>
                <AppBanner />
              </main>
              <Footer/>
            </div>
          </div>
        </LoginProvider>
      </UsingRouterProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(App)

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
import { Roboto } from 'next/font/google'
import UsingRouterProvider from '~/modules/Shared/Infrastructure/Components/UsingRouterProvider'
import 'react-tooltip/dist/react-tooltip.css'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { AppFooter } from '~/components/AppFooter/AppFooter'
import { AppToast } from '~/components/AppToast/AppToast'
import { AppBanner } from '~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner'
import ReactGA from 'react-ga4'
import { AppProgressBar } from '~/components/AppProgressBar/AppProgressBar'
import Head from 'next/head'
import { TopMobileMenu } from '~/components/TopMobileMenu/TopMobileMenu'

const AppMenu = dynamic(() => import('~/components/AppMenu/AppMenu')
  .then((module) => module.AppMenu)
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

const LiveCams = dynamic(() => import('~/components/LiveCams/LiveCams')
  .then((module) => module.LiveCams)
)

const DetectAdBlock = dynamic(() => import('~/components/DetectAdBlock/DetectAdBlock')
  .then((module) => module.DetectAdBlock)
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

  // Environment var make sense only for production
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID) {
    ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID)
  }

  /** Post video embed page **/
  if (pathname.startsWith('/posts/videos/embed')) {
    return (
      <SessionProvider session={ session }>
        <main className={ styles.app__embedContainer }>
          <Component { ...pageProps }/>
        </main>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider session={ session }>
      <UsingRouterProvider >
        <LoginProvider>
          <div className={ `${styles.app__layout} ${roboto.variable}` }>
            <Head>
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <AppProgressBar />

            <AppToast />

            <LanguageMenu isOpen={ openLanguageMenu } onClose={ () => setOpenLanguageMenu(false) }/>

            <MobileMenu
              setOpenLanguageMenu={ setOpenLanguageMenu }
              openMenu={ menuOpen }
              setOpenMenu={ setMenuOpen }
            />

            <AppMenu onClickMenuButton={ () => setMenuOpen(!menuOpen) }/>

            <DetectAdBlock />

            <MenuSideBar
              menuOpen={ menuOpen }
              setOpenLanguageMenu={ setOpenLanguageMenu }
            />

            { /** Workaround to work with the sidebar fixed **/ }
            <div className={
              `${styles.app__mainLayout} ${menuOpen ? styles.app__mainLayout__open : ''} ${roboto.variable}` }
            >
              <main className={ styles.app__container }>
                <TopMobileMenu />

                <Component { ...pageProps }/>

                <LiveCams />
              </main>

              <AppBanner />

              <AppFooter/>
            </div>
          </div>
        </LoginProvider>
      </UsingRouterProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(App)

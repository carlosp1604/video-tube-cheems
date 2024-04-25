import '~/styles/globals.scss'
import type { AppProps } from 'next/app'
import styles from '~/styles/pages/_app.module.scss'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import LoginProvider from '~/modules/Auth/Infrastructure/Components/LoginProvider'
import { Roboto } from 'next/font/google'
import UsingRouterProvider from '~/modules/Shared/Infrastructure/Components/UsingRouterProvider'
import 'react-tooltip/dist/react-tooltip.css'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ReactGA from 'react-ga4'
import Head from 'next/head'
import { TopMobileMenu } from '~/components/TopMobileMenu/TopMobileMenu'
import { AppMenu } from '~/components/AppMenu/AppMenu'
import { MenuSideBar } from '~/components/MenuSideBar/MenuSideBar'
import { LanguageMenu } from '~/modules/Shared/Infrastructure/Components/LanguageMenu/LanguageMenu'
import { AppProgressBar } from '~/components/AppProgressBar/AppProgressBar'
import { MobileMenu } from '~/components/AppMenu/MobileMenu'
import { AppToast } from '~/components/AppToast/AppToast'

const AppFooter = dynamic(() => import('~/components/AppFooter/AppFooter')
  .then((module) => module.AppFooter),
{ ssr: false }
)

const AppBanner = dynamic(() => import('~/modules/Shared/Infrastructure/Components/AppBanner/AppBanner')
  .then((module) => module.AppBanner),
{ ssr: false }
)

const LiveCams = dynamic(() =>
  import('~/components/LiveCams/LiveCams').then((module) => module.LiveCams), { ssr: false })

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

  const { pathname } = useRouter()

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
          <div className={ `${styles.app__layout} ${roboto.variable}` } translate={ 'no' }>
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

              <AppFooter />
            </div>
          </div>
        </LoginProvider>
      </UsingRouterProvider>
    </SessionProvider>
  )
}

export default App

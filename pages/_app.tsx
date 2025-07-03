import '~/styles/globals.scss'
import type { AppProps } from 'next/app'
import styles from '~/styles/pages/_app.module.scss'
import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import LoginProvider from '~/modules/Auth/Infrastructure/Components/LoginProvider'
import { Roboto } from 'next/font/google'
import UsingRouterProvider from '~/modules/Shared/Infrastructure/Components/UsingRouterProvider'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ReactGA from 'react-ga4'
import Head from 'next/head'
import { TopMobileMenu } from '~/components/TopMobileMenu/TopMobileMenu'
import { AppMenu } from '~/components/AppMenu/AppMenu'
import { AppProgressBar } from '~/components/AppProgressBar/AppProgressBar'
import {
  TrafficstarsVideoSlider
} from '~/modules/Shared/Infrastructure/Components/Advertising/Trafficstars/TrafficstarsVideoSlider'
import { ToastProvider } from '~/components/AppToast/ToastProvider'
import { AdCashProvider } from '~/modules/Shared/Infrastructure/Components/Advertising/AdCash/AdCashScript'
import ClickAduStaticCode from '~/modules/Shared/Infrastructure/Components/Advertising/ClickAdu/ClickAduStaticCode'

const AppFooter = dynamic(() => import('~/components/AppFooter/AppFooter')
  .then((module) => module.AppFooter),
{ ssr: false }
)

const MobileMenu = dynamic(() => import('~/components/AppMenu/MobileMenu')
  .then((module) => module.MobileMenu),
{ ssr: false })

const MenuSideBar = dynamic(() => import('~/components/MenuSideBar/MenuSideBar')
  .then((module) => module.MenuSideBar),
{ ssr: false })

const LanguageMenu = dynamic(() => import('~/modules/Shared/Infrastructure/Components/LanguageMenu/LanguageMenu')
  .then((module) => module.LanguageMenu),
{ ssr: false })

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
        <main className={ styles.app__embedContainer } translate={ 'no' }>
          <Component { ...pageProps }/>
        </main>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider session={ session }>
      <UsingRouterProvider >
        <ToastProvider>
          <LoginProvider>
            <div className={ `${styles.app__layout} ${roboto.variable}` } translate={ 'no' }>
              <Head>
                <link rel="icon" href="/favicon.ico" />
              </Head>

              <AppProgressBar />

              <LanguageMenu isOpen={ openLanguageMenu } onClose={ () => setOpenLanguageMenu(false) }/>

              <MobileMenu
                setOpenLanguageMenu={ setOpenLanguageMenu }
                openMenu={ menuOpen }
                setOpenMenu={ setMenuOpen }
              />

              <AppMenu
                onClickMenuButton={ () => setMenuOpen(!menuOpen) }
                setOpenLanguageMenu={ setOpenLanguageMenu }
              />

              <MenuSideBar
                menuOpen={ menuOpen }
                setOpenLanguageMenu={ setOpenLanguageMenu }
              />

              <TrafficstarsVideoSlider />

              <ClickAduStaticCode />

              <AdCashProvider>
                { /** Workaround to work with the sidebar fixed **/ }
                <div className={
                  `${styles.app__mainLayout} ${menuOpen ? styles.app__mainLayout__open : ''} ${roboto.variable}` }
                >
                  { /** Workaround to show tooltip in the sidebar menú**/ }
                  <div id="tooltip-container" className={ 'fixed z-tooltip' }></div>
                  <main className={ styles.app__container }>

                    <TopMobileMenu />

                    <Component { ...pageProps }/>
                  </main>

                  <AppFooter />
                </div>
              </AdCashProvider>
            </div>
          </LoginProvider>
        </ToastProvider>
      </UsingRouterProvider>
    </SessionProvider>
  )
}

export default App

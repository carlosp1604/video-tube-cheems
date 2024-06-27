import { Dispatch, FC, ReactElement, SetStateAction } from 'react'
import styles from './MobileMenu.module.scss'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import useTranslation from 'next-translate/useTranslation'
import { BsBookmarks, BsClock, BsHouse, BsStar, BsTags } from 'react-icons/bs'
import { useLoginContext } from '~/hooks/LoginContext'
import { useRouter } from 'next/router'
import { TfiWorld } from 'react-icons/tfi'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { MdLiveTv } from 'react-icons/md'
import { IoMdTrendingUp } from 'react-icons/io'

const CSSTransition = dynamic(() =>
  import('react-transition-group').then((module) => module.CSSTransition), { ssr: false }
)

interface Props {
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
  setOpenLanguageMenu: Dispatch<SetStateAction<boolean>>
}

export const MobileMenu: FC<Props> = ({ openMenu, setOpenMenu, setOpenLanguageMenu }) => {
  const { t } = useTranslation('menu')
  const { setLoginModalOpen } = useLoginContext()
  const { pathname, asPath } = useRouter()
  const { status, data } = useSession()

  const buildAuthenticationAction = (
    url: string,
    picture: ReactElement,
    isActive: boolean,
    title: string
  ) => {
    const option: MenuOptionComponentInterface = {
      action: undefined,
      onClick: undefined,
      picture,
      isActive,
      title,
    }

    if (status !== 'authenticated' || !data) {
      option.onClick = async () => {
        const toast = (await import('react-hot-toast')).default

        toast.error(t('user_must_be_authenticated_error_message'))

        setLoginModalOpen(true)
      }

      return option
    }

    if (url === asPath) {
      option.onClick = async () => {
        const toast = (await import('react-hot-toast')).default

        toast.error(t('user_already_on_path'))
      }

      return option
    }

    option.action = {
      url,
      blank: false,
    }

    return option
  }

  return (
    <CSSTransition
      classNames={ {
        enter: styles.mobileMenu__backdropEnter,
        enterActive: styles.mobileMenu__backdropEnterActive,
        enterDone: styles.mobileMenu__backdropEnterDone,
        exit: styles.mobileMenu__backdropExit,
        exitActive: styles.mobileMenu__backdropExitActive,
        exitDone: styles.mobileMenu__backdropExitDone,
      } }
      in={ openMenu }
      timeout={ parseInt('500') }
    >
      <div
        className={ styles.mobileMenu__backdrop }
        onClick={ () => setOpenMenu(false) }
      >
        <CSSTransition
          classNames={ {
            enterActive: styles.mobileMenu__slideOutEnterActive,
            enterDone: styles.mobileMenu__slideOutEnterDone,
            exit: styles.mobileMenu__slideOutExit,
            exitActive: styles.mobileMenu__slideOutExitActive,
          } }
          in={ openMenu }
          timeout={ parseInt('500') }
        >
          <div className={ styles.mobileMenu__slideOut }>
            <div className={ styles.mobileMenu__logoContainer } >
              <Image
                alt={ t('menu_logo_alt_title') }
                className={ styles.mobileMenu__logo }
                src={ '/img/app-logo-text.png' }
                width={ 0 }
                height={ 0 }
                sizes={ '100vw' }
              />
            </div>

            <MenuOptions menuOptions={ [
              {
                title: t('menu_home_button_title'),
                isActive: pathname === '/',
                action: {
                  url: '/',
                  blank: false,
                },
                picture: <BsHouse />,
                onClick: undefined,
              },
              {
                title: t('menu_trending_button_title'),
                isActive: pathname === '/posts/top',
                action: {
                  url: '/posts/top',
                  blank: false,
                },
                picture: <IoMdTrendingUp />,
                onClick: undefined,
              },
              {
                title: t('menu_stars_button_title'),
                isActive: pathname === '/actors',
                action: {
                  url: '/actors',
                  blank: false,
                },
                picture: <BsStar />,
                onClick: undefined,
              },
              {
                title: t('menu_producers_button_title'),
                isActive: pathname === '/producers',
                action: {
                  url: '/producers',
                  blank: false,
                },
                picture: <MdLiveTv />,
                onClick: undefined,
              },
              {
                title: t('menu_tags_button_title'),
                isActive: pathname === '/tags',
                action: {
                  url: '/tags',
                  blank: false,
                },
                picture: <BsTags />,
                onClick: undefined,
              },
              buildAuthenticationAction(
                `/users/${data ? data.user.username : ''}/saved-posts`,
                <BsBookmarks />,
                asPath === `/users/${data ? data.user.username : ''}/saved-posts`,
                t('menu_saved_button_title')
              ),
              buildAuthenticationAction(
                `/users/${data ? data.user.username : ''}/history`,
                <BsClock />,
                asPath === `/users/${data ? data.user.username : ''}/history`,
                t('menu_user_history_button_title')
              ),
              {
                title: t('menu_language_button_title'),
                isActive: false,
                action: undefined,
                picture: <TfiWorld />,
                onClick: () => {
                  setOpenLanguageMenu(true)
                },
              },
            ] } />
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  )
}

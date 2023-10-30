import { Dispatch, FC, SetStateAction } from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './MobileMenu.module.scss'
import { MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { BsBookmarks, BsCameraVideo, BsClock, BsHeart, BsHouse, BsStar } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { useLoginContext } from '~/hooks/LoginContext'
import { useUserContext } from '~/hooks/UserContext'

interface Props {
  openMenu: boolean
  setOpenMenu: Dispatch<SetStateAction<boolean>>
}

export const MobileMenu: FC<Props> = ({ openMenu, setOpenMenu }) => {
  const { pathname, push } = useRouter()

  const { t } = useTranslation('menu')
  const { status, user } = useUserContext()
  const { setLoginModalOpen } = useLoginContext()

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
                <img
                  className={ styles.mobileMenu__logo }
                  src='/img/cheems-logo.png'
                  alt={ t('menu_logo_alt_title') }
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
                /**
                 {
                  translationKey: 'menu_following_button_title',
                  isActive: false,
                  action: {
                    url: '/',
                    blank: false,
                  },
                  picture: <TbClipboardCheck />,
                  onClick: undefined,
                },
                 **/
                {
                  title: t('menu_saved_button_title'),
                  isActive: pathname.startsWith('/users/'),
                  action: undefined,
                  picture: <BsBookmarks />,
                  onClick: async () => {
                    if (status !== 'SIGNED_IN' || !user) {
                      toast.error(t('user_must_be_authenticated_error_message'))

                      setLoginModalOpen(true)
                    } else {
                      await push(`/users/${user.username}`)
                    }
                  },
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
                  title: t('menu_reacted_button_title'),
                  isActive: false,
                  action: undefined,
                  picture: <BsHeart />,
                  onClick: () => {
                    toast.success(t('user_menu_option_not_available_message'))
                  },
                },
                {
                  title: t('menu_user_history_button_title'),
                  isActive: false,
                  action: undefined,
                  picture: <BsClock />,
                  onClick: () => {
                    toast.success(t('user_menu_option_not_available_message'))
                  },
                },
                {
                  title: t('menu_live_cams_button_title'),
                  isActive: false,
                  action: undefined,
                  picture: <BsCameraVideo />,
                  onClick: undefined,
                },
              ] } />

              {
                /**
                 <div className={ styles.mobileMenu__footerContainer }>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 <span className={ styles.mobileMenu__footerItem }>
                 Home
                 </span>
                 </div>
                 */
              }
              <div className={ styles.mobileMenu__copyrightContainer }>
                { t('copyright_section_title') }
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
  )
}

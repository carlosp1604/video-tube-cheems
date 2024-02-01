import { Dispatch, FC, ReactElement, SetStateAction } from 'react'
import styles from './MenuSideBar.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { BsBookmarks, BsClock, BsHeart, BsHouse, BsStar, BsTv } from 'react-icons/bs'
import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'
import toast from 'react-hot-toast'
import { useLoginContext } from '~/hooks/LoginContext'
import { TfiWorld } from 'react-icons/tfi'
import { useSession } from 'next-auth/react'

interface MenuSideBarOptionProps {
  menuOption: MenuOptionComponentInterface
  menuOpen: boolean
}

const MenuSideBarOption: FC<MenuSideBarOptionProps> = ({ menuOption, menuOpen }) => {
  if (menuOption.action) {
    return (
      <Link
        scroll={ false }
        href={ menuOption.action.url }
        className={ `
        ${styles.menuSideBar__menuItemContent}
        ${menuOpen ? styles.menuSideBar__menuItemContent_open : ''}
        ${menuOption.isActive ? styles.menuSideBar__menuItemContent_active : ''}
      ` }
      >
      <span className={ styles.menuSideBar__menuItemIcon }>
        { menuOption.picture }
      </span>
        <span className={ `
        ${styles.menuSideBar__menuItemText}
        ${menuOpen ? styles.menuSideBar__menuItemText_open : ''}
      ` }>
        { menuOption.title }
      </span>
      </Link>
    )
  }

  if (menuOption.onClick) {
    return (
      <div
        className={ `
        ${styles.menuSideBar__menuItemContent}
        ${menuOpen ? styles.menuSideBar__menuItemContent_open : ''}
        ${menuOption.isActive ? styles.menuSideBar__menuItemContent_active : ''}
      ` }
        onClick={ menuOption.onClick }
      >
      <span className={ styles.menuSideBar__menuItemIcon }>
        { menuOption.picture }
      </span>
        <span className={ `
        ${styles.menuSideBar__menuItemText}
        ${menuOpen ? styles.menuSideBar__menuItemText_open : ''}
      ` }>
        { menuOption.title }
      </span>
      </div>
    )
  }

  return null
}

export interface Props {
  setOpenLanguageMenu: Dispatch<SetStateAction<boolean>>
  menuOpen: boolean
}

export const MenuSideBar: FC<Props> = ({ setOpenLanguageMenu, menuOpen }) => {
  const { pathname, asPath } = useRouter()
  const { t } = useTranslation('menu')

  const { status, data } = useSession()
  const { setLoginModalOpen } = useLoginContext()

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
      option.onClick = () => {
        toast.error(t('user_must_be_authenticated_error_message'))

        setLoginModalOpen(true)
      }

      return option
    }

    if (url === asPath) {
      option.onClick = () => {
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

  const menuOptions: MenuOptionComponentInterface[] = [
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
      picture: <BsTv />,
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
    /**
    {
      title: t('menu_live_cams_button_title'),
      isActive: false,
      action: undefined,
      picture: <BsCameraVideo />,
      onClick: undefined,
    },
     */
  ]

  return (
    <aside className={ `
      ${styles.menuSideBar__asideSlideOut}
      ${menuOpen ? styles.menuSideBar__asideSlideOut_open : ''}
    ` }>

      <div className={ styles.menuSideBar__menuSectionContainer }>
        <div className={ styles.menuSideBar__menuContainer }>
          { menuOptions.map((menuOption) => {
            return (
              <MenuSideBarOption
                menuOption={ menuOption }
                menuOpen={ menuOpen }
                key={ menuOption.title }
              />
            )
          }) }
        </div>
      </div>
    </aside>
  )
}

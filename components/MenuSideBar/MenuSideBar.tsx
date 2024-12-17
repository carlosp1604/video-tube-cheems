import { Dispatch, FC, ReactElement, SetStateAction } from 'react'
import styles from './MenuSideBar.module.scss'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { BsBookmarks, BsClock, BsHouse, BsStar, BsTags } from 'react-icons/bs'
import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'
import { useLoginContext } from '~/hooks/LoginContext'
import { useSession } from 'next-auth/react'
import { TfiWorld } from 'react-icons/tfi'
import { MenuSideBarOption } from './MenuSideBarOption/MenuSideBarOption'
import { MdLiveTv } from 'react-icons/md'
import { IoMdTrendingUp } from 'react-icons/io'
import { useToast } from '~/components/AppToast/ToastContext'

export interface Props {
  setOpenLanguageMenu: Dispatch<SetStateAction<boolean>>
  menuOpen: boolean
}

export const MenuSideBar: FC<Props> = ({ setOpenLanguageMenu, menuOpen }) => {
  const { pathname, asPath } = useRouter()
  const { t } = useTranslation('menu')

  const { status, data } = useSession()
  const { setLoginModalOpen } = useLoginContext()
  const { error } = useToast()

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
        error(t('user_must_be_authenticated_error_message'))

        setLoginModalOpen(true)
      }

      return option
    }

    if (url === asPath) {
      option.onClick = () => {
        error(t('user_already_on_path'))
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
  ]

  menuOptions.push({
    title: t('menu_language_button_title'),
    isActive: false,
    action: undefined,
    picture: <TfiWorld />,
    onClick: () => {
      setOpenLanguageMenu(true)
    },
  })

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

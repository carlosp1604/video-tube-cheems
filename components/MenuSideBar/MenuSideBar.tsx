import { FC, useState } from 'react'
import styles from './MenuSideBar.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { BsBookmarks, BsCameraVideo, BsClock, BsHeart, BsHouse, BsList, BsStar } from 'react-icons/bs'
import { IconButton } from '~/components/IconButton/IconButton'
import { MenuOptionComponentInterface } from '~/components/MenuOptions/MenuOptions'
import toast from 'react-hot-toast'
import { useUserContext } from '~/hooks/UserContext'
import { useLoginContext } from '~/hooks/LoginContext'

interface MenuSideBarOptionProps {
  menuOption: MenuOptionComponentInterface
  menuOpen: boolean
}

const MenuSideBarOption: FC<MenuSideBarOptionProps> = ({ menuOption, menuOpen }) => {
  if (menuOption.action) {
    return (
      <Link
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

export const MenuSideBar: FC = () => {
  const { pathname, push } = useRouter()
  const { t } = useTranslation('menu')

  const { status, user } = useUserContext()
  const { setLoginModalOpen } = useLoginContext()

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
  ]

  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  return (
    <aside className={ `
      ${styles.menuSideBar__asideSlideOut}
      ${menuOpen ? styles.menuSideBar__asideSlideOut_open : ''}
    ` }>
      <div className={ `
        ${styles.menuSideBar__menuIconContainer}
        ${menuOpen ? styles.menuSideBar__menuIconContainer_open : ''}
      ` }>
        <IconButton
          onClick={ () => setMenuOpen(!menuOpen) }
          icon={ <BsList /> }
          title={ t('menu_button_title') }
        />
      </div>

      <div className={ styles.menuSideBar__menuSectionContainer }>
        <div className={ `
          ${styles.menuSideBar__menuContainer}
          ${menuOpen ? styles.menuSideBar__menuContainer_open : ''}
        ` }>
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

        <div className={ `
          ${styles.menuSideBar__copyrightContainer}
          ${menuOpen ? styles.menuSideBar__copyrightContainer_open : ''}
        ` }>
            <div className={ `
            ${styles.menuSideBar__copyrightContainerText}
            ${menuOpen ? styles.menuSideBar__copyrightContainerText_open : ''}
          ` }>
            { t('copyright_section_title') }
          </div>
        </div>
      </div>
    </aside>
  )
}

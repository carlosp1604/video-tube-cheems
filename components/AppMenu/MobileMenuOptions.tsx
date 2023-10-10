import { BsBookmarks, BsCameraVideo, BsClock, BsHeart, BsHouse, BsStar } from 'react-icons/bs'
import { TbClipboardCheck } from 'react-icons/tb'
import { ReactElement } from 'react'

export interface ActionInterface {
  url: string
  blank: boolean
}

export interface MenuOptionInterface {
  isActive: boolean
  translationKey: string
  action: ActionInterface
  picture: ReactElement
  onClick: (() => void) | undefined
}

export const getMobileMenuOptions = (pathname: string): MenuOptionInterface[] => {
  return [
    {
      translationKey: 'menu_home_button_title',
      isActive: pathname === '/',
      action: {
        url: '/',
        blank: false,
      },
      picture: <BsHouse />,
      onClick: undefined,
    },
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
    {
      translationKey: 'menu_saved_button_title',
      isActive: false,
      action: {
        url: '/',
        blank: false,
      },
      picture: <BsBookmarks />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_stars_button_title',
      isActive: pathname === '/actors',
      action: {
        url: '/actors',
        blank: false,
      },
      picture: <BsStar />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_reacted_button_title',
      isActive: false,
      action: {
        url: '/',
        blank: false,
      },
      picture: <BsHeart />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_check_later_button_title',
      isActive: false,
      action: {
        url: '/',
        blank: false,
      },
      picture: <BsClock />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_live_cams_button_title',
      isActive: false,
      action: {
        url: '/',
        blank: false,
      },
      picture: <BsCameraVideo />,
      onClick: undefined,
    },
  ]
}

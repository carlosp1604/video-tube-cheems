import { BsBookmarks, BsCameraVideo, BsClock, BsHeart, BsHouse, BsStar } from 'react-icons/bs'
import { TbClipboardCheck } from 'react-icons/tb'
import { ReactElement } from 'react'

export interface MenuOptionInterface {
  isActive: boolean
  translationKey: string
  action: string
  icon: ReactElement
  onClick: (() => void) | undefined
}

export const getMobileMenuOptions = (pathname: string): MenuOptionInterface[] => {
  return [
    {
      translationKey: 'menu_home_button_title',
      isActive: pathname === '/',
      action: '/',
      icon: <BsHouse />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_following_button_title',
      isActive: false,
      action: '/',
      icon: <TbClipboardCheck />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_saved_button_title',
      isActive: false,
      action: '/',
      icon: <BsBookmarks />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_stars_button_title',
      isActive: pathname === '/actors',
      action: '/actors',
      icon: <BsStar />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_reacted_button_title',
      isActive: false,
      action: '/',
      icon: <BsHeart />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_check_later_button_title',
      isActive: false,
      action: '/',
      icon: <BsClock />,
      onClick: undefined,
    },
    {
      translationKey: 'menu_live_cams_button_title',
      isActive: false,
      action: '/',
      icon: <BsCameraVideo />,
      onClick: undefined,
    },
  ]
}

import styles from './UserMenu.module.scss'
import { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { signOut, useSession } from 'next-auth/react'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import { CiLogout, CiUnlock, CiUser } from 'react-icons/ci'
import { useLoginContext } from '~/hooks/LoginContext'
import { usePathname } from 'next/navigation'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

interface Props {
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
}

export const UserMenu: FC<Props> = ({ setIsOpen, isOpen }) => {
  const { t } = useTranslation('user_menu')
  const { setLoginModalOpen, setMode } = useLoginContext()

  const pathname = usePathname()

  const { status, data } = useSession()

  if (status !== 'authenticated' || !data) {
    return null
  }

  const menuOptions: MenuOptionComponentInterface[] = [{
    title: t('user_menu_change_password_button'),
    isActive: false,
    action: undefined,
    picture: <CiUnlock />,
    onClick: () => {
      setMode('retrieve')
      setLoginModalOpen(true)
      setIsOpen(false)
    },
  }]

  if (pathname !== `/users/${data.user.username}`) {
    menuOptions.unshift({
      title: t('user_menu_profile_button'),
      isActive: false,
      action: {
        url: `/users/${data.user.username}`,
        blank: false,
      },
      picture: <CiUser />,
      onClick: () => setIsOpen(false),
    })
  }

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ () => setIsOpen(false) }
    >
      <div className={ styles.userMenu__container }>
        <div className={ styles.userMenu__userData }>
          <AvatarImage
            imageUrl={ data.user.image }
            avatarClassName={ styles.userMenu__userAvatar }
            imageClassName={ styles.userMenu__userImage }
            avatarName={ data.user.name }
            imageAlt={ data.user.username }
          />
          <span className={ styles.userMenu__userDataText }>
            { data.user.name }
            <small className={ styles.userMenu__userEmail }>
              { data.user.email }
            </small>
          </span>
        </div>

        <div className={ styles.userMenu__menuOptionsContainer }>
          <MenuOptions menuOptions={ menuOptions } />
        </div>

        <button
          className={ styles.userMenu__signOutButton }
          onClick={ () => {
            signOut({ redirect: false })
              .then(() => setIsOpen(false))
          } }
        >
          <CiLogout className={ styles.userMenu__icon }/>
          { t('user_sign_out_button') }
        </button>
      </div>
    </Modal>
  )
}

import Avatar from 'react-avatar'
import styles from './UserMenu.module.scss'
import { FC, useEffect } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { signOut } from 'next-auth/react'
import { MenuOptionComponentInterface, MenuOptions } from '~/components/MenuOptions/MenuOptions'
import { useTranslation } from 'next-i18next'
import { CiLogout, CiUnlock, CiUser } from 'react-icons/ci'
import { UserProviderUserDto } from '~/modules/Auth/Infrastructure/Dtos/UserProviderUserDto'
import { useRouter } from 'next/router'
import { useLoginContext } from '~/hooks/LoginContext'

interface Props {
  user: UserProviderUserDto
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
}

export const UserMenu: FC<Props> = ({ user, setIsOpen, isOpen }) => {
  const { t } = useTranslation('user_menu')
  const { setLoginModalOpen, setMode } = useLoginContext()
  const { pathname, isReady } = useRouter()

  const menuOptions: MenuOptionComponentInterface[] = [{
    // TODO: This should be extracted to an object when grow up
    title: t('user_menu_profile_button'),
    isActive: false,
    action: undefined,
    picture: <CiUnlock />,
    onClick: () => {
      setMode('retrieve')
      setLoginModalOpen(true)
      setIsOpen(false)
    },
  }]

  useEffect(() => {
    if (isReady) {
      if (pathname !== `/users/${user.username}`) {
        menuOptions.push({
          // TODO: This should be extracted to an object when grow up
          title: t('user_menu_profile_button'),
          isActive: false,
          action: {
            url: `/users/${user.username}?section=savedPosts`,
            blank: false,
          },
          picture: <CiUser />,
          onClick: () => setIsOpen(false),
        })
      }
    }
  }, [isReady])

  let avatar = (
    <Avatar
      className={ styles.userMenu__userAvatar }
      round={ true }
      size={ '50' }
      name={ user.name }
      textSizeRatio={ 2 }
    />
  )

  if (user.image !== null) {
    avatar = (
      <img
        className={ styles.userMenu__userAvatar }
        src={ user.image }
        alt={ user.name }
      />
    )
  }

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ () => setIsOpen(false) }
    >
      <div className={ styles.userMenu__container }>
        <div className={ styles.userMenu__userData }>
          { avatar }
          <span className={ styles.userMenu__userDataText }>
            { user.name }
            <small className={ styles.userMenu__userEmail }>
              { user.email }
            </small>
          </span>
        </div>

        <div className={ styles.userMenu__menuOptionsContainer }>
          <MenuOptions
            menuOptions={ menuOptions } />
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

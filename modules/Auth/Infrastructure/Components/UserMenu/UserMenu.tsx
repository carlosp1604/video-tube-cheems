import { FC } from 'react'
import styles from './UserMenu.module.scss'
import { CiLogout, CiUser } from 'react-icons/ci'
import { signOut } from 'next-auth/react'
import Avatar from 'react-avatar'
import { useTranslation } from 'next-i18next'
import { Modal } from '~/components/Modal/Modal'
import { MenuOptions } from '~/components/MenuOptions/MenuOptions'

interface Props {
  id: string
  username: string
  imageUrl: string | null
  name: string
  email: string
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
}

export const UserMenu: FC<Props> = ({
  id,
  username,
  imageUrl,
  name,
  email,
  setIsOpen,
  isOpen,
}) => {
  const { t } = useTranslation('user_menu')

  let avatar = (
    <Avatar
      className={ styles.userMenu__userAvatar }
      round={ true }
      size={ '50' }
      name={ name }
      textSizeRatio={ 2 }
    />
  )

  if (imageUrl !== null) {
    avatar = (
      <img
        className={ styles.userMenu__userAvatar }
        src={ imageUrl }
        alt={ name }
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
            { name }
            <small className={ styles.userMenu__userEmail }>
              { email }
            </small>
          </span>
        </div>

        <div className={ styles.userMenu__menuOptionsContainer }>
          <MenuOptions
            menuOptions={ [
              {
                translationKey: 'user_menu_profile_button',
                isActive: false,
                action: `/users/${username}`,
                icon: <CiUser />,
                onClick: () => setIsOpen(false),
              },
            ] } />
        </div>

        <button
          className={ styles.userMenu__signOutButton }
          onClick={ () => signOut({ redirect: false }) }
        >
          <CiLogout className={ styles.userMenu__icon }/>
          { t('user_sign_out_button') }
        </button>
      </div>
    </Modal>
  )
}

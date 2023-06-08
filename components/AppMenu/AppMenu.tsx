import Link from 'next/link'
import Avatar from 'react-avatar'
import styles from './AppMenu.module.scss'
import { CiUser } from 'react-icons/ci'
import { UserMenu } from '~/modules/Auth/Infrastructure/Components/UserMenu/UserMenu'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { useRouter } from 'next/router'
import { LoginModal } from '~/modules/Auth/Infrastructure/Components/Login/LoginModal'
import { useSession } from 'next-auth/react'
import { FC, useState } from 'react'
import { useUserContext } from '~/hooks/UserContext'
import { useTranslation } from 'next-i18next'

export const AppMenu: FC = () => {
  const [title, setTitle] = useState<string>('')
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)

  const { user } = useUserContext()
  const { t } = useTranslation('app_menu')

  let userAvatar = (
    <button
      className={ styles.appMenu__menuButton }
      onClick={ () => setLoginModalOpen(true) }
    >
      <CiUser className={ styles.appMenu__menuIcon }/>
    </button>
  )

  let userMenu = null

  const router = useRouter()
  const session = useSession()

  if (session.status === 'authenticated' && user !== null) {
    if (user?.image !== null) {
      userAvatar = (
        <button
          className={ styles.appMenu__userAvatarButton }
          onClick={ () => setUserMenuOpen(true) }
        >
          <img
            className={ styles.appMenu__userAvatarImage }
            src={ user?.image }
            alt={ user?.name }
          />
        </button>
      )
    } else {
      userAvatar = (
        <button
          className={ styles.appMenu__userAvatarButton }
          onClick={ () => setUserMenuOpen(true) }
        >
          <Avatar
            className={ styles.appMenu__userAvatarImage }
            round={ true }
            size={ '40' }
            name={ user.name }
            textSizeRatio={ 3 }
          />
        </button>
      )
    }

    userMenu = (
      <UserMenu
        id={ user?.id }
        username={ user?.username }
        imageUrl={ user?.image }
        name={ user?.name }
        email={ user?.email }
        setIsOpen={ (isOpen: boolean) => setUserMenuOpen(isOpen) }
        isOpen={ userMenuOpen }
      />
    )
  }

  const onSearch = async () => {
    if (router.pathname === '/posts/search') {
      await router.push({
        query: {
          search: title,
        },
      })
    } else {
      await router.replace({
        pathname: '/posts/search/',
        query: {
          search: title,
        },
      })
    }
  }

  return (
    <>
      { userMenu }
      <LoginModal isOpen={ loginModalOpen } setIsOpen={ setLoginModalOpen }/>
      <nav className={ styles.appMenu__layer }>
        <div className={ styles.appMenu__container }>
          <Link href='/'>
            <img
              className={ styles.appMenu__logoImage }
              src='/img/cheems-logo.png'
            />
          </Link>

          <div className={ styles.appMenu__rightContainer }>
            <SearchBar
              onChange={ (value: string) => setTitle(value) }
              onSearch={ onSearch }
              openable={ true }
              placeHolderTitle={ t('app_menu_search_menu_placeholder_title') }
            />
            { userAvatar }
          </div>
        </div>
      </nav>
    </>
  )
}

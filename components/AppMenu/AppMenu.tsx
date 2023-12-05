import Link from 'next/link'
import styles from './AppMenu.module.scss'
import { UserMenu } from '~/modules/Auth/Infrastructure/Components/UserMenu/UserMenu'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { useRouter } from 'next/router'
import { LoginModal } from '~/modules/Auth/Infrastructure/Components/Login/LoginModal'
import { useSession } from 'next-auth/react'
import { FC, ReactElement, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useUserContext } from '~/hooks/UserContext'
import { AiOutlineLoading } from 'react-icons/ai'
import { useLoginContext } from '~/hooks/LoginContext'
import { IconButton } from '~/components/IconButton/IconButton'
import { CiUser } from 'react-icons/ci'
import toast from 'react-hot-toast'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

export const AppMenu: FC = () => {
  const [title, setTitle] = useState<string>('')
  const { loginModalOpen, setLoginModalOpen } = useLoginContext()
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)

  const { user } = useUserContext()
  const { t } = useTranslation('app_menu')
  const router = useRouter()
  const session = useSession()

  let userAvatar: ReactElement | null = null

  if (session.status === 'loading') {
    userAvatar = (
      <IconButton
        onClick={ undefined }
        icon={ <AiOutlineLoading className={ styles.appMenu__loadingMenuIcon }/> }
        title={ t('app_menu_loading_user_button_title') }
      />
    )
  }

  if (session.status === 'unauthenticated') {
    userAvatar = (
      <IconButton
        onClick={ () => setLoginModalOpen(!loginModalOpen) }
        icon={ <CiUser /> }
        title={ t('app_menu_user_button_title') }
      />
    )
  }

  let userMenu = null

  if (session.status === 'authenticated' && user !== null) {
    userAvatar = (
      <button
        className={ styles.appMenu__userAvatarContainer }
        onClick={ () => setUserMenuOpen(true) }
      >
        <AvatarImage
          imageUrl={ user.image }
          avatarClassName={ styles.userProfileHeader__userAvatarContainer }
          imageClassName={ styles.appMenu__userAvatarContainer }
          avatarName={ user.name }
          size={ '28' }
          round={ true }
          imageAlt={ user.username }
        />
      </button>
    )

    userMenu = (
      <UserMenu
        user={ user }
        setIsOpen={ (isOpen: boolean) => setUserMenuOpen(isOpen) }
        isOpen={ userMenuOpen }
      />
    )
  }

  const onSearch = async () => {
    if (title === '') {
      toast.error(t('empty_search_error_message'))

      return
    }

    const { search } = router.query

    if (
      !search ||
      (search && search !== title)
    ) {
      await router.push({
        pathname: '/posts/search/',
        query: {
          search: title,
        },
      }, undefined, { shallow: true, scroll: false })
    }

    if (search && search === title) {
      toast.error(t('already_searching_term_error_message'))
    }
  }

  return (
    <>
      { userMenu }
      <LoginModal />
      <nav className={ styles.appMenu__layer }>
        <div className={ styles.appMenu__container }>
          <Link href='/' scroll={ false } shallow={ true }>
            <img
              className={ styles.appMenu__logoImage }
              src='/img/cheems-logo.png'
              alt={ t('app_menu_logo_url_alt') }
            />
          </Link>

          <div className={ styles.appMenu__rightContainer }>
            <SearchBar
              onChange={ (value: string) => setTitle(value) }
              onSearch={ onSearch }
              expandable={ true }
              placeHolderTitle={ t('app_menu_search_menu_placeholder_title') }
              searchIconTitle={ t('app_menu_search_button_title') }
            />
            { userAvatar }
          </div>
        </div>
      </nav>
      {
        /**
         <div className={ styles.appMenu__utilLinksContainer }>
         <Link
           href={ '/' }
           title={ 'Live cams' }
           className={ styles.appMenu__utilLink }
         >
           <BsCameraVideo />
           Live cams
         </Link>

         <Link
         href={ '/' }
         title={ 'asdasdas' }
         className={ styles.appMenu__utilLink }
         >
         <BsSearch />
         asdasda
         </Link>

         <Link
         href={ '/' }
         title={ 'asdasdas' }
         className={ styles.appMenu__utilLink }
         >
         <BsSearch />
         asdasda
         </Link>

         <Link
         href={ '/' }
         title={ 'asdasdas' }
         className={ styles.appMenu__utilLink }
         >
         <BsSearch />
         asdasda
         </Link>

         <Link
         href={ '/' }
         title={ 'asdasdas' }
         className={ styles.appMenu__utilLink }
         >
         <BsSearch />
         asdasda
         </Link>

         </div>
         */
      }
    </>
  )
}

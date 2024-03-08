import Link from 'next/link'
import styles from './AppMenu.module.scss'
import { UserMenu } from '~/modules/Auth/Infrastructure/Components/UserMenu/UserMenu'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { useRouter } from 'next/router'
import { LoginModal } from '~/modules/Auth/Infrastructure/Components/Login/LoginModal'
import { FC, ReactElement, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { AiOutlineLoading } from 'react-icons/ai'
import { useLoginContext } from '~/hooks/LoginContext'
import { IconButton } from '~/components/IconButton/IconButton'
import { CiSearch, CiUser } from 'react-icons/ci'
import toast from 'react-hot-toast'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import Image from 'next/image'
import { BsArrowUpShort } from 'react-icons/bs'
import { useSession } from 'next-auth/react'
import { HiBars3 } from 'react-icons/hi2'

export interface Props {
  onClickMenuButton : () => void
}

export const AppMenu: FC<Props> = ({ onClickMenuButton }) => {
  const [title, setTitle] = useState<string>('')
  const { loginModalOpen, setLoginModalOpen, mode, setMode } = useLoginContext()
  const { blocked } = useUsingRouterContext()
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)

  const { t } = useTranslation('app_menu')
  const router = useRouter()
  const { status, data } = useSession()

  let userAvatar: ReactElement | null = (
    <IconButton
      onClick={ undefined }
      icon={ <AiOutlineLoading className={ styles.appMenu__loadingMenuIcon }/> }
      title={ t('app_menu_loading_user_button_title') }
    />
  )

  if (status === 'unauthenticated') {
    userAvatar = (
      <IconButton
        onClick={ () => setLoginModalOpen(!loginModalOpen) }
        icon={ <CiUser /> }
        title={ t('app_menu_user_button_title') }
        showTooltip={ true }
      />
    )
  }

  const userMenu = (
    <UserMenu
      setIsOpen={ (isOpen: boolean) => setUserMenuOpen(isOpen) }
      isOpen={ userMenuOpen }
    />
  )

  if (status === 'authenticated' && data) {
    userAvatar = (
      <button
        className={ styles.appMenu__userAvatarButton }
        onClick={ () => setUserMenuOpen(true) }
      >
        <AvatarImage
          imageUrl={ data.user.image }
          avatarClassName={ styles.appMenu__userAvatar }
          imageClassName={ styles.appMenu__userAvatarImage }
          avatarName={ data.user.name }
          imageAlt={ data.user.username }
        />
      </button>
    )
  }

  const onSearch = async () => {
    if (title === '') {
      toast.error(t('empty_search_error_message'))

      return
    }

    if (blocked) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    const { search } = router.query

    if (
      !search ||
      (search && search !== title.trim())
    ) {
      await router.push({
        pathname: '/posts/search/[search]',
        query: {
          search: title.trim(),
        },
      }, undefined, { shallow: true, scroll: true })

      setOpenSearchBar(false)
    } else {
      toast.error(t('already_searching_term_error_message'))
    }
  }

  return (
    <>
      { userMenu }
      <LoginModal />
      <nav className={ styles.appMenu__layer }>
        <div className={ styles.appMenu__container }>
          <div className={ styles.appMenu__leftContainer }>
            <IconButton
              onClick={ onClickMenuButton }
              icon={ <HiBars3 /> }
              title={ t('app_menu_menu_button') }
            />
            <Link href='/' shallow={ true }>
              <Image
                alt={ t('app_menu_logo_url_alt') }
                className={ styles.appMenu__logoImage }
                src={ '/img/app-logo-text.png' }
                width={ 0 }
                height={ 0 }
                sizes={ '100vw' }
              />
            </Link>
          </div>

          <div className={ `
            ${styles.appMenu__searchContainer}
            ${openSearchBar ? styles.appMenu__searchContainer__open : ''}
          ` }>
            <SearchBar
              onChange={ (value: string) => setTitle(value) }
              onSearch={ onSearch }
              placeHolderTitle={ t('app_menu_search_menu_placeholder_title') }
              searchIconTitle={ t('app_menu_search_button_title') }
              focus={ openSearchBar }
            />
          </div>
          <div className={ styles.appMenu__rightContainer }>
            <div className={ styles.appMenu__mobileSearchButton }>
              <IconButton
                onClick={ () => setOpenSearchBar(!openSearchBar) }
                icon={ openSearchBar ? <BsArrowUpShort /> : <CiSearch /> }
                title={ openSearchBar ? t('search_bar_contract_title') : t('search_bar_expand_title') }
                showTooltip={ true }
              />
            </div>

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

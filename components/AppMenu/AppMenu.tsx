import Link from 'next/link'
import styles from './AppMenu.module.scss'
import { UserMenu } from '~/modules/Auth/Infrastructure/Components/UserMenu/UserMenu'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { useRouter } from 'next/router'
import { Dispatch, FC, ReactElement, SetStateAction, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { AiOutlineLoading } from 'react-icons/ai'
import { useLoginContext } from '~/hooks/LoginContext'
import { IconButton } from '~/components/IconButton/IconButton'
import { CiSearch, CiUser } from 'react-icons/ci'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { useUsingRouterContext } from '~/hooks/UsingRouterContext'
import Image from 'next/image'
import { BsArrowUpShort } from 'react-icons/bs'
import { useSession } from 'next-auth/react'
import { HiBars3 } from 'react-icons/hi2'
import dynamic from 'next/dynamic'
import { rgbDataURL } from '~/modules/Shared/Infrastructure/FrontEnd/BlurDataUrlHelper'

const LoginModal = dynamic(() =>
  import('~/modules/Auth/Infrastructure/Components/Login/LoginModal').then((module) => module.LoginModal),
{ ssr: false }
)

export interface Props {
  onClickMenuButton : () => void
  setOpenLanguageMenu: Dispatch<SetStateAction<boolean>>

}

export const AppMenu: FC<Props> = ({ onClickMenuButton, setOpenLanguageMenu }) => {
  const [title, setTitle] = useState<string>('')
  const { loginModalOpen, setLoginModalOpen } = useLoginContext()
  const { blocked } = useUsingRouterContext()
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false)
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)

  const { t } = useTranslation('app_menu')
  const router = useRouter()
  const { status, data } = useSession()
  const locale = useRouter().locale ?? 'en'

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
    const toast = (await import('react-hot-toast')).default

    if (blocked) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    const dompurify = (await import('dompurify')).default
    const cleanTitle = dompurify.sanitize(title.trim())

    if (cleanTitle === '') {
      toast.error(t('empty_search_error_message'))

      return
    }

    const { search } = router.query

    if (
      !search ||
      (search && search !== cleanTitle)
    ) {
      await router.push({
        pathname: '/posts/search',
        query: {
          search: cleanTitle,
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
            <button
              className={ styles.appMenu__languageButton }
              onClick={ () => setOpenLanguageMenu(true) }
              title={ t('language_button_title') }
            >
              <Image
                className={ styles.appMenu__languageImage }
                alt={ t('language_button_image_alt', { locale }) }
                src={ `/img/${locale}-locale.svg` }
                width={ 200 }
                height={ 200 }
                sizes={ '100vw' }
                placeholder={ 'blur' }
                blurDataURL={ rgbDataURL(81, 80, 80) }
              />
            </button>
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
    </>
  )
}

import { ChangeEvent, FC, KeyboardEvent, ReactElement, useEffect, useState } from 'react'
import styles from './AppMenu.module.scss'
import Link from 'next/link'
import { CiSearch, CiUser } from 'react-icons/ci'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export const AppMenu: FC = () => {
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [userAvatar, setUserAvatar] = useState<ReactElement>(( 
    <button
      className={ styles.appMenu__menuButton }
      onClick={async () => {
        await router.push({
          pathname: '/auth/signin/',
          query: {
            callbackUrl: `${router.pathname}`
          },
        })
      }}
    >
      <CiUser className={ styles.appMenu__menuIcon }/>
    </button>
  ))
  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    if (session.status === 'authenticated') {
      console.log('authenticated')
      setUserAvatar(
        <button className={styles.appMenu__userAvatarButton}>
          <img className={styles.appMenu__userAvatarImage}
            src={session.data.user.image ?? 'https://s.alamy.com/kdawwlsweh27/2LtummpjO849eQ83yGGiUN/b33c73279163c84b65241cdfcc1c8844/Fresh_Stock_Content.jpg?fm=jpg&q=100'}
          />
        </button>
      )
    }

  }, [session.status])

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (router.pathname === '/posts/search') {
        router.push({
          query: {
            search: title,
          }
        })
      } 
      else {
        router.push({
          pathname: 'posts/search/',
          query: {
            search: title
          },
        })
      }
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  return (
    <nav className={ styles.appMenu__layer }>
      <div className={ styles.appMenu__container }>
        <Link href='/'>
          <img
            className={ styles.appMenu__logoImage }
            src='/img/cheems-logo.png'
          />
        </Link>

        <div className={ styles.appMenu__rightContainer}>
          <button
            className={ styles.appMenu__searchButton }
            onClick={ () => setOpenSearchBar(!openSearchBar) }
          >
            <CiSearch
              className={ styles.appMenu__menuIcon }
              rotate={ openSearchBar ? '90' : '0'}
            />
          </button>

          <input
            className={ ` 
              ${styles.appMenu__searchInput}
              ${openSearchBar ? styles.appMenu__searchInput__open : ''}
            `}
            placeholder={ 'Buscar vídeos' }
            onKeyDown={ async (event: KeyboardEvent<HTMLInputElement>) => {
              await handleKeyDown(event)
            }}
            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
              handleChange(event)
            }}
          />
          {userAvatar}
        </div>
      </div>
    </nav>
  )
}
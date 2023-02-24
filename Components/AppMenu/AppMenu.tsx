import { ChangeEvent, FC, KeyboardEvent, useState } from 'react'
import styles from './AppMenu.module.scss'
import Link from 'next/link'
import { CiSearch, CiUser } from 'react-icons/ci'
import { useRouter } from 'next/router'

export const AppMenu: FC = () => {
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const router = useRouter()

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
          <Link
            className={ styles.appMenu__menuLink }
            href='/'
          >
            <CiUser className={ styles.appMenu__menuIcon }/>
          </Link>
        </div>
      </div>
    </nav>
  )
}
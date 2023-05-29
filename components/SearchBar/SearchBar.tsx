import { ChangeEvent, FC, KeyboardEvent, useState } from 'react'
import styles from './SearchBar.module.scss'
import { CiSearch, CiUser } from 'react-icons/ci'
import { useTranslation } from 'next-i18next'

interface Props {
  onChange: (value: string) => void
  onSearch: () => void
  openable: boolean
  placeHolderTitle: string
}

export const SearchBar: FC<Props> = ({ onChange, onSearch, openable, placeHolderTitle }) => {
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(!openable)

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch()
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className={ styles.searchBar__container }>
      <button
        className={ styles.searchBar__searchButton }
        onClick={ () => {
          if (openable) {
            setOpenSearchBar(!openSearchBar)
          }
        } }
      >
        <CiSearch
          className={ styles.searchBar__menuIcon }
          rotate={ openSearchBar ? 180 : 0 }
        />
      </button>
      <input
        className={ ` 
          ${styles.searchBar__searchInput}
          ${openSearchBar ? styles.searchBar__searchInput__open : ''}
        ` }
        placeholder={ placeHolderTitle }
        onKeyDown={ async (event: KeyboardEvent<HTMLInputElement>) => {
          await handleKeyDown(event)
        } }
        onChange={ (event: ChangeEvent<HTMLInputElement>) => {
          handleChange(event)
        } }
      />
    </div>
  )
}

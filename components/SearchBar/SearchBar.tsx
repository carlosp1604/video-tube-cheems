import { ChangeEvent, FC, KeyboardEvent, useState } from 'react'
import styles from './SearchBar.module.scss'
import { IconButton } from '~/components/IconButton/IconButton'
import { CiSearch } from 'react-icons/ci'

interface Props {
  onChange: (value: string) => void
  onSearch: () => void
  expandable: boolean
  placeHolderTitle: string
}

export const SearchBar: FC<Props> = ({ onChange, onSearch, expandable, placeHolderTitle }) => {
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(!expandable)

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
      <IconButton
        onClick={ () => {
          if (expandable) {
            setOpenSearchBar(!openSearchBar)
          }
        } }
        icon={ <CiSearch /> }
      />
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

import { ChangeEvent, createRef, FC, KeyboardEvent, Ref, useEffect, useState } from 'react'
import styles from './SearchBar.module.scss'
import { CiSearch } from 'react-icons/ci'
import { Tooltip } from '~/components/Tooltip/Tooltip'
import { IconButton } from '~/components/IconButton/IconButton'
import { TfiClose } from 'react-icons/tfi'
import { useTranslation } from 'next-i18next'
import * as uuid from 'uuid'

interface Props {
  onChange: (value: string) => void
  onSearch: () => void
  placeHolderTitle: string
  searchIconTitle: string
  focus: boolean
}

export const SearchBar: FC<Props> = ({ onChange, onSearch, placeHolderTitle, searchIconTitle, focus }) => {
  const [title, setTitle] = useState<string>('')

  const { t } = useTranslation('common')

  const [mounted, setMounted] = useState<boolean>(false)
  const [tooltipId, setTooltipId] = useState<string>('')
  const inputRef: Ref<HTMLInputElement> = createRef()

  useEffect(() => {
    setMounted(true)
    setTooltipId(uuid.v4())

    if (inputRef && inputRef.current && inputRef.current !== document.activeElement) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (focus && inputRef && inputRef.current && inputRef.current !== document.activeElement) {
      inputRef.current.focus()
    }
  }, [focus])

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch()
      event.currentTarget.blur()
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
    setTitle(event.target.value)
  }

  const clearInput = () => {
    setTitle('')
    onChange('')
  }

  return (
    <div className={ styles.searchBar__container }>
      <div className={ styles.searchBar__searchInputContainer }>
        <input
          className={ styles.searchBar__searchInput }
          placeholder={ placeHolderTitle }
          onKeyDown={ async (event: KeyboardEvent<HTMLInputElement>) => { await handleKeyDown(event) } }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => { handleChange(event) } }
          value={ title }
          ref={ inputRef }
          spellCheck={ false }
        />
        { title !== ''
          ? <span className={ styles.searchBar__clearButton }>
            <IconButton
              onClick={ () => clearInput() }
              icon={ <TfiClose /> }
              title={ t('clear_search_button_title') }
              showTooltip={ true }
            />
          </span>
          : null
        }
      </div>
      <button
        className={ styles.searchBar__searchButton }
        onClick={ onSearch }
        data-tooltip-id={ tooltipId }
        data-tooltip-content={ searchIconTitle }
        title={ searchIconTitle }
      >
        <CiSearch/>
        { mounted
          ? <Tooltip
            tooltipId={ tooltipId }
            place={ 'bottom' }
          />
          : null
        }
      </button>
    </div>
  )
}

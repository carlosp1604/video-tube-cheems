import { FC, useMemo, useState } from 'react'
import styles from './Tags.module.scss'
import { TagCardComponentDto } from '~/modules/PostTag/Infrastructure/Dtos/TagCardComponentDto'
import { TagCard } from '~/modules/PostTag/Infrastructure/Components/TagCard/TagCard'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import useTranslation from 'next-translate/useTranslation'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { useToast } from '~/components/AppToast/ToastContext'

export interface Props {
  tagCards: TagCardComponentDto[]
}

export const Tags: FC<Props> = ({ tagCards }) => {
  const [searchBarTerm, setSearchBarTerm] = useState<string>('')
  const [currentTerm, setCurrentTerm] = useState<string>('')
  const { t } = useTranslation('tags')
  const { error } = useToast()

  const tagsToShow = useMemo(() => {
    return tagCards.filter((tag) => {
      return tag.name.toLocaleLowerCase().includes(currentTerm.toLocaleLowerCase())
    })
  }, [currentTerm])

  const onSearch = async () => {
    const dompurify = (await import('dompurify')).default
    const cleanTerm = dompurify.sanitize(searchBarTerm.trim())

    if (!currentTerm && cleanTerm === '') {
      return
    }

    if (currentTerm && currentTerm === cleanTerm) {
      error(t('already_searching_term_error_message'))

      return
    }

    setCurrentTerm(cleanTerm)
    setSearchBarTerm('')
  }

  let galleryHeader

  if (currentTerm) {
    galleryHeader = (
      <CommonGalleryHeader
        title={ 'tags:tags_search_result_title' }
        subtitle={ t('tags_gallery_subtitle', { tagsNumber: tagsToShow.length }) }
        term={ { title: 'searchTerm', value: currentTerm } }
      />
    )
  } else {
    galleryHeader = (
      <CommonGalleryHeader
        title={ t('tags_gallery_title') }
        subtitle={ t('tags_gallery_subtitle', { tagsNumber: tagsToShow.length }) }
      />
    )
  }

  return (
    <div className={ styles.tags__container }>
      { galleryHeader }

      <div className={ styles.tags__searchBar }>
        { currentTerm &&
          <CommonButton
            title={ t('tags_see_all_button_title') }
            disabled={ !currentTerm }
            onClick={ () => setCurrentTerm('') }
          />
        }
        <SearchBar
          onChange={ setSearchBarTerm }
          onSearch={ onSearch }
          placeHolderTitle={ t('tags_search_placeholder_title') }
          searchIconTitle={ t('tags_search_button_title') }
          focus={ false }
          style={ 'sub' }
          clearBarOnSearch={ true }
        />
      </div>

      <section className={ styles.tags__tagsGalleryContainer }>
        { tagsToShow.map((tagCardDto) => (
          <TagCard
            key={ tagCardDto.id }
            tagCardDto={ tagCardDto }/>
        )) }
      </section>

      { tagsToShow.length === 0 &&
        <EmptyState
          title={ t('tags_gallery_empty_state_title') }
          subtitle={ t('tags_gallery_empty_state_subtitle') }
        />
      }
    </div>

  )
}

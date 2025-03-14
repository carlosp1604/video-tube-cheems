import styles from './Actors.module.scss'
import { ActorsPaginationSortingType } from '~/modules/Actors/Infrastructure/Frontend/ActorsPaginationSortingType'
import { FC, useEffect, useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { ActorsApiService } from '~/modules/Actors/Infrastructure/Frontend/ActorsApiService'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import useTranslation from 'next-translate/useTranslation'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { QueryParamsParserConfiguration } from '~/modules/Shared/Infrastructure/FrontEnd/QueryParamsParser'
import { ActorFilterOptions } from '~/modules/Actors/Infrastructure/Frontend/ActorFilterOptions'
import { ActorQueryParamsParser } from '~/modules/Actors/Infrastructure/Frontend/ActorQueryParamsParser'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { useToast } from '~/components/AppToast/ToastContext'
import { ProfileCardDto } from '~/modules/Shared/Infrastructure/FrontEnd/ProfileCardDto'
import { ProfileCardDtoTranslator } from '~/modules/Shared/Infrastructure/FrontEnd/ProfileCardDtoTranslator'
import { ProfileCardGallery } from '~/modules/Shared/Infrastructure/Components/ProfileCardGallery/ProfileCardGallery'
import dynamic from 'next/dynamic'

const SearchBar = dynamic(() =>
  import('~/components/SearchBar/SearchBar').then((module) => module.SearchBar), { ssr: true }
)

export interface ActorsPagePaginationState {
  page: number
  order: ActorsPaginationSortingType
  searchTerm: string
}

export interface Props {
  initialSearchTerm: string
  initialPage: number
  initialOrder: ActorsPaginationSortingType
  initialActors: ProfileCardDto[]
  initialActorsNumber: number
}

export const Actors: FC<Props> = ({
  initialSearchTerm,
  initialActors,
  initialActorsNumber,
  initialPage,
  initialOrder,
}) => {
  const [actors, setActors] = useState<ProfileCardDto[]>(initialActors)
  const [actorsNumber, setActorsNumber] = useState<number>(initialActorsNumber)
  const [pagination, setPagination] = useState<ActorsPagePaginationState>({
    page: initialPage,
    order: initialOrder,
    searchTerm: initialSearchTerm,
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [searchBarTerm, setSearchBarTerm] = useState<string>('')

  const router = useRouter()
  const firstRender = useFirstRender()
  const { t } = useTranslation('actors')
  const { error } = useToast()

  const sortingOptions: ActorsPaginationSortingType[] = [
    PaginationSortingType.POPULARITY,
    PaginationSortingType.NAME_FIRST,
    PaginationSortingType.NAME_LAST,
    // TODO: Add this when is supported by prisma
    // PaginationSortingType.MORE_POSTS,
    // PaginationSortingType.LESS_POSTS,
  ]

  const updateQueryOnSearch = async (producerName: string) => {
    if (producerName) {
      await router.push({
        pathname: '/actors',
        query: {
          [FilterOptions.ACTOR_NAME]: producerName,
        },
      }, undefined, { shallow: true, scroll: true })
    } else {
      await router.push({
        pathname: '/actors',
      }, undefined, { shallow: true, scroll: true })
    }
  }

  const onSearch = async () => {
    const dompurify = (await import('dompurify')).default
    const cleanTerm = dompurify.sanitize(searchBarTerm.trim())

    const queryParams = new ActorQueryParamsParser(router.query, configuration)

    const currentTerm = queryParams.getFilter(FilterOptions.ACTOR_NAME)

    if (!currentTerm && cleanTerm === '') {
      return
    }

    if (currentTerm && currentTerm.value === cleanTerm) {
      error(t('already_searching_term_error_message'))

      return
    }

    await updateQueryOnSearch(cleanTerm)

    setSearchBarTerm('')
  }

  const linkMode: ElementLinkMode = {
    replace: false,
    shallowNavigation: true,
    scrollOnClick: true,
  }

  const configuration:
    Omit<QueryParamsParserConfiguration<ActorFilterOptions, ActorsPaginationSortingType>, 'perPage'> = {
      sortingOptionType: {
        defaultValue: PaginationSortingType.POPULARITY,
        parseableOptionTypes: sortingOptions,
      },
      filters: {
        filtersToParse: [FilterOptions.ACTOR_NAME],
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }

  const updateActors = async (page:number, order: ActorsPaginationSortingType, searchTerm: string) => {
    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    const newActors = await (new ActorsApiService()).getActors(
      page,
      defaultPerPage,
      componentOrder.criteria,
      componentOrder.option,
      searchTerm ? [{ type: FilterOptions.ACTOR_NAME, value: searchTerm }] : []
    )

    if (newActors) {
      setActorsNumber(newActors.actorsNumber)
      setActors(newActors.actors.map((actor) => {
        return ProfileCardDtoTranslator.fromApplicationDto(actor.actor, actor.postsNumber, actor.actorViews)
      }))
    }
  }

  useEffect(() => {
    if (firstRender) {
      return
    }

    const queryParams = new ActorQueryParamsParser(router.query, configuration)

    const newPage = queryParams.page ?? configuration.page.defaultValue
    const newOrder = queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue
    const newSearchTerm = queryParams.getFilter(FilterOptions.ACTOR_NAME)

    if (
      newPage === pagination.page &&
      newOrder === pagination.order &&
      (newSearchTerm && newSearchTerm.value === pagination.searchTerm)
    ) {
      return
    }

    setPagination({ page: newPage, order: newOrder, searchTerm: newSearchTerm?.value ?? '' })

    setLoading(true)
    updateActors(newPage, newOrder, newSearchTerm?.value ?? '')
      .then(() => {
        setLoading(false)
      })
  }, [router.query])

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ pagination.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ actorsNumber > defaultPerPage }
      linkMode={ linkMode }
    />
  )

  const emptyState = (
    <EmptyState
      title={ t('actors_gallery_empty_state_title') }
      subtitle={ t('actors_gallery_empty_state_subtitle') }
    />
  )

  let galleryHeader

  if (pagination.searchTerm) {
    galleryHeader = (
      <CommonGalleryHeader
        title={ 'actors:actors_search_result_title' }
        subtitle={ t('actors_gallery_subtitle', { actorsNumber }) }
        loading={ loading }
        sortingMenu={ sortingMenu }
        term={ { title: 'searchTerm', value: pagination.searchTerm } }
        tag={ 'h1' }
      />
    )
  } else {
    galleryHeader = (
      <CommonGalleryHeader
        title={ t('actors_gallery_title') }
        subtitle={ t('actors_gallery_subtitle', { actorsNumber }) }
        loading={ loading }
        sortingMenu={ sortingMenu }
        tag={ 'h1' }
      />
    )
  }

  return (
    <div className={ styles.actors__container }>
      { galleryHeader }

      <div className={ styles.actors__searchBar }>
        { pagination.searchTerm &&
          <CommonButton
            title={ t('actors_see_all_button_title') }
            disabled={ !pagination.searchTerm }
            onClick={ async () => await updateQueryOnSearch('') }
          />
        }
        <SearchBar
          onChange={ setSearchBarTerm }
          onSearch={ onSearch }
          placeHolderTitle={ t('actors_search_placeholder_title') }
          searchIconTitle={ t('actors_search_button_title') }
          focus={ true }
          style={ 'sub' }
          clearBarOnSearch={ true }
        />
      </div>

      <ProfileCardGallery
        profiles={ actors }
        type={ 'actors' }
        loading={ loading }
        emptyState={ emptyState }
      />

      <PaginationBar
        key={ router.asPath }
        pageNumber={ pagination.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(actorsNumber, defaultPerPage) }
        disabled={ loading }
        linkMode={ linkMode }
        onPageChange={ () => window.scrollTo({ top: 0 }) }
      />
    </div>
  )
}

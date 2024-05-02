import styles from './Producers.module.scss'
import { ActorsPaginationSortingType } from '~/modules/Actors/Infrastructure/Frontend/ActorsPaginationSortingType'
import { FC, useEffect, useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import useTranslation from 'next-translate/useTranslation'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
import {
  ProducerCardGallery
} from '~/modules/Producers/Infrastructure/Components/ProducerCard/ProducerCardGallery/ProducerCardGallery'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import {
  ProducersPaginationSortingType
} from '~/modules/Producers/Infrastructure/Frontend/ProducersPaginationSortingType'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { ProducersApiService } from '~/modules/Producers/Infrastructure/Frontend/ProducersApiService'
import { ProducerCardDtoTranslator } from '~/modules/Producers/Infrastructure/ProducerCardDtoTranslator'
import { ProducerFilterOptions } from '~/modules/Producers/Infrastructure/Frontend/ProducerFilterOptions'
import { QueryParamsParserConfiguration } from '~/modules/Shared/Infrastructure/FrontEnd/QueryParamsParser'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'
import { ProducerQueryParamsParser } from '~/modules/Producers/Infrastructure/Frontend/ProducerQueryParamsParser'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'

export interface ProducersPagePaginationState {
  page: number
  order: ProducersPaginationSortingType
  searchTerm: string
}

export interface Props {
  initialSearchTerm: string
  initialPage: number
  initialOrder: ProducersPaginationSortingType
  initialProducers: ProducerCardDto[]
  initialProducersNumber: number
}

export const Producers: FC<Props> = ({
  initialSearchTerm,
  initialProducers,
  initialProducersNumber,
  initialPage,
  initialOrder,
}) => {
  const [producers, setProducers] = useState<ProducerCardDto[]>(initialProducers)
  const [producersNumber, setProducersNumber] = useState<number>(initialProducersNumber)
  const [pagination, setPagination] = useState<ProducersPagePaginationState>({
    page: initialPage,
    order: initialOrder,
    searchTerm: initialSearchTerm,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [searchBarTerm, setSearchBarTerm] = useState<string>('')

  const router = useRouter()
  const firstRender = useFirstRender()
  const { t } = useTranslation('producers')

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
        pathname: '/producers',
        query: {
          [FilterOptions.PRODUCER_NAME]: producerName,
        },
      }, undefined, { shallow: true, scroll: true })
    } else {
      await router.push({
        pathname: '/producers',
      }, undefined, { shallow: true, scroll: true })
    }
  }

  const onSearch = async () => {
    const toast = (await import('react-hot-toast')).default

    const dompurify = (await import('dompurify')).default
    const cleanTerm = dompurify.sanitize(searchBarTerm.trim())

    const queryParams = new ProducerQueryParamsParser(router.query, configuration)

    const currentTerm = queryParams.getFilter(FilterOptions.PRODUCER_NAME)

    if (!currentTerm && cleanTerm === '') {
      return
    }

    if (currentTerm && currentTerm.value === cleanTerm) {
      toast.error(t('already_searching_term_error_message'))

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
    Omit<QueryParamsParserConfiguration<ProducerFilterOptions, ProducersPaginationSortingType>, 'perPage'> = {
      sortingOptionType: {
        defaultValue: PaginationSortingType.POPULARITY,
        parseableOptionTypes: sortingOptions,
      },
      filters: {
        filtersToParse: [FilterOptions.PRODUCER_NAME],
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }

  const updateProducers = async (page:number, order: ProducersPaginationSortingType, searchTerm: string) => {
    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    const newProducers = await (new ProducersApiService()).getProducers(
      page,
      defaultPerPage,
      componentOrder.criteria,
      componentOrder.option,
      searchTerm ? [{ type: FilterOptions.PRODUCER_NAME, value: searchTerm }] : []
    )

    if (newProducers) {
      setProducersNumber(newProducers.producersNumber)
      setProducers(newProducers.producers.map((producer) => {
        return ProducerCardDtoTranslator
          .fromApplicationDto(producer.producer, producer.postsNumber, producer.producerViews)
      }))
    }
  }

  useEffect(() => {
    if (firstRender) {
      return
    }

    const queryParams = new ProducerQueryParamsParser(router.query, configuration)

    const newPage = queryParams.page ?? configuration.page.defaultValue
    const newOrder = queryParams.sortingOptionType ?? configuration.sortingOptionType.defaultValue
    const newSearchTerm = queryParams.getFilter(FilterOptions.PRODUCER_NAME)

    if (
      newPage === pagination.page &&
      newOrder === pagination.order &&
      (newSearchTerm && newSearchTerm.value === pagination.searchTerm)
    ) {
      return
    }

    setPagination({ page: newPage, order: newOrder, searchTerm: newSearchTerm?.value ?? '' })

    setLoading(true)
    updateProducers(newPage, newOrder, newSearchTerm?.value ?? '')
      .then(() => {
        setLoading(false)
      })
  }, [router.query])

  const sortingMenu = (
    <SortingMenuDropdown
      activeOption={ pagination.order }
      options={ sortingOptions }
      loading={ loading }
      visible={ producersNumber > defaultPerPage }
      linkMode={ linkMode }
    />
  )

  const emptyState = (
    <EmptyState
      title={ t('producers_gallery_empty_state_title') }
      subtitle={ t('producers_gallery_empty_state_subtitle') }
    />
  )

  let galleryHeader

  if (pagination.searchTerm) {
    galleryHeader = (
      <CommonGalleryHeader
        title={ 'producers:producers_search_result_title' }
        subtitle={ t('producers_gallery_subtitle', { producersNumber }) }
        loading={ loading }
        sortingMenu={ sortingMenu }
        term={ { title: 'searchTerm', value: pagination.searchTerm } }
      />
    )
  } else {
    galleryHeader = (
      <CommonGalleryHeader
        title={ t('producers_gallery_title') }
        subtitle={ t('producers_gallery_subtitle', { producersNumber }) }
        loading={ loading }
        sortingMenu={ sortingMenu }
      />
    )
  }

  return (
    <div className={ styles.producers__container }>
      { galleryHeader }

      <div className={ styles.producers__searchBar }>
        { pagination.searchTerm &&
          <CommonButton
            title={ t('producers_see_all_button_title') }
            disabled={ !pagination.searchTerm }
            onClick={ async () => await updateQueryOnSearch('') }
          />
        }
        <SearchBar
          onChange={ setSearchBarTerm }
          onSearch={ onSearch }
          placeHolderTitle={ t('producers_search_placeholder_title') }
          searchIconTitle={ t('producers_search_button_title') }
          focus={ true }
          style={ 'sub' }
          clearBarOnSearch={ true }
        />
      </div>

      <ProducerCardGallery
        producers={ producers }
        loading={ loading }
        emptyState={ emptyState }
      />

      <PaginationBar
        key={ router.asPath }
        pageNumber={ pagination.page }
        pagesNumber={ PaginationHelper.calculatePagesNumber(producersNumber, defaultPerPage) }
        disabled={ loading }
        linkMode={ linkMode }
        onPageChange={ () => window.scrollTo({ top: 0 }) }
      />
    </div>
  )
}

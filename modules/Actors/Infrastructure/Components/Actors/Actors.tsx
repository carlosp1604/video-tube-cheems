import styles from './Actors.module.scss'
import { ActorCardDto } from '~/modules/Actors/Infrastructure/ActorCardDto'
import { ActorsPaginationSortingType } from '~/modules/Actors/Infrastructure/Frontend/ActorsPaginationSortingType'
import { FC, useEffect, useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { ActorsApiService } from '~/modules/Actors/Infrastructure/Frontend/ActorsApiService'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ActorCardDtoTranslator } from '~/modules/Actors/Infrastructure/ActorCardDtoTranslator'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import {
  fromOrderTypeToComponentSortingOption,
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { ActorCardGallery } from '~/modules/Actors/Infrastructure/Components/ActorCardGallery/ActorCardGallery'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'
import useTranslation from 'next-translate/useTranslation'
import { CommonGalleryHeader } from '~/modules/Shared/Infrastructure/Components/CommonGalleryHeader/CommonGalleryHeader'
import { EmptyState } from '~/components/EmptyState/EmptyState'
import { SearchBar } from '~/components/SearchBar/SearchBar'
import { QueryParamsParserConfiguration } from '~/modules/Shared/Infrastructure/FrontEnd/QueryParamsParser'
import { ActorFilterOptions } from '~/modules/Actors/Infrastructure/Frontend/ActorFilterOptions'
import { ActorQueryParamsParser } from '~/modules/Actors/Infrastructure/Frontend/ActorQueryParamsParser'
import { FilterOptions } from '~/modules/Shared/Infrastructure/FrontEnd/FilterOptions'

export interface ActorsPagePaginationState {
  page: number
  order: ActorsPaginationSortingType
}

export interface Props {
  initialPage: number
  initialOrder: ActorsPaginationSortingType
  initialActors: ActorCardDto[]
  initialActorsNumber: number
}

export const Actors: FC<Props> = ({
  initialActors,
  initialActorsNumber,
  initialPage,
  initialOrder,
}) => {
  const [actors, setActors] = useState<ActorCardDto[]>(initialActors)
  const [actorsNumber, setActorsNumber] = useState<number>(initialActorsNumber)
  const [pagination, setPagination] = useState<ActorsPagePaginationState>({ page: initialPage, order: initialOrder })
  const [loading, setLoading] = useState<boolean>(false)
  const [searchFilter, setSearchFilter] = useState<string>('')

  const router = useRouter()
  const firstRender = useFirstRender()
  const { t } = useTranslation('actors')

  const sortingOptions: ActorsPaginationSortingType[] = [
    PaginationSortingType.POPULARITY,
    PaginationSortingType.NAME_FIRST,
    PaginationSortingType.NAME_LAST,
    // TODO: Add this when is supported by prisma
    // PaginationSortingType.MORE_POSTS,
    // PaginationSortingType.LESS_POSTS,
  ]

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

  const updateActors = async (page:number, order: ActorsPaginationSortingType) => {
    const componentOrder = fromOrderTypeToComponentSortingOption(order)

    const newActors = await (new ActorsApiService()).getActors(
      page,
      defaultPerPage,
      componentOrder.criteria,
      componentOrder.option
    )

    if (newActors) {
      setActorsNumber(newActors.actorsNumber)
      setActors(newActors.actors.map((actor) => {
        return ActorCardDtoTranslator.fromApplicationDto(actor.actor, actor.postsNumber, actor.actorViews)
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

    if (newPage === pagination.page && newOrder === pagination.order) {
      return
    }

    setPagination({ page: newPage, order: newOrder })

    setLoading(true)
    updateActors(newPage, newOrder)
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

  return (
    <div className={ styles.actors__container }>
      <CommonGalleryHeader
        title={ t('actors_gallery_title') }
        subtitle={ t('actors_gallery_subtitle', { actorsNumber }) }
        loading={ loading }
        sortingMenu={ sortingMenu }
      />

      <div className={ styles.actors__searchBar }>
        <SearchBar
          onChange={ (value: string) => console.log(value) }
          onSearch={ () => console.log('Click') }
          placeHolderTitle={ t('app_menu_search_menu_placeholder_title') }
          searchIconTitle={ t('app_menu_search_button_title') }
          focus={ true }
        />
      </div>

      <ActorCardGallery
        actors={ actors }
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

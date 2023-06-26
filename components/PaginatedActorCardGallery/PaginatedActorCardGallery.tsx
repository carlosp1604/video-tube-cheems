import { FC, useEffect, useRef, useState } from 'react'
import styles from './PaginatedActorCardGallery.module.scss'
import { ActorsApiService } from '~/modules/Actors/Infrastructure/Frontend/ActorsApiService'
import {
  defaultSortingOption,
  SortingOption,
  sortingOptions
} from '~/components/SortingMenuDropdown/SortingMenuDropdownOptions'
import { SortingMenuDropdown } from '~/components/SortingMenuDropdown/SortingMenuDropdown'
import { ActorComponentDto } from '~/modules/Actors/Infrastructure/ActorComponentDto'
import { FetchPostsFilter } from '~/modules/Posts/Infrastructure/FetchPostsFilter'
import { calculatePagesNumber, defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { GetActorsApplicationDto } from '~/modules/Actors/Application/GetActorsApplicationDto'
import { ActorComponentDtoTranslator } from '~/modules/Actors/Infrastructure/ActorComponentDtoTranslator'
import { ActorCardList } from '~/modules/Actors/Infrastructure/Components/ActorCardList'
import { PaginationBar } from '~/components/PaginationBar/PaginationBar'

const useFirstRender = () => {
  const firstRender = useRef(true)

  useEffect(() => {
    firstRender.current = false
  }, [])

  return firstRender.current
}

interface Props {
  title: string
  initialActors: ActorComponentDto[]
  initialActorsNumber: number
  filters: FetchPostsFilter[]
}

export const PaginatedActorCardGallery: FC<Props> = ({
  title,
  initialActors,
  initialActorsNumber,
  filters,
}) => {
  const [pagesNumber, setPagesNumber] = useState<number>(calculatePagesNumber(initialActorsNumber, defaultPerPage))
  const [pageNumber, setPageNumber] = useState(1)
  const [currentActors, setCurrentActors] = useState<ActorComponentDto[]>(initialActors)
  const [activeSortingOption, setActiveSortingOption] = useState<SortingOption>(defaultSortingOption)
  const [actorsNumber, setActorsNumber] = useState<number>(initialActorsNumber)
  const firstRender = useFirstRender()

  const apiService = new ActorsApiService()

  const fetchActors = async (): Promise<GetActorsApplicationDto> => {
    return apiService.getActors(
      pageNumber,
      defaultPerPage,
      activeSortingOption.criteria,
      activeSortingOption.option,
      filters
    )
  }

  const updatePosts = async () => {
    const actors = await fetchActors()

    setCurrentActors(actors.actors.map((actor) => {
      return ActorComponentDtoTranslator.fromApplicationDto(actor)
    }))
    setActorsNumber(actors.actorsNumber)
    setPagesNumber(calculatePagesNumber(actors.actorsNumber, defaultPerPage))
  }

  useEffect(() => {
    if (pageNumber === 1 && !firstRender) {
      updatePosts()
    }

    setPageNumber(1)
  }, [filters])

  useEffect(() => {
    if (!firstRender) {
      updatePosts()
    }
  }, [pageNumber])

  return (
    <div className={ styles.paginatedActorCardGallery__container }>
      <div className={ styles.paginatedActorCardGallery__header }>

        <h1 className={ styles.paginatedActorCardGallery__title }>
          { title }
          <small className={ styles.paginatedActorCardGallery__videosQuantity }>
            { `${actorsNumber} videos` }
          </small>
        </h1>

        <SortingMenuDropdown
          activeOption={ activeSortingOption }
          onChangeOption={ (option: SortingOption) => setActiveSortingOption(option) }
          options={ sortingOptions }
        />
      </div>

      <ActorCardList
        actors={ currentActors }
      />

      <PaginationBar
        pageNumber={ pageNumber }
        setPageNumber={ setPageNumber }
        pagesNumber={ pagesNumber }
      />
    </div>
  )
}

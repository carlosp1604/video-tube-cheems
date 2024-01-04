import { FC, useEffect, useRef, useState } from 'react'
import styles from './PaginatedActorCardGallery.module.scss'
import { ActorsApiService } from '~/modules/Actors/Infrastructure/Frontend/ActorsApiService'
import {
  NewestPostsSortingOption,
  ComponentSortingOption
} from '~/components/SortingMenuDropdown/ComponentSortingOptions'
import { ActorComponentDto } from '~/modules/Actors/Infrastructure/ActorComponentDto'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'
import { GetActorsApplicationDto } from '~/modules/Actors/Application/GetActorsApplicationDto'
import { ActorComponentDtoTranslator } from '~/modules/Actors/Infrastructure/ActorComponentDtoTranslator'
import { ActorCardList } from '~/modules/Actors/Infrastructure/Components/ActorCardList'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'

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
  const [pagesNumber, setPagesNumber] = useState<number>(
    PaginationHelper.calculatePagesNumber(initialActorsNumber, defaultPerPage))
  const [pageNumber, setPageNumber] = useState(1)
  const [currentActors, setCurrentActors] = useState<ActorComponentDto[]>(initialActors)
  const [activeSortingOption, setActiveSortingOption] = useState<ComponentSortingOption>(NewestPostsSortingOption)
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
    setPagesNumber(PaginationHelper.calculatePagesNumber(actors.actorsNumber, defaultPerPage))
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

      </div>

      <ActorCardList
        actors={ currentActors }
      />
    </div>
  )
}

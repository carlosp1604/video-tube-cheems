import { FC, useEffect, useRef, useState } from 'react'
import styles from './PaginatedActorCardGallery.module.scss'
import { ActorsApiService } from '~/modules/Actors/Infrastructure/Frontend/ActorsApiService'
import { ActorCardDto } from '~/modules/Actors/Infrastructure/ActorCardDto'
import { FetchPostsFilter } from '~/modules/Shared/Infrastructure/FetchPostsFilter'
import { ActorCardGallery } from '~/modules/Actors/Infrastructure/Components/ActorCardGallery/ActorCardGallery'
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
  initialActors: ActorCardDto[]
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
  const [currentActors, setCurrentActors] = useState<ActorCardDto[]>(initialActors)
  // const [activeSortingOption, setActiveSortingOption] = useState<ComponentSortingOption>(NewestPostsSortingOption)
  const [actorsNumber, setActorsNumber] = useState<number>(initialActorsNumber)
  const firstRender = useFirstRender()

  const apiService = new ActorsApiService()

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

      <ActorCardGallery
        actors={ initialActors }
      />
    </div>
  )
}

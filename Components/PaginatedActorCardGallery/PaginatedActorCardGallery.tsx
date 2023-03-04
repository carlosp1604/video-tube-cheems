import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { GetActorsApplicationDto } from '../../modules/Actors/Application/GetActorsApplicationDto'
import { ActorComponentDto } from '../../modules/Actors/Infrastructure/ActorComponentDto'
import { ActorComponentDtoTranslator } from '../../modules/Actors/Infrastructure/ActorComponentDtoTranslator'
import { ActorCardList } from '../../modules/Actors/Infrastructure/Components/ActorCardList'
import { FetchPostsFilter } from '../../modules/Shared/Infrastructure/InfrastructureFilter'
import { calculatePagesNumber, defaultPerPage } from '../../modules/Shared/Infrastructure/Pagination'
import { PaginationBar } from '../PaginationBar/PaginationBar'
import styles from './PaginatedActorCardGallery.module.scss'

const useFirstRender = () => {
  const firstRender = useRef(true)

  useEffect(() => {
    firstRender.current = false
  }, [])

  return firstRender.current
}

interface Props {
  actors: ActorComponentDto[]
  actorsNumber: number,
  setActorsNumber: Dispatch<SetStateAction<number>>
  filters: FetchPostsFilter[]
}

export const PaginatedActorCardGallery: FC<Props> = ({
  actors,
  actorsNumber,
  setActorsNumber,
  filters,
}) => {
  const [pagesNumber, setPagesNumber] = useState<number>(
    calculatePagesNumber(actorsNumber, defaultPerPage)
  )
  const [pageNumber, setPageNumber] = useState(1)
  const [currentActors, setCurrentActors] = useState<ActorComponentDto[]>(actors)
  const firstRender = useFirstRender()

  const buildSearchParams = (): URLSearchParams => {
    let params = new URLSearchParams()
    params.append('page', pageNumber.toString())
    params.append('perPage', defaultPerPage.toString())
    
    for (const filter of filters) {
      if (filter.value !== null) {
        params.append(filter.type, filter.value)
      }
    }

    return params
  }

  const fetchActors = async (): Promise<GetActorsApplicationDto> => {
    const params = buildSearchParams().toString()
    return ((await fetch(`/api/actors${params}`)).json())
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
    <div className={styles.paginatedActorCardGallery__container}>
      <ActorCardList
        actors={currentActors}
      />

      <PaginationBar
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pagesNumber={pagesNumber}
        scrollToTopWhenPageChanges={ true }
      />
    </div>
  )
}
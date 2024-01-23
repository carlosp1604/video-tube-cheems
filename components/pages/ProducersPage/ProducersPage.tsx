import { NextPage } from 'next'
import styles from './ProducersPage.module.scss'
import { ActorsPaginationSortingType } from '~/modules/Actors/Infrastructure/Frontend/ActorsPaginationSortingType'
import { useState } from 'react'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import {
  ActorsPaginationConfiguration
} from '~/modules/Actors/Infrastructure/Frontend/ActorPaginationQueryParams'
import { useRouter } from 'next/router'
import { useFirstRender } from '~/hooks/FirstRender'
import {
  PaginationSortingType
} from '~/modules/Shared/Infrastructure/FrontEnd/PaginationSortingType'
import { useTranslation } from 'next-i18next'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
import {
  ProducerCardGallery
} from '~/modules/Producers/Infrastructure/Components/ProducerCard/ProducerCardGallery/ProducerCardGallery'

export interface ProducersPagePaginationState {
  page: number
  order: ActorsPaginationSortingType
}

export interface ProducersPageProps {
  // initialPage: number
  // initialOrder: PaginationSortingType
  initialProducers: ProducerCardDto[]
  initialProducersNumber: number
}

export const ProducersPage: NextPage<ProducersPageProps> = ({
  initialProducers,
  initialProducersNumber,
  // initialPage,
  // initialOrder,
}) => {
  const [producers, setProducers] = useState<ProducerCardDto[]>(initialProducers)
  const [producersNumber, setProducersNumber] = useState<number>(initialProducersNumber)
  // const [pagination, setPagination] = useState<ActorsPagePaginationState>({ page: initialPage, order: initialOrder })
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const firstRender = useFirstRender()
  const { t } = useTranslation('actors_page')

  const sortingOptions: ActorsPaginationSortingType[] = [
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

  const configuration: Partial<ActorsPaginationConfiguration> &
    Pick<ActorsPaginationConfiguration, 'page' | 'sortingOptionType'> = {
      sortingOptionType: {
        defaultValue: PaginationSortingType.NAME_FIRST,
        parseableOptionTypes: sortingOptions,
      },
      page: { defaultValue: 1, minValue: 1, maxValue: Infinity },
    }

  /**
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
        return ActorCardDtoTranslator.fromApplicationDto(actor.actor, actor.postsNumber)
      }))
    }
  }

  useEffect(() => {
    if (firstRender) {
      return
    }

    const queryParams = new ActorsPaginationQueryParams(router.query, configuration)

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
 */

  return (
    <div className={ styles.actorsPage__container }>
      <ProducerCardGallery
        producers={ initialProducers }
        loading={ loading }
      />
    </div>
  )
}

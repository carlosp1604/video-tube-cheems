import { FC, ReactElement } from 'react'
import styles from './ProducerCardGallery.module.scss'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
import { ProducerCard } from '~/modules/Producers/Infrastructure/Components/ProducerCard/ProducerCard'
import {
  ProducerCardSkeleton
} from '~/modules/Producers/Infrastructure/Components/ProducerCard/ProducerCardSkeleton/ProducerCardSkeleton'

interface Props {
  producers: ProducerCardDto[]
  loading: boolean
  emptyState: ReactElement | null
}

export const ProducerCardGallery: FC<Partial<Props> & Pick<Props, 'producers'>> = ({
  producers,
  loading = false,
  emptyState = null,
}) => {
  let producersSkeletonNumber

  if (producers.length <= defaultPerPage) {
    producersSkeletonNumber = defaultPerPage - producers.length
  } else {
    producersSkeletonNumber = producers.length % defaultPerPage
  }

  const skeletonProducers = Array.from(Array(producersSkeletonNumber).keys())
    .map((index) => (
      <ProducerCardSkeleton key={ index }/>
    ))

  const producerCards = producers.map((producer) => {
    return (
      <ProducerCard
        producer={ producer }
        key={ producer.id }
      />
    )
  })

  let content: ReactElement | null = (
    <div className={ `
      ${styles.producerCardGallery__container}
      ${loading ? styles.producerCardGallery__container__loading : ''}
    ` }
    >
      { producerCards }
      { loading ? skeletonProducers : null }
    </div>
  )

  if (!loading && producers.length === 0) {
    content = emptyState
  }

  return content
}

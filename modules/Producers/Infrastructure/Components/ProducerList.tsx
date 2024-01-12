import { CSSProperties, FC, ReactElement } from 'react'
import styles from './ProducerList.module.scss'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { useTranslation } from 'next-i18next'
import { Carousel } from '~/components/Carousel/Carousel'
import Link from 'next/link'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'

interface Props {
  producers: ProducerComponentDto[]
  activeProducer: ProducerComponentDto | null
}

export const ProducerList: FC<Props> = ({ producers, activeProducer }) => {
  const { t } = useTranslation('home_page')

  const buildProducerElement = (producer: ProducerComponentDto) => {
    let href = `/?producerSlug=${producer.slug}`

    if (producer.slug === allPostsProducerDto.slug) {
      href = '/'
    }

    let component: ReactElement

    if (activeProducer?.slug === producer.slug) {
      component = (
        <span
          className={ `${styles.producerList__category}
          ${activeProducer?.id === producer.id ? styles.producerList__categoryActive : ''}
          ` }
          style={ {
            '--category-color': producer.brandHexColor,
          } as CSSProperties }
        >
          { producer.id === '' ? t('all_producers_title') : producer.name }
        </span>
      )
    } else {
      component = (
        <Link
          href={ href }
          scroll={ false }
          shallow={ true }
          className={ `${styles.producerList__category}
          ${activeProducer?.id === producer.id ? styles.producerList__categoryActive : ''}
          ` }
          style={ {
            '--category-color': producer.brandHexColor,
          } as CSSProperties }
        >
          { producer.id === '' ? t('all_producers_title') : producer.name }
        </Link>
      )
    }

    return ({
      key: producer.id,
      component,
    })
  }

  return (
    <Carousel
      onEndReached={ undefined }
      itemsAutoWidth={ true }
    >
      { producers.map((producer) => { return buildProducerElement(producer) }) }
    </Carousel>
  )
}

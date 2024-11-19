import { CSSProperties, FC, ReactElement } from 'react'
import styles from './ProducerList.module.scss'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import useTranslation from 'next-translate/useTranslation'
import { Carousel } from '~/components/Carousel/Carousel'
import Link from 'next/link'
import { allPostsProducerDto } from '~/modules/Producers/Infrastructure/Components/AllPostsProducerDto'
import { FaArrowTrendUp } from 'react-icons/fa6'
import { BsWebcam } from 'react-icons/bs'

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
          key={ href }
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
          key={ href }
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

  // FIXME: Workaround to add a new link to producer list
  const trendingPostsLink = (
    <Link
      href={ '/posts/top' }
      shallow={ true }
      className={ styles.producerList__trending }
      key={ '/posts/top' }
    >
      <FaArrowTrendUp />
      { t('trending_posts_button_title') }
    </Link>
  )

  // FIXME: Workaround to add a new link to producer list
  const imLiveCamsLink = (
    <Link
      href={
        'https://imlive.com/wmaster2.ashx?wid=126677699010&LinkID=701&promocode=00000&QueryID=499&from=freevideo6'
      }
      shallow={ true }
      className={ styles.producerList__trending }
      key={ 'imLiveCamsLink' }
    >
      <BsWebcam />
      { t('live_cams_posts_button_title') }
    </Link>
  )

  const producerList = producers.map((producer) => {
    return buildProducerElement(producer)
  })

  producerList.unshift({ component: imLiveCamsLink, key: t('live_cams_posts_button_title') })
  producerList.unshift({ component: trendingPostsLink, key: t('trending_posts_button_title') })

  return (
    <Carousel
      onEndReached={ undefined }
      itemsAutoWidth={ true }
    >
      { producerList }
    </Carousel>
  )
}

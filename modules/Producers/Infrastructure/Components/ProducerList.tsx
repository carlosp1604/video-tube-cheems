import { CSSProperties, FC } from 'react'
import styles from './ProducerList.module.scss'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { useTranslation } from 'next-i18next'
import { Carousel } from '~/components/Carousel/Carousel'

interface Props {
  producers: ProducerComponentDto[]
  onChangeProducer: (producer: ProducerComponentDto) => void
  activeProducer: ProducerComponentDto
}

export const ProducerList: FC<Props> = ({ producers, activeProducer, onChangeProducer }) => {
  const { t } = useTranslation('home_page')

  return (
    <Carousel
      onEndReached={ undefined }
      itemsAutoWidth={ true }
    >
      { producers.map((producer) => {
        return ({
          key: producer.id,
          component:
            <button
              className={ `
                ${styles.producerList__category}
                ${activeProducer.id === producer.id ? styles.producerList__categoryActive : ''}
              ` }
              key={ producer.id }
              onClick={ () => onChangeProducer(producer) }
              style={ {
                '--category-color': producer.brandHexColor,
              } as CSSProperties }
            >
              { producer.id === '' ? t('all_producers_title') : producer.name }
            </button>,
        })
      }) }
    </Carousel>
  )
}

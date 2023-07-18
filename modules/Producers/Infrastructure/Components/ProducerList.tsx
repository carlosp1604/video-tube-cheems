import { CSSProperties, Dispatch, FC, SetStateAction } from 'react'
import styles from './ProducerList.module.scss'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'
import { useTranslation } from 'next-i18next'
import { Carousel } from '~/components/Carousel/Carousel'

interface Props {
  producers: ProducerComponentDto[]
  setActiveProducer: Dispatch<SetStateAction<ProducerComponentDto>>
  activeProducer: ProducerComponentDto
}

export const ProducerList: FC<Props> = ({ producers, activeProducer, setActiveProducer }) => {
  const { t } = useTranslation('all_producers')

  return (
    <Carousel onEndReached={ undefined }>
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
              onClick={ () => setActiveProducer(producer) }
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

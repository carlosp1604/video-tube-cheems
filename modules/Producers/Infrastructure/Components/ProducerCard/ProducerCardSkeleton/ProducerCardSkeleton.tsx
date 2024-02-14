import styles from './ProducerCardSkeleton.module.scss'
import { FC } from 'react'

export const ProducerCardSkeleton: FC = () => {
  return (
    <div className={ styles.producerCardSkeleton__container }>
      <div className={ styles.producerCardSkeleton__imageWrapper }>
        <span className={ styles.producerCardSkeleton__producerImage }/>
      </div>
      <div className={ styles.producerCardSkeleton__dataContainer }>
        <span className={ styles.producerCardSkeleton__producerName } />
        <div className={ styles.producerCardSkeleton__countSection }>
          <span className={ styles.producerCardSkeleton__countItem } />
          <span className={ styles.producerCardSkeleton__countItem } />
        </div>
      </div>
    </div>

  )
}

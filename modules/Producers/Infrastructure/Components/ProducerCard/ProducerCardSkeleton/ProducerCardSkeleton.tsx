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
        <span className={ styles.producerCardSkeleton__postsNumber } />
      </div>
    </div>

  )
}

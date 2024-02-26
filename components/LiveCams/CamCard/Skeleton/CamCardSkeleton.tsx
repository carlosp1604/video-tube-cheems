import { FC } from 'react'
import styles from './CamCardSkeleton.module.scss'

interface Props {
  loading: boolean
}

export const CamCardSkeleton: FC<Props> = ({ loading }) => {
  return (
    <div className={ `
      ${styles.camCardSkeleton__container}
      ${loading ? styles.camCardSkeleton__container__loading : ''}
    ` }>
      <span className={ styles.camCardSkeleton__media }></span>
      <span className={ styles.camCardSkeleton__title }></span>
      <div className={ styles.camCardSkeleton__description }>
        <span className={ styles.camCardSkeleton__descriptionLine }></span>
        <span className={ styles.camCardSkeleton__descriptionLine }></span>

      </div>
    </div>
  )
}

import { FC } from 'react'
import styles from './EmptyState.module.scss'
import { HiOutlineDocumentMagnifyingGlass } from 'react-icons/hi2'

interface Props {
  title: string
  subtitle: string
}

export const EmptyState: FC<Props> = ({ title, subtitle }) => {
  return (
    <div className={ styles.emptyState__container }>
      <span className={ styles.emptyState__iconWrapper }>
        <HiOutlineDocumentMagnifyingGlass className={ styles.emptyState__icon }/>
      </span>
      <span className={ styles.emptyState__title }>
        { title }
        <small className={ styles.emptyState__subtitle }>
          { subtitle }
        </small>
      </span>
    </div>
  )
}

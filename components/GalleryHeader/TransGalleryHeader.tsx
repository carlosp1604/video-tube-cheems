import { FC, ReactElement, ReactNode } from 'react'
import styles from './TransGalleryHeader.module.scss'

interface Props {
  title: ReactNode
  subtitle: string
  loading: boolean
  sortingMenu: ReactElement | null
}

export const TransGalleryHeader: FC<Partial<Props> & Omit<Props, 'loading' | 'sortingMenu'>> = ({
  title,
  subtitle,
  loading = false,
  sortingMenu = null,
}) => {
  let subtitleContent: ReactNode = (
    <small className={ styles.transGalleryHeader__quantity }>
      { subtitle }
    </small>
  )

  if (loading) {
    subtitleContent = (
      <span className={ styles.transGalleryHeader__quantitySkeeleton }/>
    )
  }

  return (
    <section className={ styles.transGalleryHeader__container }>
      <div className={ styles.transGalleryHeader__titleElement }>
        { title }
      </div>

      { subtitleContent }

      <div className={ styles.transGalleryHeader__sortingElement }>
        { sortingMenu }
      </div>
    </section>
  )
}

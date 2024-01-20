import { FC, ReactNode } from 'react'
import styles from './GalleryHeader.module.scss'

interface Props {
  title: string | ReactNode
  subtitle: string
  loading: boolean
  sortingMenu: ReactNode | null
}

export const GalleryHeader: FC<Partial<Props> & Omit<Props, 'loading' | 'sortingMenu'>> = ({
  title,
  subtitle,
  loading = false,
  sortingMenu = null,
}) => {
  let subtitleContent: ReactNode = (
    <h2 className={ styles.galleryHeader__quantity }>
      { subtitle }
    </h2>
  )

  if (loading) {
    subtitleContent = (
      <span className={ styles.galleryHeader__quantitySkeeleton }/>
    )
  }

  return (
    <section className={ styles.galleryHeader__container }>
      <h1 className={ styles.galleryHeader__title }>
        { title }
      </h1>

      { subtitleContent }

      <div className={ styles.galleryHeader__sortingElement }>
       { sortingMenu }
      </div>
    </section>
  )
}

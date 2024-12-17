import { FC, ReactElement, ReactNode } from 'react'
import styles from './CommonGalleryHeader.module.scss'
import Trans from 'next-translate/Trans'

export type HeaderTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

export interface TitleTerm {
  title: string
  value: string
}

interface Props {
  title: string
  term: TitleTerm | undefined
  subtitle: string
  loading: boolean
  sortingMenu: ReactElement | null
  tag: HeaderTag
}

export const CommonGalleryHeader: FC<Partial<Props> & Omit<Props, 'loading' | 'sortingMenu' | 'term' | 'tag'>> = ({
  title,
  subtitle,
  loading = false,
  sortingMenu = null,
  term = undefined,
  tag = 'span',
}) => {
  let subtitleContent: ReactNode = (
    <small className={ styles.commonGalleryHeader__quantity }>
      { subtitle }
    </small>
  )

  if (loading) {
    subtitleContent = (
      <span className={ styles.commonGalleryHeader__quantitySkeeleton }/>
    )
  }

  const galleryHeader = () => {
    const DynamicTag = tag

    let content: ReactElement | string = title

    if (term) {
      content = (
        <Trans
          i18nKey={ title }
          components={ [
            <small key={ title } className={ styles.commonGalleryHeader__titleTerm }/>,
          ] }
          values={ { [term.title]: term.value } }
        />
      )

      return (<DynamicTag className={ styles.commonGalleryHeader__title }>{ content }</DynamicTag>)
    }

    return (
      <DynamicTag className={ styles.commonGalleryHeader__title }>
        { content }
      </DynamicTag>
    )
  }

  return (
    <section className={ styles.commonGalleryHeader__container }>
      { galleryHeader() }

      { subtitleContent }

      {
        loading
          ? <div className={ styles.commonGalleryHeader__sortingElementSkeleton }/>
          : <div className={ styles.commonGalleryHeader__sortingElement }>
            { sortingMenu }
          </div>
      }
    </section>
  )
}

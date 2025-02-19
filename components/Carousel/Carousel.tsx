import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import styles from './Carousel.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti'

export interface KeyedComponent {
  key: string
  component: ReactNode
}

interface Props {
  children: KeyedComponent[]
  itemsAutoWidth: boolean
  onEndReached: (() => void) | undefined
  showButtons: boolean
}

export const Carousel: FC<Props> = ({ children, itemsAutoWidth, onEndReached, showButtons }) => {
  const [scrollX, setScrollX] = useState(0)
  const [scrollXBottom, setScrollXBottom] = useState(false)
  const scrollElement = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('carousel')

  const checkIfEndIsReached = () => {
    if (scrollElement.current) {
      const endReached = scrollElement.current.scrollLeft + scrollElement.current.offsetWidth + 1 >=
        scrollElement.current.scrollWidth

      setScrollXBottom(endReached)

      if (endReached && onEndReached) {
        onEndReached()
      }
    }
  }

  const handleResize = () => {
    if (scrollElement.current) {
      setScrollX(scrollElement.current?.scrollLeft)
      checkIfEndIsReached()
    }
  }

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize, true)

    return () => window.removeEventListener('resize', handleResize, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScrollXRightClick = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft += (scrollElement.current.offsetWidth - 170)
    }
  }

  const handleScrollXLeftClick = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft -= (scrollElement.current.offsetWidth - 170)
    }
  }

  return (
    <div className={ styles.carousel__container }>
      <div className={ `
        ${styles.carousel__gradientBorderLeft}
        ${scrollX === 0 ? styles.carousel__gradientBorderLeft_hidden : ''}
      ` }/>

      { showButtons &&
        <button
          className={ `
            ${styles.carousel__scrollButton}
            ${styles.carousel__leftButton}
            ${scrollX === 0 ? styles.carousel__gradientBorderLeft_hidden : ''}
          ` }
          onClick={ () => handleScrollXLeftClick() }
          title={ t('carousel_left_button_title') ?? '' }
        >
          <TiChevronLeft className={ styles.carousel__carouselIcon }/>
        </button>
      }

      { showButtons &&
        <button
          className={ `
            ${styles.carousel__scrollButton}
            ${styles.carousel__rightButton}
            ${scrollXBottom ? styles.carousel__rightButton_hidden : ''}
          ` }
          onClick={ () => handleScrollXRightClick() }
          title={ t('carousel_right_button_title') ?? '' }
        >
          <TiChevronRight className={ styles.carousel__carouselIcon }/>
        </button>
      }

      <div className={ `
        ${styles.carousel__gradientBorderRight}
        ${scrollXBottom ? styles.carousel__gradientBorderRight_hidden : ''}
      ` }/>

      <div
        className={ styles.carousel__slider }
        ref={ scrollElement }
        onScroll={ () => {
          if (scrollElement.current) {
            setScrollX(scrollElement.current?.scrollLeft)
            checkIfEndIsReached()
          }
        } }
      >
        { children.map((child) => {
          return (
            <div
              key={ child.key }
              className={ itemsAutoWidth ? `${styles.carousel__sliderItem_auto}` : `${styles.carousel__sliderItem}` }>
              { child.component }
            </div>
          )
        }) }
      </div>
    </div>
  )
}

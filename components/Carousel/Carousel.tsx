import { createRef, FC, ReactNode, useEffect, useState } from 'react'
import styles from './Carousel.module.scss'
import { BsCaretLeft, BsCaretRight } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'

export interface KeyedComponent {
  key: string
  component: ReactNode
}

interface Props {
  children: KeyedComponent[]
  itemsAutoWidth: boolean
  onEndReached: (() => void) | undefined
}

export const Carousel: FC<Props> = ({ children, itemsAutoWidth, onEndReached }) => {
  const [scrollX, setScrollX] = useState(0)
  const [scrollXBottom, setScrollXBottom] = useState(false)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const scrollElement = createRef<HTMLDivElement>()

  const { t } = useTranslation('carousel')

  useEffect(() => {
    checkIfEndIsReached()
  }, [])

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

  const handleScrollXRightClick = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft += scrollElement.current.offsetWidth
    }
  }

  const handleScrollXLeftClick = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollLeft -= scrollElement.current.offsetWidth
    }
  }

  return (
    <div
      className={ styles.carousel__container }
      onMouseOver={ () => setShowScrollButtons(true) }
      onMouseLeave={ () => setShowScrollButtons(false) }
    >
      <BsCaretLeft
        className={ `
          ${styles.carousel__leftScrollButton}
          ${scrollX === 0 ? styles.carousel__leftScrollButton__hidden : ''}        
          ${showScrollButtons && scrollX !== 0 ? styles.carousel__leftScrollButton__active : ''}
        ` }
        onClick={ () => handleScrollXLeftClick() }
        title={ t('carousel_left_button_title') ?? '' }
      />
      <BsCaretRight
        className={ `
          ${styles.carousel__rightScrollButton}
          ${scrollXBottom ? styles.carousel__rightScrollButton__hidden : ''}        
          ${showScrollButtons && !scrollXBottom ? styles.carousel__rightScrollButton__active : ''}
        ` }
        onClick={ () => handleScrollXRightClick() }
        title={ t('carousel_right_button_title') ?? '' }
      />
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
              className={ `
                ${itemsAutoWidth ? styles.carousel__sliderItemAuto : styles.carousel__sliderItem}` }>
              { child.component }
            </div>
          )
        }) }
      </div>
    </div>
  )
}

import { createRef, CSSProperties, Dispatch, FC, SetStateAction, useState } from 'react'
import styles from './ProducerList.module.scss'
import { BsCaretLeft, BsCaretRight } from 'react-icons/bs'
import { ProducerComponentDto } from '../Dtos/ProducerComponentDto'

interface Props {
  producers: ProducerComponentDto[]
  setActiveProducer: Dispatch<SetStateAction<ProducerComponentDto>>
  activeProducer: ProducerComponentDto
}

export const ProducerList: FC<Props> = ({ producers, activeProducer, setActiveProducer }) => {
  const [scrollX, setScrollX] = useState(0)
  const [scrollXBottom, setScrollXBottom] = useState(false)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const scrollElement = createRef<HTMLDivElement>()

  const checkIfEndIsReached = () => {
    if (scrollElement.current) {
      setScrollXBottom(scrollElement.current.scrollLeft + scrollElement.current.offsetWidth + 1 >= scrollElement.current.scrollWidth)
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
      className={ styles.categoryList__container }
      onMouseOver={ () => {
        setShowScrollButtons(true)
      }}
      onMouseLeave={ () => {
        setShowScrollButtons(false)
      }}
    >
      <BsCaretLeft
        className={ `
          ${styles.categoryList__leftScrollButton}
          ${scrollX === 0 ? styles.categoryList__leftScrollButton__hidden : ''}        
          ${showScrollButtons && scrollX !== 0 ? styles.categoryList__leftScrollButton__active : ''}
        ` }
        onClick={ () => {
          handleScrollXLeftClick()
        }}
      />
      <BsCaretRight
        className={`
          ${styles.categoryList__rightScrollButton}
          ${scrollXBottom ? styles.categoryList__rightScrollButton__hidden : ''}        
          ${showScrollButtons && !scrollXBottom ? styles.categoryList__rightScrollButton__active : ''}
        `}
        onClick={ () => {
          handleScrollXRightClick()
        }}
      />
      <div
        className={ styles.categoryList__slider }
        ref={ scrollElement }
        onScroll={() => {
          if (scrollElement.current) {
            setScrollX(scrollElement.current?.scrollLeft)
            checkIfEndIsReached()
          }
        }}
      >
          { producers.map((producer) => {
            return (
            <button
            className={ `
              ${styles.categoryList__category}
              ${activeProducer.id === producer.id ? styles.categoryList__categoryActive : ''}
            ` }
            key={ producer.id }
            onClick={ () => {
              setActiveProducer(producer)
            } }
            style={{
              '--category-color': producer.brandHexColor,
            } as CSSProperties}
          >
            { producer.name }
          </button>
        )
        })}
      </div>
    </div>
  )
}
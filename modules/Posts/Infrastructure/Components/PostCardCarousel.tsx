import { createRef, CSSProperties, FC, useState } from 'react'
import styles from './PostCardCarousel.module.scss'
import { PostCardComponentDto } from '../Dtos/PostCardComponentDto'
import { PostCard } from './PostCard'

interface Props {
  posts: PostCardComponentDto[]
}

export const PostCardCarousel: FC<Props> = ({ posts }) => {
  const [playerId, setPlayerId] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [postsNumber, setPostsNumber] = useState<number>(posts.length)
  const [scrollX, setScrollX] = useState(0)
  const scrollElement = createRef<HTMLDivElement>()

  const checkIfEndIsReached = () => {
    if (scrollElement.current) {
      if (scrollElement.current.scrollLeft + scrollElement.current.offsetWidth + 1 >= scrollElement.current.scrollWidth) {
      //fetch more
      }
    }
  }

  return (
    <div 
      className={styles.postCardCarousel__container}
      style={{
        '--related-number': postsNumber,
      } as CSSProperties}
      ref={scrollElement}
      onScroll={() => {
        if (scrollElement.current) {
          setScrollX(scrollElement.current?.scrollLeft)
          checkIfEndIsReached()
        }
      }}
    >
      { posts.map((post) => {
        return (
          <PostCard
            setPlayerId={ setPlayerId}
            playerId={ playerId }
            post={ post }
            key={ post.id }
          />
        )
      })}
    </div>
  )
}
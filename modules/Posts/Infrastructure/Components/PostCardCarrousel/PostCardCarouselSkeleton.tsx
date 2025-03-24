import { FC } from 'react'
import {
  PostCardSkeleton,
  PostCardSkeletonOptionalProps
} from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'
import styles from './PostCardCarouselSkeleton.module.scss'

interface Props {
  postCardsNumber: number
  loading: boolean
}

export const PostCardCarouselSkeleton:
  FC<Partial<Props> & Pick<Props, 'postCardsNumber'> & Partial<PostCardSkeletonOptionalProps>> = ({
    postCardsNumber,
    loading = false,
    showData = true,
    showExtraData = true,
  }) => {
    const carouselElements = () => {
      return Array.from(Array(postCardsNumber).keys())
        .map((index) => (
          <li
            className={ styles.postCardCarouselSkeleton__sliderItem }
            key={ index }
          >
            <PostCardSkeleton
              loading={ loading }
              showExtraData={ showExtraData }
              showData={ showData }
            />
          </li>
        ))
    }

    return (
      <ul className={ styles.postCardCarouselSkeleton__slider }>
        { carouselElements() }
      </ul>
    )
  }

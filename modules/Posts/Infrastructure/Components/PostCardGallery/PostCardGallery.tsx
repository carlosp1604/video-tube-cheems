import { FC, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardGallery.module.scss'
import { useTranslation } from 'next-i18next'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import {
  PostCardGalleryOptions
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryOptions'
import { PostCardOptionConfiguration, usePostCardOptions } from '~/hooks/PostCardOptions'
import {
  PostCardWithOptions
} from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardWithOptions/PostCardWithOptions'
import { defaultPerPage } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { PostCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCardSkeleton/PostCardSkeleton'

interface Props {
  posts: PostCardComponentDto[]
  postCardOptions: PostCardOptionConfiguration[]
  loading: boolean
  owner: string
}

export const PostCardGallery: FC<Partial<Props> & Pick<Props, 'posts' | 'postCardOptions'>> = ({
  posts,
  postCardOptions,
  loading = false,
  owner = undefined,
}) => {
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostCard, setSelectedPostCard] = useState<PostCardComponentDto | null>(null)
  const buildOptions = usePostCardOptions()

  const { t } = useTranslation('post_card_gallery')
  const { status } = useSession()

  const postCardGalleryOptions = buildOptions(
    postCardOptions,
    () => setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen),
    owner
  )

  let onClickOptions : ((post: PostCardComponentDto) => void) | undefined

  if (postCardGalleryOptions.length > 0) {
    onClickOptions = (post: PostCardComponentDto) => {
      if (status !== 'authenticated') {
        toast.error(t('user_must_be_authenticated_error_message'))

        return
      }

      setSelectedPostCard(post)
      setPostCardOptionsMenuOpen(true)
    }
  }

  const postsSkeletonNumber = defaultPerPage - posts.length
  const skeletonPosts = Array.from(Array(postsSkeletonNumber).keys())
    .map((index) => (
      <PostCardSkeleton
        key={ index }
        showProducerImage={ true }
        loading={ loading }
      />))

  return (
    <div className={ styles.postCardGallery__container }>
      <PostCardGalleryOptions
        options={ postCardGalleryOptions }
        isOpen={ postCardOptionsMenuOpen }
        onClose={ () => setPostCardOptionsMenuOpen(false) }
        selectedPostCard={ selectedPostCard as PostCardComponentDto }
      />

      { posts.map((post) => {
        return (
          <PostCardWithOptions
            post={ post }
            onClickOptions={ () => {
              if (onClickOptions) {
                onClickOptions(post)
              }
            } }
            showOptionsButton={ !!onClickOptions }
            key={ post.id }
            showProducerImage={ true }
          />
        )
      }) }
      { skeletonPosts }
    </div>
  )
}

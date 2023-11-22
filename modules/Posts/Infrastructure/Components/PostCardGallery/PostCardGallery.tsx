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

interface Props {
  posts: PostCardComponentDto[]
  postCardOptions: PostCardOptionConfiguration[]
}

export const PostCardGallery: FC<Props> = ({
  posts,
  postCardOptions,
}) => {
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostId, setSelectedPostId] = useState<string>('')
  const buildOptions = usePostCardOptions()

  const { t } = useTranslation('post_card_gallery')
  const { status } = useSession()

  const postCardGalleryOptions = buildOptions(
    postCardOptions,
    selectedPostId,
    () => setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
  )

  let onClickOptions : ((postId: string) => void) | undefined

  if (postCardGalleryOptions.length > 0) {
    onClickOptions = (postId: string) => {
      if (status !== 'authenticated') {
        toast.error(t('user_must_be_authenticated_error_message'))

        return
      }

      setSelectedPostId(postId)
      setPostCardOptionsMenuOpen(true)
    }
  }

  return (
    <div className={ styles.postCardGallery__container }>
      <PostCardGalleryOptions
        options={ postCardGalleryOptions }
        isOpen={ postCardOptionsMenuOpen }
        onClose={ () => setPostCardOptionsMenuOpen(false) }
      />

      { posts.map((post) => {
        return (
          <PostCardWithOptions
            post={ post }
            onClickOptions={ () => {
              if (onClickOptions) {
                onClickOptions(post.id)
              }
            } }
            showOptionsButton={ !!onClickOptions }
            key={ post.id }
          />
        )
      }) }
    </div>
  )
}

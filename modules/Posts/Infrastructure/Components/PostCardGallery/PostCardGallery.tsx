import { FC, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardGallery.module.scss'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'
import { Tooltip } from 'react-tooltip'
import * as uuid from 'uuid'
import { useTranslation } from 'next-i18next'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
// eslint-disable-next-line max-len
import {
  PostCardGalleryOption,
  PostCardGalleryOptions
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryOptions'

interface Props {
  posts: PostCardComponentDto[]
  postCardOptions: PostCardGalleryOption[]
}

export const PostCardGallery: FC<Props> = ({
  posts,
  postCardOptions,
}) => {
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostId, setSelectedPostId] = useState<string>('')

  const { t } = useTranslation('post_card_gallery')
  const { status } = useSession()

  const tooltipUuid = uuid.v4()

  let onClickOptions : ((postId: string) => void) | undefined

  if (postCardOptions.length > 0) {
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
        options={ postCardOptions.map((option) => {
          return {
            title: option.title,
            onClick: async (postId: string) => {
              try {
                await option.onClick(postId)
                setPostCardOptionsMenuOpen(!open)
              } catch (exception: unknown) {
                console.error(exception)
              }
            },
            icon: option.icon,
          }
        }) }
        isOpen={ postCardOptionsMenuOpen }
        onClose={ () => setPostCardOptionsMenuOpen(false) }
        selectedPostId={ selectedPostId }
      />

      { posts.map((post) => {
        return (
          <div
            className={ styles.postCardGallery__postCardContainer }
            key={ post.id }
          >
            <PostCard
              showProducerImage={ true }
              post={ post }
            />
            <button className={ `
              ${styles.postCardGallery__postOptions}
              ${onClickOptions ? styles.postCardGallery__postOptions_visible : ''}
            ` }
              onClick={ () => { if (onClickOptions) { onClickOptions(post.id) } } }
              data-tooltip-id={ tooltipUuid }
              data-tooltip-content={ t('post_card_gallery_post_card_options_title') }
            >
              <BsThreeDotsVertical/>
              <Tooltip id={ tooltipUuid }/>
            </button>
          </div>
        )
      }) }
    </div>
  )
}

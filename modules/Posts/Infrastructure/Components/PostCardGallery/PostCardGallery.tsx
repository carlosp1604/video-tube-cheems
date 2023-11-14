import { FC, ReactElement, useState } from 'react'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import styles from './PostCardGallery.module.scss'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { PostCard } from '~/modules/Posts/Infrastructure/Components/PostCard/PostCard'
import { Tooltip } from 'react-tooltip'
import * as uuid from 'uuid'
import { useTranslation } from 'next-i18next'
import toast from 'react-hot-toast'
// eslint-disable-next-line max-len
import { PaginatedPostCardGalleryOption, PaginatedPostCardGalleryOptions } from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PaginatedPostCardGalleryOptions'
import { useSession } from 'next-auth/react'

export enum PostCardGalleryAction {
  DELETE = 'delete',
  NO_MUTATE = 'no-mutate'
}

export interface PostCardGalleryOption {
  title: string
  icon: ReactElement
  action: PostCardGalleryAction
  onClick: (postId: string) => void
}

interface Props {
  posts: PostCardComponentDto[]
  postCardOptions: PostCardGalleryOption[]
  onClickDeleteOption: (postId: string) => void
}

export const PostCardGallery: FC<Props> = ({
  posts,
  postCardOptions,
  onClickDeleteOption,
}) => {
  const [postCardOptionsMenuOpen, setPostCardOptionsMenuOpen] = useState<boolean>(false)
  const [selectedPostId, setSelectedPostId] = useState<string>('')

  // TODO: Decide the file
  const { t } = useTranslation('paginated_post_card_gallery')
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

  const buildOption = (option: PostCardGalleryOption): PaginatedPostCardGalleryOption => {
    switch (option.action) {
      case PostCardGalleryAction.NO_MUTATE: {
        const action = async () => {
          try {
            await option.onClick(selectedPostId)
            setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
          } catch (exception: unknown) {
            // Action failed -> NO ACTION TAKEN
            console.error(exception)
          }
        }

        return {
          title: option.title,
          onClick: action,
          icon: option.icon,
        }
      }

      case PostCardGalleryAction.DELETE: {
        const action = async () => {
          try {
            await option.onClick(selectedPostId)
            setPostCardOptionsMenuOpen(!postCardOptionsMenuOpen)
            onClickDeleteOption(selectedPostId)
          } catch (exception: unknown) {
            // Action failed -> NO ACTION TAKEN
            console.error(exception)
          }
        }

        return {
          title: option.title,
          onClick: action,
          icon: option.icon,
        }
      }

      default:
        toast.error(t('action_does_not_exist_error_message'))

        throw Error(t('action_does_not_exist_error_message'))
    }
  }

  return (
    <div className={ styles.postCardGallery__container }>
      <PaginatedPostCardGalleryOptions
        options={ postCardOptions.map((action) => buildOption(action)) }
        isOpen={ postCardOptionsMenuOpen }
        onClose={ () => setPostCardOptionsMenuOpen(false) }
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
              data-tooltip-content={ t('post_card_options_button_title') }
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

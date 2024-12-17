import { BiLike } from 'react-icons/bi'
import { useCallback } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useSession } from 'next-auth/react'
import { BsBookmark, BsTrash } from 'react-icons/bs'
import {
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryOptions'
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'
import { useSavePost } from '~/hooks/SavePosts'
import { useReactPost } from '~/hooks/ReactPost'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import styles from './PostCardOptions.module.scss'

export type PostCardOptions = 'savePost' | 'react'

export type PostCardDeletableOptions = 'deleteSavedPost'

export interface PostCardOption {
  type: PostCardOptions
  onSuccess: (postCard: PostCardComponentDto) => void
}

export interface PostCardDeletableOption {
  type: PostCardDeletableOptions
  onDelete: (postId: string) => void
  ownerId: string
}

export type PostCardOptionConfiguration =
  Partial<PostCardOption> & Pick<PostCardOption, 'type'> |
  PostCardDeletableOption

export function usePostCardOptions () {
  const { t } = useTranslation('post_card_options')

  const { status, data } = useSession()
  const { savePost, removeSavedPost } = useSavePost('post_card_options')
  const { reactPost } = useReactPost('post_card_options')

  const savePostPostCardAction = async (
    postCard: PostCardComponentDto,
    optionOnSuccess: ((postCard: PostCardComponentDto) => void) | undefined,
    onSuccess:(() => void) | undefined
  ) => {
    const postIsSaved = await savePost(postCard.id, false)

    if (postIsSaved) {
      if (onSuccess) {
        onSuccess()
      }

      if (optionOnSuccess) {
        optionOnSuccess(postCard)
      }
    }
  }

  const likePostPostCardAction = async (
    postCard: PostCardComponentDto,
    optionOnSuccess: ((postCard: PostCardComponentDto) => void) | undefined,
    onSuccess: (() => void) | undefined
  ) => {
    const userReaction = await reactPost(postCard.id, ReactionType.LIKE)

    if (userReaction !== null) {
      if (onSuccess) {
        onSuccess()
      }

      if (optionOnSuccess) {
        optionOnSuccess(postCard)
      }
    }
  }

  const deleteSavedPostCardAction = async (
    postCard: PostCardComponentDto,
    onSuccess: (() => void) | undefined,
    onDelete: ((postCardId: string) => void) | undefined
  ) => {
    const removedPost = await removeSavedPost(postCard.id)

    if (removedPost) {
      if (onSuccess) {
        onSuccess()
      }

      if (onDelete) {
        onDelete(postCard.id)
      }
    }
  }

  return useCallback((
    optionsConfiguration: PostCardOptionConfiguration[],
    onSuccess: (() => void) | undefined
  ): PostCardGalleryOption[] => {
    const options: PostCardGalleryOption[] = []

    for (const optionConfiguration of optionsConfiguration) {
      switch (optionConfiguration.type) {
        case 'savePost': {
          if (status === 'authenticated' && data) {
            options.push({
              icon: <BsBookmark className={ styles.postCardOptions__iconOption }/>,
              title: t('save_post_post_card_gallery_action_title'),
              onClick: (postCard: PostCardComponentDto) =>
                savePostPostCardAction(postCard, optionConfiguration.onSuccess, onSuccess),
            })
          }

          break
        }

        case 'react': {
          if (status === 'authenticated' && data) {
            options.push({
              icon: <BiLike className={ styles.postCardOptions__iconOption } />,
              title: t('like_post_post_card_gallery_action_title'),
              onClick: async (postCard: PostCardComponentDto) => {
                await likePostPostCardAction(postCard, optionConfiguration.onSuccess, onSuccess)
              },
            })
          }

          break
        }

        case 'deleteSavedPost': {
          if (status === 'authenticated' && data && optionConfiguration.ownerId === data.user.id) {
            options.push({
              icon: <BsTrash className={ styles.postCardOptions__iconOption }/>,
              title: t('delete_saved_post_option_title'),
              onClick: async (postCard: PostCardComponentDto) => {
                await deleteSavedPostCardAction(postCard, onSuccess, optionConfiguration.onDelete)
              },
            })
          }

          break
        }

        default:
          throw Error('Post card option is not implemented')
      }
    }

    return options
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])
}

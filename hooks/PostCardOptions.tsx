
import toast from 'react-hot-toast'
import { BiLike } from 'react-icons/bi'
import { useCallback } from 'react'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { useTranslation } from 'next-i18next'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { USER_USER_NOT_FOUND } from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { signOut, useSession } from 'next-auth/react'
import { BsBookmark, BsTrash } from 'react-icons/bs'
import {
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PaginatedPostCardGallery/PostCardGalleryHeader/PostCardGalleryOptions'

export type PostCardOptions = 'savePost' | 'react'

export type PostCardDeletableOptions = 'deleteSavedPost'

export interface PostCardOption {
  type: PostCardOptions
}

export interface PostCardDeletableOption {
  type: PostCardDeletableOptions
  onDelete: (postId: string) => void
}

export type PostCardOptionConfiguration = PostCardOption | PostCardDeletableOption

export function usePostCardOptions () {
  const { t } = useTranslation(['post_card_options', 'api_exceptions'])

  const { status, data } = useSession()

  const savePostPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'post_card_options' }))

      return
    }

    try {
      await new PostsApiService().savePost(data.user.id, postId)

      toast.success(t('post_save_post_successfully_saved', { ns: 'post_card_options' }))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === USER_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }
  }

  const likePostPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'post_card_options' }))

      return
    }

    try {
      await new PostsApiService().createPostReaction(postId, ReactionType.LIKE)

      toast.success(t('post_reaction_added_correctly_message', { ns: 'post_card_options' }))
    } catch (exception) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === USER_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }
  }

  const deleteSavedPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'post_card_options' }))

      return
    }

    try {
      await new PostsApiService().removeFromSavedPosts(data.user.id, postId)

      toast.success(t('post_save_post_successfully_removed_from_saved_post', { ns: 'post_card_options' }))
    } catch (exception) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === USER_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }
  }

  const buildPostCardOptions = useCallback(
    (optionsConfiguration: PostCardOptionConfiguration[], ownerId?: string): PostCardGalleryOption[] => {
      const options: PostCardGalleryOption[] = []

      for (const optionConfiguration of optionsConfiguration) {
        switch (optionConfiguration.type) {
          case 'savePost': {
            if (status === 'authenticated' && data) {
              options.push({
                icon: <BsBookmark />,
                title: t('save_post_post_card_gallery_action_title', { ns: 'post_card_options' }),
                onClick: (postId: string) => savePostPostCardAction(postId),
              })
            }

            break
          }

          case 'react': {
            if (status === 'authenticated' && data) {
              options.push({
                icon: <BiLike />,
                title: t('like_post_post_card_gallery_action_title', { ns: 'post_card_options' }),
                onClick: async (postId: string) => {
                  await likePostPostCardAction(postId)
                },
              })
            }

            break
          }

          case 'deleteSavedPost': {
            if (status === 'authenticated' && data && ownerId === data.user.id) {
              options.push({
                icon: <BsTrash />,
                title: t('delete_saved_post_option_title', { ns: 'user_profile' }),
                onClick: async (postId: string) => {
                  await deleteSavedPostCardAction(postId)
                  optionConfiguration.onDelete(postId)
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
    }, [status])

  return buildPostCardOptions
}

import {
  PostCardGalleryAction,
  PostCardGalleryOption
} from '~/modules/Posts/Infrastructure/Components/PostCardGallery/PostCardGallery'
import toast from 'react-hot-toast'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { USER_USER_NOT_FOUND } from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { signOut, useSession } from 'next-auth/react'
import { BsBookmark, BsTrash } from 'react-icons/bs'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { BiLike } from 'react-icons/bi'

export enum GalleryActionType {
  SAVED_POSTS = 'saved-posts',
  HOME_PAGE = 'home-page'
}

export function useGalleryAction () {
  // TODO: Fix translation files or get translation keys by parameter
  const { t } = useTranslation(['user_profile', 'api_exceptions'])

  const { status, data } = useSession()

  const savePostPostCardAction = async (postId: string) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'home_page' }))

      return
    }

    try {
      await new PostsApiService().savePost(data.user.id, postId)

      toast.success(t('post_save_post_successfully_saved', { ns: 'home_page' }))
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
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'home_page' }))

      return
    }

    try {
      await new PostsApiService().createPostReaction(postId, ReactionType.LIKE)

      toast.success(t('post_reaction_added_correctly_message', { ns: 'home_page' }))
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
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'user_profile' }))

      return
    }

    try {
      await new PostsApiService().removeFromSavedPosts(data.user.id, postId)

      toast.success(t('post_save_post_successfully_removed_from_saved_post', { ns: 'user_profile' }))
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

  const getPostCardGalleryOptions = useCallback(
    (type: GalleryActionType, ownerId?: string): PostCardGalleryOption[] => {
      const options: PostCardGalleryOption[] = []

      switch (type) {
        case GalleryActionType.HOME_PAGE: {
          if (status === 'authenticated' && data) {
            options.push({
              action: PostCardGalleryAction.NO_MUTATE,
              icon: <BiLike />,
              title: t('like_post_post_card_gallery_action_title', { ns: 'home_page' }),
              onClick: (postId: string) => likePostPostCardAction(postId),
            })

            options.push({
              action: PostCardGalleryAction.NO_MUTATE,
              icon: <BsBookmark />,
              title: t('save_post_post_card_gallery_action_title', { ns: 'home_page' }),
              onClick: (postId: string) => savePostPostCardAction(postId),
            })
          }

          break
        }

        case GalleryActionType.SAVED_POSTS: {
          if (status === 'authenticated' && data && ownerId === data.user.id) {
            options.push({
              action: PostCardGalleryAction.DELETE,
              icon: <BsTrash />,
              title: t('delete_saved_post_option_title', { ns: 'user_profile' }),
              onClick: (postId: string) => deleteSavedPostCardAction(postId),
            })
          }

          break
        }

        default:
          throw Error('Post card gallery option not implemented ')
      }

      return options
    }, []
  )

  return getPostCardGalleryOptions
}

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
import { PostCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCardComponentDto'

export type PostCardOptions = 'savePost' | 'react'

export type PostCardDeletableOptions = 'deleteSavedPost'

export interface PostCardOption {
  type: PostCardOptions
  onSuccess: (postCard: PostCardComponentDto) => void
}

export interface PostCardDeletableOption {
  type: PostCardDeletableOptions
  onDelete: (postId: string) => void
}

export type PostCardOptionConfiguration =
  Partial<PostCardOption> & Pick<PostCardOption, 'type'> |
  PostCardDeletableOption

export function usePostCardOptions () {
  const { t } = useTranslation(['post_card_options', 'api_exceptions'])

  const { status, data } = useSession()

  const savePostPostCardAction = async (
    postCard: PostCardComponentDto,
    optionOnSuccess: ((postCard: PostCardComponentDto) => void) | undefined,
    onSuccess:(() => void) | undefined) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'post_card_options' }))

      return
    }

    try {
      await new PostsApiService().savePost(data.user.id, postCard.id)

      if (onSuccess) {
        onSuccess()
      }

      if (optionOnSuccess) {
        optionOnSuccess(postCard)
      }

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

  const likePostPostCardAction = async (
    postCard: PostCardComponentDto,
    optionOnSuccess: ((postCard: PostCardComponentDto) => void) | undefined,
    onSuccess: (() => void) | undefined
  ) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'post_card_options' }))

      return
    }

    try {
      await new PostsApiService().createPostReaction(postCard.id, ReactionType.LIKE)

      if (onSuccess) {
        onSuccess()
      }

      if (optionOnSuccess) {
        optionOnSuccess(postCard)
      }

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

  const deleteSavedPostCardAction = async (
    postCard: PostCardComponentDto,
    onSuccess: (() => void) | undefined
  ) => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message', { ns: 'post_card_options' }))

      return
    }

    try {
      await new PostsApiService().removeFromSavedPosts(data.user.id, postCard.id)

      if (onSuccess) {
        onSuccess()
      }

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

  return useCallback((
    optionsConfiguration: PostCardOptionConfiguration[],
    onSuccess: (() => void) | undefined,
    ownerId?: string
  ): PostCardGalleryOption[] => {
    const options: PostCardGalleryOption[] = []

    for (const optionConfiguration of optionsConfiguration) {
      switch (optionConfiguration.type) {
        case 'savePost': {
          if (status === 'authenticated' && data) {
            options.push({
              icon: <BsBookmark />,
              title: t('save_post_post_card_gallery_action_title', { ns: 'post_card_options' }),
              onClick: (postCard: PostCardComponentDto) =>
                savePostPostCardAction(postCard, optionConfiguration.onSuccess, onSuccess),
            })
          }

          break
        }

        case 'react': {
          if (status === 'authenticated' && data) {
            options.push({
              icon: <BiLike />,
              title: t('like_post_post_card_gallery_action_title', { ns: 'post_card_options' }),
              onClick: async (postCard: PostCardComponentDto) => {
                await likePostPostCardAction(postCard, optionConfiguration.onSuccess, onSuccess)
              },
            })
          }

          break
        }

        case 'deleteSavedPost': {
          if (status === 'authenticated' && data && ownerId === data.user.id) {
            options.push({
              icon: <BsTrash />,
              title: t('delete_saved_post_option_title', { ns: 'post_card_options' }),
              onClick: async (postCard: PostCardComponentDto) => {
                await deleteSavedPostCardAction(postCard, onSuccess)
                optionConfiguration.onDelete(postCard.id)
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
}

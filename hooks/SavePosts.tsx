import { useCallback } from 'react'
import useTranslation from 'next-translate/useTranslation'
import toast from 'react-hot-toast'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import {
  USER_SAVED_POSTS_POST_ALREADY_ADDED,
  USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS,
  USER_USER_NOT_FOUND
} from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'
import { signOut, useSession } from 'next-auth/react'
import { useLoginContext } from '~/hooks/LoginContext'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'

export interface SavePostInterface {
  savePost: (postId: string, returnStatus?: boolean) => Promise<boolean>
  removeSavedPost: (postId: string) => Promise<boolean>
}

export function useSavePost (namespace: string): SavePostInterface {
  const { t } = useTranslation(namespace)
  const { status, data } = useSession()
  const { setLoginModalOpen } = useLoginContext()

  const savePost = useCallback(async (postId: string, returnStatus = true): Promise<boolean> => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message'))
      setLoginModalOpen(true)

      return false
    }

    try {
      await new PostsApiService().savePost(data.user.id, postId)
      toast.success(t('post_save_post_successfully_saved'))

      return true
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        toast.error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return false
      }

      let savedPost = false

      if (exception.code === USER_SAVED_POSTS_POST_ALREADY_ADDED) {
        savedPost = true && returnStatus
      }

      if (exception.code === USER_USER_NOT_FOUND) {
        await signOut({ redirect: false })

        savedPost = false
      }

      if (exception.apiCode === 401) {
        setLoginModalOpen(true)

        savedPost = false
      }

      toast.error(t(`api_exceptions:${exception.translationKey}`))

      return savedPost
    }
  }, [status])

  const removeSavedPost = useCallback(async (postId: string): Promise<boolean> => {
    if (status !== 'authenticated' || !data) {
      toast.error(t('user_must_be_authenticated_error_message'))
      setLoginModalOpen(true)

      return false
    }

    try {
      await new PostsApiService().removeFromSavedPosts(data.user.id, postId)
      toast.success(t('post_save_post_successfully_removed_from_saved_post'))

      return true
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        toast.error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return false
      }

      let deleteSavedPost = false

      if (exception.code === USER_USER_NOT_FOUND) {
        toast.error(t('user_not_found_error_message'))

        await signOut({ redirect: false })

        deleteSavedPost = true
      }

      if (exception.code === USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS) {
        deleteSavedPost = true
      }

      if (exception.apiCode === 401) {
        setLoginModalOpen(true)

        deleteSavedPost = true
      }

      toast.error(t(`api_exceptions:${exception.translationKey}`))

      return deleteSavedPost
    }
  }, [status])

  return { savePost, removeSavedPost }
}

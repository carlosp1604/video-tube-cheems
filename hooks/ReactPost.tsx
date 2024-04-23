import { useCallback } from 'react'
import useTranslation from 'next-translate/useTranslation'
import toast from 'react-hot-toast'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { signOut, useSession } from 'next-auth/react'
import { useLoginContext } from '~/hooks/LoginContext'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { POST_REACTION_USER_NOT_FOUND } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'

export interface ReactPostInterface {
  reactPost: (postId: string, type: ReactionType) => Promise<ReactionComponentDto | null>
  removeReaction: (postId: string) => Promise<boolean>
}

export function useReactPost (namespace: string): ReactPostInterface {
  const { t } = useTranslation(namespace)
  const { status } = useSession()
  const { setLoginModalOpen } = useLoginContext()

  const reactPost = useCallback(async (postId: string, type: ReactionType): Promise<ReactionComponentDto | null> => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))
      setLoginModalOpen(true)

      return null
    }

    try {
      const reaction = await new PostsApiService().createPostReaction(postId, type)
      const reactionComponentDto = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      toast.success(t('post_reaction_added_correctly_message'))

      return reactionComponentDto
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        toast.error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return null
      }

      if (exception.code === POST_REACTION_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      if (exception.apiCode === 401) {
        setLoginModalOpen(true)
      }

      toast.error(t(`api_exceptions:${exception.translationKey}`))

      return null
    }
  }, [status])

  const removeReaction = useCallback(async (postId: string): Promise<boolean> => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))
      setLoginModalOpen(true)

      return false
    }

    try {
      await new PostsApiService().deletePostReaction(postId)

      toast.success(t('post_reaction_deleted_correctly_message'))

      return true
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        toast.error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return false
      }

      if (exception.code === POST_REACTION_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      if (exception.apiCode === 401) {
        setLoginModalOpen(true)
      }

      toast.error(t(`api_exceptions:${exception.translationKey}`))

      return false
    }
  }, [status])

  return { reactPost, removeReaction }
}

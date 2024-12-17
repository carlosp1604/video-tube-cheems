import { useCallback } from 'react'
import useTranslation from 'next-translate/useTranslation'
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
import { useRouter } from 'next/router'
import { useToast } from '~/components/AppToast/ToastContext'

export interface ReactPostInterface {
  reactPost: (postId: string, type: ReactionType) => Promise<ReactionComponentDto | null>
  removeReaction: (postId: string) => Promise<boolean>
}

export function useReactPost (namespace: string): ReactPostInterface {
  const { t } = useTranslation(namespace)
  const locale = useRouter().locale ?? 'en'
  const { status } = useSession()
  const { setLoginModalOpen } = useLoginContext()
  const { error, success } = useToast()

  const reactPost = useCallback(async (postId: string, type: ReactionType): Promise<ReactionComponentDto | null> => {
    if (status !== 'authenticated') {
      error(t('user_must_be_authenticated_error_message'))
      setLoginModalOpen(true)

      return null
    }

    try {
      const reaction = await new PostsApiService().createPostReaction(postId, type)
      const reactionComponentDto = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      success(t('post_reaction_added_correctly_message'))

      return reactionComponentDto
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return null
      }

      if (exception.code === POST_REACTION_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      if (exception.apiCode === 401) {
        setLoginModalOpen(true)
      }

      error(t(`api_exceptions:${exception.translationKey}`))

      return null
    }
  }, [status, locale])

  const removeReaction = useCallback(async (postId: string): Promise<boolean> => {
    if (status !== 'authenticated') {
      error(t('user_must_be_authenticated_error_message'))
      setLoginModalOpen(true)

      return false
    }

    try {
      await new PostsApiService().deletePostReaction(postId)

      success(t('post_reaction_deleted_correctly_message'))

      return true
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        error(t('api_exceptions:something_went_wrong_error_message'))

        console.error(exception)

        return false
      }

      if (exception.code === POST_REACTION_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      if (exception.apiCode === 401) {
        setLoginModalOpen(true)
      }

      error(t(`api_exceptions:${exception.translationKey}`))

      return false
    }
  }, [status, locale])

  return { reactPost, removeReaction }
}

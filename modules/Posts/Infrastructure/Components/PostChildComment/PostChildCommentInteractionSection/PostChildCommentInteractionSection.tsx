import { FC, useState } from 'react'
import styles from './PostChildCommentInteractionSection.module.scss'
import { useTranslation } from 'next-i18next'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import toast from 'react-hot-toast'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { signOut, useSession } from 'next-auth/react'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { USER_USER_NOT_FOUND } from '~/modules/Auth/Infrastructure/Api/AuthApiExceptionCodes'

interface Props {
  postChildComment: PostChildCommentComponentDto
}

export const PostChildCommentInteractionSection: FC<Props> = ({ postChildComment }) => {
  const { t } = useTranslation(['post_comments', 'api_exceptions'])
  const [userReaction, setUserReaction] = useState<ReactionComponentDto | null>(postChildComment.userReaction)
  const [commentReactions, setCommentReactions] = useState<number>(postChildComment.reactionsNumber)

  const apiService = new CommentsApiService()
  const { status } = useSession()

  const onReact = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (userReaction !== null) {
      toast.error(t('post_comment_reaction_user_already_reacted'))

      return
    }

    try {
      const reaction = await apiService.createPostChildCommentReaction(
        postChildComment.id, postChildComment.parentCommentId
      )
      const reactionComponent = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      const newCommentReactionsNumber = commentReactions + 1

      setCommentReactions(newCommentReactionsNumber)
      setUserReaction(reactionComponent)

      toast.success(t('post_comment_reaction_reaction_added_successfully'))
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

  const onDeleteReaction = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (userReaction === null) {
      toast.error(t('post_comment_reaction_user_has_not_reacted'))

      return
    }

    try {
      await apiService.deletePostChildCommentReaction(
        postChildComment.id, postChildComment.parentCommentId
      )

      setUserReaction(null)
      const newCommentReactionsNumber = commentReactions - 1

      setCommentReactions(newCommentReactionsNumber)

      toast.success(t('post_comment_reaction_reaction_removed_successfully'))
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

  return (
    <div className={ styles.postCommentInteractionSection__container }>
      <LikeButton
        liked={ userReaction !== null }
        onLike={ onReact }
        onDeleteLike={ onDeleteReaction }
        reactionsNumber={ commentReactions }
      />
    </div>
  )
}

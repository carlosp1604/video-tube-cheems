import { Dispatch, FC, SetStateAction } from 'react'
import styles from './PostCommentInteractionSection.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { useTranslation } from 'next-i18next'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import toast from 'react-hot-toast'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NumberFormatter } from '~/modules/Posts/Infrastructure/Frontend/NumberFormatter'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { POST_COMMENT_REACTION_USER_NOT_FOUND } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'

interface Props {
  postComment: PostCommentComponentDto
  onClickReply: ((postComment: PostCommentComponentDto) => void) | undefined
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const PostCommentInteractionSection: FC<Props> = ({
  postComment,
  onClickReply,
  onClickLikeComment,
  loading,
  setLoading,
}) => {
  const { t } = useTranslation(['post_comments', 'api_exceptions'])

  const apiService = new CommentsApiService()
  const { status } = useSession()
  let { locale } = useRouter()

  locale = locale || 'en'

  const onReact = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (postComment.userReaction !== null) {
      toast.error(t('post_comment_reaction_user_already_reacted'))

      return
    }

    try {
      const reaction = await apiService.createPostCommentReaction(postComment.id)

      const reactionComponent = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      const newCommentReactionsNumber = postComment.reactionsNumber + 1

      onClickLikeComment(
        postComment.id,
        reactionComponent,
        newCommentReactionsNumber
      )

      toast.success(t('post_comment_reaction_reaction_added_successfully'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === POST_COMMENT_REACTION_USER_NOT_FOUND) {
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

    if (postComment.userReaction === null) {
      toast.error(t('post_comment_reaction_user_has_not_reacted'))

      return
    }

    try {
      await apiService.deletePostCommentReaction(postComment.id)

      const newCommentReactionsNumber = postComment.reactionsNumber - 1

      onClickLikeComment(postComment.id, null, newCommentReactionsNumber)

      toast.success(t('post_comment_reaction_reaction_removed_successfully'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === POST_COMMENT_REACTION_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }
  }

  return (
    <div className={ styles.postCommentInteractionSection__container }>
      <button className={
        onClickReply
          ? styles.postCommentInteractionSection__repliesButton
          : styles.postCommentInteractionSection__repliesButton_noActionable
        }
        onClick={ () => { if (onClickReply) { onClickReply(postComment) } } }
      >
        { postComment.repliesNumber > 0
          ? t('comment_replies_button', { replies: NumberFormatter.compatFormat(postComment.repliesNumber, locale) })
          : t('comment_reply_button')
        }
      </button>
      <LikeButton
        liked={ postComment.userReaction !== null }
        onLike={ onReact }
        onDeleteLike={ onDeleteReaction }
        reactionsNumber={ postComment.reactionsNumber }
      />
    </div>
  )
}

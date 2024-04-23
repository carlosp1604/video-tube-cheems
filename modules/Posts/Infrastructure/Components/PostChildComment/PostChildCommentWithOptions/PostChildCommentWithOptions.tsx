import { FC, ReactNode, useState } from 'react'
import styles from './PostChildCommentWithOptions.module.scss'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import toast from 'react-hot-toast'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import {
  POST_COMMENT_REACTION_USER_NOT_FOUND,
  POST_COMMENT_USER_NOT_FOUND
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { signOut, useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MenuDropdown } from '~/components/MenuDropdown/MenuDropdown'
import { FiTrash } from 'react-icons/fi'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { LikeButton } from '~/components/ReactionButton/LikeButton'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import {
  PostChildCommentCard
} from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentCard/PostChildCommentCard'

interface Props {
  postId: string
  postChildComment: PostChildCommentComponentDto
  onDeletePostComment: (postCommentId: string) => void
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  optionsDisabled: boolean
}

export const PostChildCommentWithOptions: FC<Props> = ({
  postId,
  postChildComment,
  onDeletePostComment,
  onClickLikeComment,
  optionsDisabled,
}) => {
  const [optionsMenuOpen, setOptionsMenuOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation('post_comments')
  const { status, data } = useSession()

  const onClickDelete = async () => {
    if (optionsDisabled || loading) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      await new CommentsApiService().delete(postId, postChildComment.id, postChildComment.parentCommentId)
      onDeletePostComment(postChildComment.id)

      toast.success(t('post_comment_deleted_success_message'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === POST_COMMENT_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(`api_exceptions:${exception.translationKey}`))
    } finally {
      setLoading(false)
    }
  }

  const onReact = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (postChildComment.userReaction !== null) {
      toast.error(t('post_comment_reaction_user_already_reacted'))

      return
    }

    if (optionsDisabled || loading) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      const reaction = await new CommentsApiService()
        .createPostChildCommentReaction(postChildComment.id, postChildComment.parentCommentId)

      const reactionComponent = ReactionComponentDtoTranslator.fromApplicationDto(reaction)

      const newCommentReactionsNumber = postChildComment.reactionsNumber + 1

      onClickLikeComment(
        postChildComment.id,
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

      toast.error(t(`api_exceptions:${exception.translationKey}`))
    } finally {
      setLoading(false)
    }
  }

  const onDeleteReaction = async () => {
    if (status !== 'authenticated') {
      toast.error(t('user_must_be_authenticated_error_message'))

      return
    }

    if (postChildComment.userReaction === null) {
      toast.error(t('post_comment_reaction_user_has_not_reacted'))

      return
    }

    if (optionsDisabled || loading) {
      toast.error(t('action_cannot_be_performed_error_message'))

      return
    }

    setLoading(true)

    try {
      await new CommentsApiService()
        .deletePostChildCommentReaction(postChildComment.id, postChildComment.parentCommentId)

      const newCommentReactionsNumber = postChildComment.reactionsNumber - 1

      onClickLikeComment(postChildComment.id, null, newCommentReactionsNumber)

      toast.success(t('post_comment_reaction_reaction_removed_successfully'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === POST_COMMENT_REACTION_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(`api_exceptions:${exception.translationKey}`))
    } finally {
      setLoading(false)
    }
  }

  let postCommentOptionsElement: ReactNode | null = null

  if (status === 'authenticated' && data && postChildComment.user.id === data.user.id) {
    postCommentOptionsElement = (
      <MenuDropdown
        buttonIcon={
          <button className={ `
            ${styles.postChildCommentWithOptions__optionsButton}
            ${optionsMenuOpen ? styles.postChildCommentWithOptions__optionsButton_open : ''}
          ` }
            disabled={ optionsDisabled || loading }
            onClick={ () => setOptionsMenuOpen(!optionsMenuOpen) }
          >
            <BsThreeDotsVertical className={ styles.postChildCommentWithOptions__optionsIcon }/>
          </button>
        }
        isOpen={ optionsMenuOpen }
        setIsOpen={ setOptionsMenuOpen }
        options={ [{
          title: t('delete_comment_option_title'),
          icon: <FiTrash/>,
          onClick: async () => { await onClickDelete() },
        }] }
        title={ t('post_comment_menu_options_title') }
      />
    )
  }

  return (
    <>
      <div className={ `
        ${styles.postChildCommentWithOptions__commentWithOptionsContainer}
        ${loading ? styles.postChildCommentWithOptions__commentWithOptionsContainer_loading : ''}
      ` }>
        <PostChildCommentCard postChildComment={ postChildComment } />
        { postCommentOptionsElement }
      </div>
      <div className={ styles.postChildCommentWithOptions__interactionSection }>
        <LikeButton
          liked={ postChildComment.userReaction !== null }
          onLike={ async () => { if (!optionsDisabled && !loading) { await onReact() } } }
          onDeleteLike={ async () => { if (!optionsDisabled && !loading) { await onDeleteReaction() } } }
          reactionsNumber={ postChildComment.reactionsNumber }
          disabled={ optionsDisabled || loading }
        />
      </div>
    </>
  )
}

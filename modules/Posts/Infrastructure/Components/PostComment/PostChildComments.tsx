import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { BsArrowLeftShort, BsX } from 'react-icons/bs'
import styles from './PostComments.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import {
  PostChildCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostChildCommentComponentTranslator'
import {
  GetPostPostChildCommentsResponseDto
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsResponseDto'
import useTranslation from 'next-translate/useTranslation'
import { AddCommentInput } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/AddCommentInput'
import {
  PostChildCommentList
} from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentList/PostChildCommentList'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { POST_COMMENT_USER_NOT_FOUND } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { signOut } from 'next-auth/react'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { useToast } from '~/components/AppToast/ToastContext'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { IconButton } from '~/components/IconButton/IconButton'

interface Props {
  commentToReply: PostCommentComponentDto
  onClickClose: () => void
  onClickRetry: () => void
  onAddReply: (repliesNumber: number | null) => void
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  onDeleteReply: () => void
}

export const PostChildComments: FC<Props> = ({
  commentToReply,
  onClickClose,
  onClickRetry,
  onAddReply,
  onDeleteReply,
  onClickLikeComment,
}) => {
  const [replies, setReplies] = useState<PostChildCommentComponentDto[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [creatingChildComment, setCreatingChildComment] = useState<boolean>(false)

  const repliesAreaRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('post_comments')
  const { error, success } = useToast()

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const createReply = async (comment: string) => {
    if (comment === '') {
      error(t('empty_comment_is_not_allowed_error_message'))

      return
    }

    repliesAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    try {
      const postChildComment =
        await new CommentsApiService().createReply(commentToReply.postId, comment, commentToReply.id)

      const componentResponse = PostChildCommentComponentDtoTranslator
        .fromApplication(postChildComment, 0, null, locale)

      setReplies([componentResponse, ...replies])
      onAddReply(null)

      success(t('post_child_comment_added_success_message'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === POST_COMMENT_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      error(t(`api_exceptions:${exception.translationKey}`))
    }
  }

  const fetchReplies = async (): Promise<GetPostPostChildCommentsResponseDto | null> => {
    try {
      const response = await new CommentsApiService()
        .getChildComments(commentToReply.postId, commentToReply.id, pageNumber, defaultPerPage)

      onAddReply(response.childCommentsCount)

      return response
    } catch (exception: unknown) {
      console.error(exception)
      error(t('server_error_error_message'))

      return null
    }
  }

  const updateReplies = async () => {
    setLoading(true)
    const newReplies = await fetchReplies()

    if (newReplies === null) {
      return
    }

    const childComments = newReplies.childCommentsWithReactions.map((applicationDto) => {
      return PostChildCommentComponentDtoTranslator.fromApplication(
        applicationDto.postChildComment, applicationDto.reactionsNumber, applicationDto.userReaction, locale
      )
    })

    setReplies([...replies, ...childComments])

    const pagesNumber = PaginationHelper.calculatePagesNumber(newReplies.childCommentsCount, defaultPerPage)

    setCanLoadMore(pageNumber < pagesNumber)
    setPageNumber(pageNumber + 1)
    setLoading(false)
  }

  useEffect(() => {
    updateReplies()
  }, [])

  const onClickLikeChildComment = (
    childCommentId: string,
    userReaction: ReactionComponentDto | null,
    reactionsNumber: number
  ) => {
    const commentIndex = replies.findIndex((currentReply) => currentReply.id === childCommentId)

    if (commentIndex !== -1) {
      const reply = replies[commentIndex]

      reply.reactionsNumber = reactionsNumber
      reply.userReaction = userReaction

      replies[commentIndex] = reply
      setReplies([...replies])
    }
  }

  const onDeletePostChildComment = (postCommentId: string) => {
    setReplies(replies.filter((childComment) => childComment.id !== postCommentId))
    onDeleteReply()
  }

  const onAddComment = async (comment: string) => {
    setLoading(true)
    setCreatingChildComment(true)
    await createReply(comment)
    setCreatingChildComment(false)
    setLoading(false)
  }

  const onLoadMore = async () => {
    setLoading(true)
    await updateReplies()
    setLoading(false)
  }

  return (
    <div
      className={ styles.postComments__container }
      onClick={ (event) => event.stopPropagation() }
    >
      <div className={ styles.postComments__commentsTitleBar }>
        <div className={ styles.postComments__commentsTitle }>
          <IconButton
            onClick={ onClickRetry }
            icon={ <BsArrowLeftShort /> }
            title={ t('back_to_comments_section_button_title') }
          />
          { t('replies_section_title') }
          <span className={ styles.postComments__commentsQuantity }>
            { commentToReply.repliesNumber }
          </span>
        </div>
        <IconButton
          onClick={ onClickClose }
          icon={ <BsX /> }
          title={ t('close_comment_section_button_title') }
        />
      </div>
      <div
        className={ styles.postComments__comments }
        ref={ repliesAreaRef }
      >
        <PostChildCommentList
          postComment={ commentToReply }
          postChildComments={ replies }
          onDeletePostChildComment={ onDeletePostChildComment }
          onClickLikeComment={ onClickLikeComment }
          onClickLikeChildComment={ onClickLikeChildComment }
          loading={ loading }
          creatingChildComment={ creatingChildComment }
        />

        { canLoadMore &&
          <CommonButton
            title={ t('replies_section_load_more') }
            disabled={ false }
            onClick={ onLoadMore }
          />
        }
      </div>

      <div className={ styles.postComments__addComment }>
        <AddCommentInput
          disabled={ loading }
          onAddComment={ onAddComment }
        />
      </div>
    </div>
  )
}

import { Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './PostComments.module.scss'
import { BsX } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import {
  PostCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCommentComponentDtoTranslator'
import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import useTranslation from 'next-translate/useTranslation'
import { AddCommentInput } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/AddCommentInput'
import { PostCommentList } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentList/PostCommentList'
import { PostChildComments } from '~/modules/Posts/Infrastructure/Components/PostComment/PostChildComments'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { signOut } from 'next-auth/react'
import { POST_COMMENT_USER_NOT_FOUND } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'
import { useToast } from '~/components/AppToast/ToastContext'
import { IconButton } from '~/components/IconButton/IconButton'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'

interface Props {
  postId: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const PostComments: FC<Props> = ({ postId, setIsOpen }) => {
  const [repliesOpen, setRepliesOpen] = useState<boolean>(false)
  const [commentToReply, setCommentToReply] = useState<PostCommentComponentDto | null>(null)
  const [comments, setComments] = useState<PostCommentComponentDto[]>([])
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [commentsNumber, setCommentsNumber] = useState<number>(0)
  const [creatingComment, setCreatingComment] = useState<boolean>(false)

  const commentsAreaRef = useRef<HTMLDivElement>(null)
  const commentApiService = new CommentsApiService()

  const { t } = useTranslation('post_comments')
  const { error, success } = useToast()

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const createComment = async (comment: string) => {
    if (comment === '') {
      error(t('empty_comment_is_not_allowed_error_message'))

      return
    }

    commentsAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    try {
      const postComment = await commentApiService.create(postId, comment, null)

      // When a comment is created it does not have replies or reactions
      const componentResponse = PostCommentComponentDtoTranslator
        .fromApplication(postComment, 0, 0, null, locale)

      setComments([componentResponse, ...comments])
      setCommentsNumber(commentsNumber + 1)

      success(t('post_comment_added_success_message'))
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

  async function fetchPostComments (): Promise<GetPostPostCommentsResponseDto | null> {
    try {
      return commentApiService.getComments(postId, pageNumber, defaultPerPage)
    } catch (exception: unknown) {
      console.error(exception)
      error(t('server_error_error_message'))

      return null
    }
  }

  const updatePostComments = async () => {
    setLoading(true)
    const newComments = await fetchPostComments()

    if (newComments === null) {
      return
    }

    const componentDtos = newComments.postCommentsWithChildrenCount.map((applicationDto) => {
      return PostCommentComponentDtoTranslator.fromApplication(
        applicationDto.postComment,
        applicationDto.childrenNumber,
        applicationDto.reactionsNumber,
        applicationDto.userReaction,
        locale
      )
    })

    setComments([...comments, ...componentDtos])
    const pagesNumber = PaginationHelper.calculatePagesNumber(newComments.postPostCommentsCount, defaultPerPage)

    setCanLoadMore(pageNumber < pagesNumber)
    setPageNumber(pageNumber + 1)
    setCommentsNumber(newComments.postPostCommentsCount)

    setLoading(false)
  }

  useEffect(() => {
    updatePostComments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickLikeComment = (
    commentId: string,
    userReaction: ReactionComponentDto | null,
    reactionsNumber: number
  ) => {
    const commentIndex = comments.findIndex((currentComment) => currentComment.id === commentId)

    if (commentIndex !== -1) {
      const postComment = comments[commentIndex]

      postComment.reactionsNumber = reactionsNumber
      postComment.userReaction = userReaction

      comments[commentIndex] = postComment
      setComments([...comments])
    }
  }

  let replies = null

  if (repliesOpen && commentToReply !== null) {
    const onCloseChildComments = () => {
      setCommentToReply(null)
      setRepliesOpen(false)
      setIsOpen(false)
    }

    const onRetry = () => {
      setCommentToReply(null)
      setRepliesOpen(false)
    }

    const onAddReply = (repliesNumber: number | null) => {
      const commentIndex = comments.indexOf(commentToReply)

      if (commentIndex !== -1) {
        const commentToUpdate = comments[commentIndex]

        if (repliesNumber === null) {
          commentToUpdate.repliesNumber = commentToUpdate.repliesNumber + 1
        } else {
          commentToUpdate.repliesNumber = repliesNumber
        }
        comments[commentIndex] = commentToUpdate
        setComments(comments)
      }
    }

    const onDeleteReply = () => {
      const commentIndex = comments.indexOf(commentToReply)

      if (commentIndex !== -1) {
        const commentToUpdate = comments[commentIndex]

        commentToUpdate.repliesNumber = commentToUpdate.repliesNumber - 1
        comments[commentIndex] = commentToUpdate
        setComments(comments)
      }
    }

    replies = (
      <PostChildComments
        onClickClose={ onCloseChildComments }
        onClickRetry={ onRetry }
        onAddReply={ onAddReply }
        onDeleteReply={ onDeleteReply }
        commentToReply={ commentToReply }
        onClickLikeComment={ onClickLikeComment }
      />
    )
  }

  const onDeletePostComment = (postCommentId: string) => {
    setComments(comments.filter((comment) => comment.id !== postCommentId))
    setCommentsNumber(commentsNumber - 1)
  }

  const onClickReply = (comment: PostCommentComponentDto) => {
    setCommentToReply(comment)
    setRepliesOpen(true)
  }

  const onLoadMore = async () => {
    setLoading(true)
    await updatePostComments()
    setLoading(false)
  }

  const onAddReply = async (comment: string) => {
    setLoading(true)
    setCreatingComment(true)
    await createComment(comment)
    setCreatingComment(false)
    setLoading(false)
  }

  const postCommentsContent: ReactElement = (
    <div
      className={ styles.postComments__container }
      onClick={ (event) => event.stopPropagation() }
    >
      <div className={ styles.postComments__commentsTitleBar }>
        <div className={ styles.postComments__commentsTitle }>
          { t('comment_section_title') }
          { loading
            ? <span className={ styles.postComments__commentsQuantitySkeleton }/>
            : <span className={ styles.postComments__commentsQuantity }>
                { commentsNumber }
              </span>
          }

        </div>
        <IconButton
          onClick={ () => setIsOpen(false) }
          icon={ <BsX/> }
          title={ t('close_comment_section_button_title') }
        />
      </div>
      <div
        className={ styles.postComments__comments }
        ref={ commentsAreaRef }
      >
        <PostCommentList
          onDeletePostComment={ onDeletePostComment }
          postComments={ comments }
          onClickReply={ onClickReply }
          onClickLikeComment={ onClickLikeComment }
          loading={ loading }
          creatingComment={ creatingComment }
        />
        { canLoadMore &&
          <CommonButton
            title={ t('comment_section_load_more') }
            disabled={ false }
            onClick={ onLoadMore }
          />
        }
      </div>
      <div className={ styles.postComments__addComment }>
        <AddCommentInput
          disabled={ loading }
          onAddComment={ onAddReply }
        />
      </div>
    </div>
  )

  return (
    <div
      className={ styles.postComments__backdrop }
      onClick={ () => setIsOpen(false) }
    >
      { repliesOpen ? replies : postCommentsContent }
    </div>
  )
}

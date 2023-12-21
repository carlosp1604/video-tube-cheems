import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './PostComments.module.scss'
import { BsX } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import {
  PostCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCommentComponentDtoTranslator'
import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { useTranslation } from 'next-i18next'
import { AddCommentInput } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/AddCommentInput'
import toast from 'react-hot-toast'
import { PostCommentList } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentList/PostCommentList'
import { PostChildComments } from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildComments'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { signOut } from 'next-auth/react'
import { POST_COMMENT_USER_NOT_FOUND } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { defaultPerPage, PaginationHelper } from '~/modules/Shared/Infrastructure/FrontEnd/PaginationHelper'

interface Props {
  postId: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setCommentsNumber: Dispatch<SetStateAction<number>>
  commentsNumber: number
}

export const PostComments: FC<Props> = ({ postId, setIsOpen, setCommentsNumber, commentsNumber }) => {
  const [repliesOpen, setRepliesOpen] = useState<boolean>(false)
  const [commentToReply, setCommentToReply] = useState<PostCommentComponentDto | null>(null)
  const [comments, setComments] = useState<PostCommentComponentDto[]>([])
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)

  const commentsAreaRef = useRef<HTMLDivElement>(null)
  const commentApiService = new CommentsApiService()

  const { t } = useTranslation(['post_comments', 'api_exceptions'])

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const createComment = async (comment: string) => {
    if (comment === '') {
      toast.error(t('empty_comment_is_not_allowed_error_message'))

      return
    }

    try {
      const postComment = await commentApiService.create(postId, comment, null)

      await new Promise((resolve) => {
        setTimeout(resolve, 5000)
      })

      // When a comment is created it does not have replies or reactions
      const componentResponse = PostCommentComponentDtoTranslator
        .fromApplication(postComment, 0, 0, null, locale)

      setComments([componentResponse, ...comments])
      setCommentsNumber(commentsNumber + 1)

      commentsAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

      toast.success(t('post_comment_added_success_message'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === POST_COMMENT_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }
  }

  async function fetchPostComments (): Promise<GetPostPostCommentsResponseDto | null> {
    try {
      return commentApiService.getComments(postId, pageNumber, defaultPerPage)
    } catch (exception: unknown) {
      console.error(exception)
      toast.error(t('server_error_error_message'))

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

    await new Promise((resolve) => {
      setTimeout(resolve, 5000)
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
    replies = (
      <PostChildComments
        onClickClose={ () => {
          setCommentToReply(null)
          setRepliesOpen(false)
          setIsOpen(false)
        } }
        onClickRetry={ () => {
          setCommentToReply(null)
          setRepliesOpen(false)
        } }
        onAddReply={ (repliesNumber) => {
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
        } }
        onDeleteReply={ () => {
          const commentIndex = comments.indexOf(commentToReply)

          if (commentIndex !== -1) {
            const commentToUpdate = comments[commentIndex]

            commentToUpdate.repliesNumber = commentToUpdate.repliesNumber - 1
            comments[commentIndex] = commentToUpdate
            setComments(comments)
          }
        } }
        commentToReply={ commentToReply }
        onClickLikeComment={ onClickLikeComment }
      />
    )
  }

  return (
    <div
      className={ styles.postComments__backdrop }
      onClick={ () => setIsOpen(false) }
    >
      { replies }
      <div
        className={ styles.postComments__container }
        onClick={ (event) => event.stopPropagation() }
      >
        <div className={ styles.postComments__commentsTitleBar }>
          <div className={ styles.postComments__commentsTitle }>
            { t('comment_section_title') }
            <span className={ styles.postComments__commentsQuantity }>
              { commentsNumber }
            </span>
          </div>

          <BsX
            className={ styles.postComments__commentsCloseIcon }
            onClick={ () => setIsOpen(false) }
            title={ t('close_comment_section_button') }
          />
        </div>
        <div
          className={ styles.postComments__comments }
          ref={ commentsAreaRef }
        >
          <PostCommentList
            onDeletePostComment={ (postCommentId: string) => {
              setComments(comments.filter((comment) => comment.id !== postCommentId))
              setCommentsNumber(commentsNumber - 1)
            } }
            postComments={ comments }
            onClickReply={ (comment: PostCommentComponentDto) => {
              setCommentToReply(comment)
              setRepliesOpen(true)
            } }
            onClickLikeComment={ onClickLikeComment }
            loading={ loading }
          />
          <button className={ `
            ${styles.postComments__loadMore}
            ${canLoadMore ? styles.postComments__loadMore__visible : ''}
          ` }
            onClick={ async () => {
              setLoading(true)
              await updatePostComments()
              setLoading(false)
            } }
          >
            { t('comment_section_load_more') }
          </button>
        </div>

        <AddCommentInput
          disabled={ loading }
          onAddComment={ async (comment: string) => {
            setLoading(true)
            await createComment(comment)
            setLoading(false)
          } }
        />
      </div>
    </div>
  )
}

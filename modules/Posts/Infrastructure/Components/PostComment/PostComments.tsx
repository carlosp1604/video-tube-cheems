import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './PostComments.module.scss'
import { BsX } from 'react-icons/bs'
import { useRouter } from 'next/router'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import {
  PostCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCommentComponentDtoTranslator'
import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import { calculatePagesNumber } from '~/modules/Shared/Infrastructure/Pagination'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { useTranslation } from 'next-i18next'
import { AddCommentInput } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/AddCommentInput'
import toast from 'react-hot-toast'
import { PostCommentList } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentList'
import { PostChildComments } from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildComments'

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
  const commentsAreaRef = useRef<HTMLDivElement>(null)
  const commentApiService = new CommentsApiService()

  const { t } = useTranslation('post_comments')

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const createComment = async (comment: string) => {
    if (comment === '') {
      toast.error(t('empty_comment_is_not_allowed_error_message'))

      return
    }

    try {
      const response = await commentApiService.create(postId, comment, null)

      if (response.ok) {
        const postComment = await response.json()

        const componentResponse = PostCommentComponentDtoTranslator
          .fromApplication({ childrenNumber: 0, postComment }, locale)

        setComments([componentResponse, ...comments])
        setCommentsNumber(commentsNumber + 1)

        commentsAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

        return
      }

      switch (response.status) {
        case 400:
          toast(t('bad_request_error_message'))
          break

        case 401:
          toast(t('user_must_be_authenticated_error_message'))
          break

        case 404:
          toast(t('create_post_comment_post_not_found_error_message'))
          break

        default:
          toast(t('server_error_error_message'))
          break
      }

      return
    } catch (exception: unknown) {
      console.error(exception)
      toast(t('server_error_error_message'))
    }
  }

  async function fetchPostComments (): Promise<GetPostPostCommentsResponseDto | null> {
    try {
      return commentApiService.getComments(postId, pageNumber, defaultPerPage)
    } catch (exception: unknown) {
      console.error(exception)
      toast(t('server_error_error_message'))

      return null
    }
  }

  const updatePostComments = async () => {
    const newComments = await fetchPostComments()

    if (newComments === null) {
      return
    }

    const componentDtos = newComments.postCommentsWithChildrenCount.map((applicationDto) => {
      return PostCommentComponentDtoTranslator.fromApplication(applicationDto, locale)
    })

    setComments([...comments, ...componentDtos])
    const pagesNumber = calculatePagesNumber(newComments.postPostCommentsCount, defaultPerPage)

    setCanLoadMore(pageNumber < pagesNumber)
    setPageNumber(pageNumber + 1)
    setCommentsNumber(newComments.postPostCommentsCount)
  }

  useEffect(() => {
    updatePostComments()
  }, [])

  let replies = null

  if (repliesOpen && commentToReply !== null) {
    replies = (
      <PostChildComments
        onClickClose={ () => {
          setRepliesOpen(false)
          setIsOpen(false)
        } }
        onClickRetry={ () => setRepliesOpen(false) }
        onAddReply={ () => {
          const commentIndex = comments.indexOf(commentToReply)

          if (commentIndex !== -1) {
            const commentToUpdate = comments[commentIndex]

            commentToUpdate.repliesNumber = commentToUpdate.repliesNumber + 1
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
            key={ postId }
            onDeletePostComment={ (postCommentId: string) => {
              setComments(comments.filter((comment) => comment.id !== postCommentId))
              setCommentsNumber(commentsNumber - 1)
              toast.success(t('post_comment_deleted_success_message'))
            } }
            postComments={ comments }
            onClickReply={ (comment: PostCommentComponentDto) => {
              setCommentToReply(comment)
              setRepliesOpen(true)
            } }
          />
          <button className={ `
            ${styles.postComments__loadMore}
            ${canLoadMore ? styles.postComments__loadMore__visible : ''}
          ` }
            onClick={ () => updatePostComments() }
          >
            { t('comment_section_load_more') }
          </button>
        </div>

        <AddCommentInput
          onAddComment={ async (comment: string) => {
            await createComment(comment)
          } }
        />
      </div>
    </div>
  )
}

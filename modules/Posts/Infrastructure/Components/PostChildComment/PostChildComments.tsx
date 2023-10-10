import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { BsArrowLeftShort, BsX } from 'react-icons/bs'
import styles from './PostChildComments.module.scss'
import { RepliesApiService } from '~/modules/Posts/Infrastructure/Frontend/RepliesApiService'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import {
  PostChildCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostChildCommentComponentTranslator'
import {
  GetPostPostChildCommentsResponseDto
} from '~/modules/Posts/Application/GetPostPostChildComments/GetPostPostChildCommentsResponseDto'
import { calculatePagesNumber, defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { useTranslation } from 'next-i18next'
import { AddCommentInput } from '~/modules/Posts/Infrastructure/Components/AddCommentInput/AddCommentInput'
import toast from 'react-hot-toast'
import { PostChildCommentList } from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentList'
import {
  POST_CHILD_COMMENT_PARENT_COMMENT_NOT_FOUND,
  POST_CHILD_COMMENT_POST_NOT_FOUND
} from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'

interface Props {
  commentToReply: PostCommentComponentDto
  onClickClose: () => void
  onClickRetry: () => void
  onAddReply: () => void
  onDeleteReply: () => void
  onLikeReply: () => void
}

export const PostChildComments: FC<Props> = ({
  commentToReply,
  onClickClose,
  onClickRetry,
  onAddReply,
  onDeleteReply,
}) => {
  const [replies, setReplies] = useState<PostChildCommentComponentDto[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const repliesAreaRef = useRef<HTMLDivElement>(null)

  const apiService = new RepliesApiService()

  const { t } = useTranslation('post_comments')

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const createReply = async (comment: string) => {
    if (comment === '') {
      toast.error(t('empty_comment_is_not_allowed_error_message'))

      return
    }

    try {
      const response = await apiService.create(commentToReply.postId, comment, commentToReply.id)

      if (response.ok) {
        const postChildComment = await response.json()

        const componentResponse = PostChildCommentComponentDtoTranslator
          .fromApplication(postChildComment, 0, null, locale)

        setReplies([componentResponse, ...replies])
        onAddReply()

        repliesAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

        return
      }

      switch (response.status) {
        case 400:
          toast.error(t('bad_request_error_message'))
          break

        case 401:
          toast.error(t('user_must_be_authenticated_error_message'))
          break

        case 404: {
          const jsonResponse = await response.json()

          switch (jsonResponse.code) {
            case POST_CHILD_COMMENT_POST_NOT_FOUND:
              toast.error(t('create_post_child_comment_post_not_found_error_message'))
              break

            case POST_CHILD_COMMENT_PARENT_COMMENT_NOT_FOUND:
              toast.error(t('create_post_child_comment_parent_comment_not_found_error_message'))
              break

            default:
              toast.error(t('server_error_error_message'))
              break
          }

          break
        }

        default:
          toast.error(t('server_error_error_message'))
          break
      }
    } catch (exception: unknown) {
      console.error(exception)
      toast.error(t('server_error_error_message'))
    }
  }

  const fetchReplies = async (): Promise<GetPostPostChildCommentsResponseDto | null> => {
    try {
      return apiService.getComments(commentToReply.postId, commentToReply.id, pageNumber, defaultPerPage)
    } catch (exception: unknown) {
      console.error(exception)
      toast.error(t('server_error_error_message'))

      return null
    }
  }

  const updateReplies = async () => {
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

    const pagesNumber = calculatePagesNumber(newReplies.childCommentsCount, defaultPerPage)

    setCanLoadMore(pageNumber < pagesNumber)
    setPageNumber(pageNumber + 1)
  }

  useEffect(() => {
    updateReplies()
  }, [])

  return (
    <div
      className={ styles.postChildComments__backdrop }
      onClick={ onClickClose }
      ref={ repliesAreaRef }
    >
      <div
        className={ styles.postChildComments__container }
        onClick={ (event) => event.stopPropagation() }
      >
        <div className={ styles.postChildComments__titleBar }>
          <div className={ styles.postChildComments__title }>
            <BsArrowLeftShort
              className={ styles.postChildComments__titleBarIcon }
              onClick={ onClickRetry }
            />
            { t('replies_section_title') }
          </div>

          <BsX
            className={ styles.postChildComments__titleBarIcon }
            onClick={ onClickClose }
          />
        </div>
        <div className={ styles.postChildComments__postChildComments }>
          <PostChildCommentList
            postComment={ commentToReply }
            postChildComments={ replies }
            onDeletePostChildComment={ (postCommentId: string) => {
              setReplies(replies.filter((childComment) => childComment.id !== postCommentId))
              onDeleteReply()
              toast.success(t('post_comment_deleted_success_message'))
            } }
          />

          <button className={ `
            ${styles.postChildComments__loadMore}
            ${canLoadMore ? styles.postChildComments__loadMore__open : ''}
          ` }>
            { t('replies_section_load_more') }
          </button>
        </div>

        <AddCommentInput
          onAddComment={ async (comment: string) => {
            await createReply(comment)
          } } />
      </div>
  </div>
  )
}

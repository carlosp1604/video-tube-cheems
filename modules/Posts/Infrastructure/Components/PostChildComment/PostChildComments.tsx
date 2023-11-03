import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { BsArrowLeftShort, BsX } from 'react-icons/bs'
import styles from './PostChildComments.module.scss'
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
import {
  PostChildCommentList
} from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentList/PostChildCommentList'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { POST_COMMENT_USER_NOT_FOUND } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'
import { signOut } from 'next-auth/react'

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
  const repliesAreaRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation(['post_comments', 'api_exceptions'])

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const createReply = async (comment: string) => {
    if (comment === '') {
      toast.error(t('empty_comment_is_not_allowed_error_message'))

      return
    }

    try {
      const postChildComment =
        await new CommentsApiService().createReply(commentToReply.postId, comment, commentToReply.id)

      const componentResponse = PostChildCommentComponentDtoTranslator
        .fromApplication(postChildComment, 0, null, locale)

      setReplies([componentResponse, ...replies])
      onAddReply(null)

      repliesAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

      toast.success(t('post_child_comment_added_success_message'))
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

  const fetchReplies = async (): Promise<GetPostPostChildCommentsResponseDto | null> => {
    try {
      const response = await new CommentsApiService()
        .getChildComments(commentToReply.postId, commentToReply.id, pageNumber, defaultPerPage)

      onAddReply(response.childCommentsCount)

      return response
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
            <span className={ styles.postChildComments__commentsQuantity }>
              { commentToReply.repliesNumber }
            </span>
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
            } }
            onClickLikeComment={ onClickLikeComment }
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

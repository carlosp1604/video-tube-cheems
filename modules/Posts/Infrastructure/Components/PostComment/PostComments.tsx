import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './PostComments.module.scss'
import { BsChatDots, BsX } from 'react-icons/bs'
import { CommentCard } from './CommentCard'
import { useRouter } from 'next/router'
import { CommentReplies } from './PostCommentReplies'
import { AutoSizableTextArea } from './AutoSizableTextArea'
import Avatar from 'react-avatar'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { useUserContext } from '~/hooks/UserContext'
import { usePostCommentable } from '~/hooks/CommentableContext'
import {
  PostCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostCommentComponentDtoTranslator'
import { GetPostPostCommentsResponseDto } from '~/modules/Posts/Application/Dtos/GetPostPostCommentsResponseDto'
import { defaultPerPage } from '~/modules/Shared/Domain/Pagination'
import { calculatePagesNumber } from '~/modules/Shared/Infrastructure/Pagination'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { useTranslation } from 'next-i18next'

interface Props {
  postId: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setCommentsNumber: Dispatch<SetStateAction<number>>
  commentsNumber: number
}

export const PostComments: FC<Props> = ({ postId, isOpen, setIsOpen, setCommentsNumber, commentsNumber }) => {
  const [repliesOpen, setRepliesOpen] = useState<boolean>(false)
  const [commentToReply, setCommentToReply] = useState<PostCommentComponentDto | null>(null)
  const [comments, setComments] = useState<PostCommentComponentDto[]>([])
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [comment, setComment] = useState<string>('')
  const commentsAreaRef = useRef<HTMLDivElement>(null)
  const commentApiService = new CommentsApiService()

  const { t } = useTranslation('post_comments')

  const router = useRouter()
  const locale = router.locale ?? 'en'
  const { user } = useUserContext()
  const commentable = usePostCommentable()

  let avatar = null

  if (user !== null) {
    if (user?.image !== null) {
      avatar = (
        <img
          className={ styles.commentCard__userLogo }
          src={ user.image ?? '' }
          alt={ user.name }
        />
      )
    } else {
      avatar = (
        <Avatar
          className={ styles.commentCard__userLogo }
          round={ true }
          size={ '34' }
          name={ user.name }
          textSizeRatio={ 2 }
        />)
    }
  }

  const createComment = async () => {
    try {
      const response = await commentApiService.create(postId, comment, null)

      const componentResponse = PostCommentComponentDtoTranslator
        .fromApplication({ childrenNumber: 0, postComment: response }, locale)

      setComments([componentResponse, ...comments])
      setCommentsNumber(commentsNumber + 1)
      setComment('')

      commentsAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch (exception: unknown) {
      console.log(exception)
    }
  }

  async function fetchPostComments (): Promise<GetPostPostCommentsResponseDto> {
    return commentApiService.getComments(postId, pageNumber, defaultPerPage)
  }

  const updatePostComments = async () => {
    const newComments = await fetchPostComments()

    const componentDtos = newComments.postCommentsWithChildrenCount.map((applicationDto) => {
      return PostCommentComponentDtoTranslator.fromApplication(applicationDto, locale)
    })

    setComments([...comments, ...componentDtos])
    const pagesNumber = calculatePagesNumber(newComments.postPostCommentsCount, defaultPerPage)

    setCanLoadMore(pageNumber < pagesNumber)
    setPageNumber(pageNumber + 1)
    setCommentsNumber(newComments.postPostCommentsCount)
  }

  // NOTE: When comment section is open, we fetch the post comments
  // NOTE: When comment section is closed, we reset the post comments
  useEffect(() => {
    if (isOpen) {
      updatePostComments()
    } else {
      setPageNumber(1)
      setComments([])
    }
  }, [isOpen])

  let replies = null

  if (repliesOpen && commentToReply !== null) {
    replies = (
      <CommentReplies
        onClickClose={ () => setIsOpen(false) }
        onClickRetry={ () => setRepliesOpen(false) }
        onAddReply={ () => {
          const commentIndex = comments.indexOf(commentToReply)

          if (commentIndex !== -1) {
            const commentToUpdate = comments[commentIndex]

            commentToUpdate.repliesNumber = commentToUpdate.repliesNumber + 1
            comments[commentIndex] = commentToUpdate
          }
        } }
        onDeleteReply={ undefined }
        commentToReply={ commentToReply }
        isOpen={ repliesOpen }
      />
    )
  }

  return (
    <div className={ `
        ${styles.postComments__backdrop}
        ${isOpen ? styles.postComments__backdrop__open : ''}
      ` }
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
          />
        </div>
        <div
          className={ styles.postComments__comments }
          ref={ commentsAreaRef }
        >
          { comments.map((comment) => {
            return (
              <div
                className={ styles.postComments__commentWithReplies }
                key={ comment.id }
              >
                <CommentCard
                  comment={ comment }
                  key={ comment.id }
                />
                <button
                  className={ styles.postComments__replies_button }
                  onClick={ () => {
                    setCommentToReply(comment)
                    setRepliesOpen(true)
                  } }
                >
                  { comment.repliesNumber > 0
                    ? t('comment_replies_button', { replies: comment.repliesNumber })
                    : t('comment_reply_button')
                  }
                </button>
              </div>
            )
          }) }
          <button className={ `
              ${styles.postComments__loadMore}
              ${canLoadMore ? styles.postComments__loadMore__open : ''}
            ` }
            onClick={ () => updatePostComments() }
          >
            { t('comment_section_load_more') }
          </button>
        </div>

        <div className={ `
            ${styles.postComments__addCommentSection}
            ${commentable ? styles.postComments__addCommentSection__open : ''}
        ` }>
          { avatar }
          <AutoSizableTextArea
            placeHolder={ t('add_reply_placeholder') }
            comment={ comment }
            onCommentChange={ (value) => setComment(value) }
          />
          <button className={ styles.postComments__addCommentButton }>
            <BsChatDots
              className={ styles.postComments__addCommentIcon }
              onClick={ createComment }
            />
          </button>
        </div>
      </div>
    </div>
  )
}

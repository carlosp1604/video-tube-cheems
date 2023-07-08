import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { BsArrowLeftShort, BsChatDots, BsX } from 'react-icons/bs'
import { AutoSizableTextArea } from './AutoSizableTextArea'
import { CommentCard } from './CommentCard'
import styles from './PostComments.module.scss'
import Avatar from 'react-avatar'
import { RepliesApiService } from '~/modules/Posts/Infrastructure/Frontend/RepliesApiService'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { usePostCommentable } from '~/hooks/CommentableContext'
import { useUserContext } from '~/hooks/UserContext'
import {
  PostChildCommentComponentDtoTranslator
} from '~/modules/Posts/Infrastructure/Translators/PostChildCommentComponentTranslator'
import {
  GetPostPostChildCommentsResponseDto
} from '~/modules/Posts/Application/Dtos/GetPostPostChildCommentsResponseDto'
import { calculatePagesNumber, defaultPerPage } from '~/modules/Shared/Infrastructure/Pagination'
import { useTranslation } from 'next-i18next'

interface Props {
  isOpen: boolean
  commentToReply: PostCommentComponentDto | null
  onClickClose: () => void
  onClickRetry: () => void
  onAddReply: () => void
  onDeleteReply: (() => void) | undefined
}

export const CommentReplies: FC<Props> = ({
  isOpen,
  commentToReply,
  onClickClose,
  onClickRetry,
  onAddReply,
  onDeleteReply,
}) => {
  const [replies, setReplies] = useState<PostChildCommentComponentDto[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')
  const repliesAreaRef = useRef<HTMLDivElement>(null)
  const apiService = new RepliesApiService()

  const { t } = useTranslation('post_comments')

  const commentable = usePostCommentable()

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { user } = useUserContext()

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
          className={ styles.userMenu__userAvatar }
          round={ true }
          size={ '34' }
          name={ user.name }
          textSizeRatio={ 2 }
        />)
    }
  }

  const createReply = async () => {
    try {
      if (commentToReply !== null) {
        const response = await apiService.create(commentToReply.postId, comment, commentToReply.id)

        const componentResponse = PostChildCommentComponentDtoTranslator
          .fromApplication(response, locale)

        setReplies([componentResponse, ...replies])
        onAddReply()
        setComment('')

        repliesAreaRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
    } catch (exception: unknown) {
      console.log(exception)
    }
  }

  const fetchReplies = async (): Promise<GetPostPostChildCommentsResponseDto> => {
    return apiService.getComments(commentToReply?.id ?? '', pageNumber, defaultPerPage)
  }

  const updateReplies = async () => {
    const newReplies = await fetchReplies()

    console.log(newReplies)

    const componentDtos = newReplies.childComments.map((applicationDto) => {
      return PostChildCommentComponentDtoTranslator.fromApplication(
        applicationDto, locale
      )
    })

    setReplies([...replies, ...componentDtos])

    const pagesNumber = calculatePagesNumber(newReplies.childCommentsCount, defaultPerPage)

    setCanLoadMore(pageNumber < pagesNumber)
    setPageNumber(pageNumber + 1)
  }

  let repliedComment = null

  if (commentToReply !== null) {
    repliedComment = (
      <CommentCard
        comment={ commentToReply }
        key={ commentToReply?.id }
      />
    )
  }

  useEffect(() => {
    if (!isOpen) {
      setPageNumber(1)
      setReplies([])
    } else {
      updateReplies()
    }
  }, [isOpen])

  return (
    <div className={ `
      ${styles.postComments__repliesBackdrop}
      ${isOpen ? styles.postComments__repliesBackdrop__open : ''}
    ` }
      onClick={ onClickClose }
      ref={ repliesAreaRef }
    >
    <div
      className={ `
        ${styles.postComments__container}
        ${isOpen ? styles.postComments__container : ''}
      ` }
      onClick={ (event) => event.stopPropagation() }
    >
      <div className={ styles.postComments__commentsTitleBar }>
        <div className={ styles.postComments__commentsTitle }>
          <span className={ styles.postComments__commentsQuantity }>
            <BsArrowLeftShort
              className={ styles.postComments__commentsCloseIcon }
              onClick={ onClickRetry }
            />
          </span>
          { t('replies_section_title') }
        </div>

        <BsX
          className={ styles.postComments__commentsCloseIcon }
          onClick={ onClickClose }
        />
      </div>
      <div className={ styles.postComments__repliedComment }>
        { repliedComment }
      </div>

      <div className={ styles.postComments__replies }>
        { replies.map((reply) => {
          return (<CommentCard comment={ reply } key={ reply.id }/>)
        }) }
        <button className={ `
          ${styles.postComments__loadMore}
          ${canLoadMore ? styles.postComments__loadMore__open : ''}
        ` }>
          { t('replies_section_load_more') }
        </button>
      </div>
      <div className={ `
          ${styles.postComments__addCommentSection}
          ${commentable ? styles.postComments__addCommentSection__open : ''}
        ` }>
        { avatar }
          <AutoSizableTextArea
            comment={ comment }
            onCommentChange={ (value) => setComment(value) }
            placeHolder={ t('add_comment_placeholder') }
          />
          <button className={ styles.postComments__addCommentButton }>
            <BsChatDots
              className={ styles.postComments__addCommentIcon }
              onClick={ createReply }
            />
          </button>
        </div>
    </div>
  </div>
  )
}

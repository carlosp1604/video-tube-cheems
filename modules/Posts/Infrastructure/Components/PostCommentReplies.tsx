import { useRouter } from 'next/router'
import { Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react'
import { BsArrowLeftShort, BsChatDots, BsX } from 'react-icons/bs'
import { usePostCommentable } from '../../../../hooks/CommentableContext'
import { useUserContext } from '../../../../hooks/UserContext'
import { calculatePagesNumber, defaultPerPage } from '../../../Shared/Infrastructure/Pagination'
import { ChildCommentApplicationDto } from '../../Application/Dtos/ChildCommentApplicationDto'
import { GetPostPostChildCommentsRespondeDto } from '../../Application/Dtos/GetPostPostChildCommentsResponseDto'
import { PostChildCommentComponentDto } from '../Dtos/PostChildCommentComponentDto'
import { PostCommentComponentDto } from '../Dtos/PostCommentComponentDto'
import { PostChildCommentComponentDtoTranslator } from '../Translators/PostChildCommentComponentTranslator'
import { AutoSizableTextArea } from './AutoSizableTextArea'
import { CommentCard } from './CommentCard'
import styles from './PostComments.module.scss'

interface Props {
  postId: string,
  setCommentToReply: Dispatch<SetStateAction<PostCommentComponentDto | null>>
  setCommentsOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
  commentToReply: PostCommentComponentDto | null
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const CommentReplies: FC<Props> = ({ 
  postId,
  setCommentToReply,
  setCommentsOpen,
  commentToReply,
  setIsOpen,
  isOpen,
}) => {
  const [repliedComment, setRepliedComment] = useState<ReactElement | string>('')
  const [replies, setReplies] = useState<PostChildCommentComponentDto[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')
  const repliesAreaRef = useRef<HTMLDivElement>(null)

  const commentable = usePostCommentable()

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { user } = useUserContext()

  const createReply = async () => {
    try {
      const response: ChildCommentApplicationDto = await
        (await fetch(`/api/posts/${postId}/comments`, {
          method: 'POST',
          body: JSON.stringify({
            comment: comment,
            parentCommentId: commentToReply?.id,
          })
      })).json()

      const componentResponse = PostChildCommentComponentDtoTranslator
        .fromApplication(response, locale)

      setReplies([componentResponse, ...replies])
      setComment('')

      if (commentToReply !== null) {
        setCommentToReply({
          ...commentToReply,
          repliesNumber: commentToReply.repliesNumber + 1
        })
      }

      if (repliesAreaRef.current) {
        repliesAreaRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
    }
    catch (exception: unknown) {
      console.log(exception)
    }
  }

  const fetchReplies = async (): Promise<GetPostPostChildCommentsRespondeDto> => {
    const params = new URLSearchParams()
    params.append('page', pageNumber.toString())
    params.append('perPage', defaultPerPage.toString())
    params.append('parentCommentId', commentToReply?.id ?? '')
    return ((await fetch(`/api/posts/${commentToReply?.postId}/comments?${params}`)).json())
  }

  const updateReplies = async () => {
    const newReplies = await fetchReplies()

    const componentDtos = newReplies.childComments.map((applicationDto) => {
      return PostChildCommentComponentDtoTranslator.fromApplication(
        applicationDto, locale
      )
    })

    setReplies([...replies, ...componentDtos])

    if (commentToReply !== null) {
      setCommentToReply({
        ...commentToReply,
        repliesNumber: newReplies.childCommentsCount
      })
    }

    const pagesNumber = calculatePagesNumber(newReplies.childCommentsCount, defaultPerPage)

    if (pageNumber < pagesNumber) {
      setCanLoadMore(true)
    } 
    else {
      setCanLoadMore(false)
    }

    setPageNumber(pageNumber+1)
  }

  useEffect(() => {
    if (!isOpen) {
      setPageNumber(1)
      setReplies([])
    }
    else {
      if (commentToReply !== null) {
        updateReplies()
        setRepliedComment(
          <CommentCard
            comment={commentToReply}
            key={commentToReply?.id}
          />
        )
      }
    }
  }, [isOpen])

  return (
    <div className={ `
      ${styles.postComments__repliesBackdrop}
      ${isOpen ? styles.postComments__repliesBackdrop__open : ''}
    `}
      onClick={() => {
        setIsOpen(false)
      }}
      ref={repliesAreaRef}
    >
    <div 
      className={`
        ${styles.postComments__container}
        ${isOpen ? styles.postComments__container : ''}
      `}
      onClick={(event) => event.stopPropagation()} 
    >
      <div className={styles.postComments__commentsTitleBar}>
        <div className={styles.postComments__commentsTitle}>
          <span className={styles.postComments__commentsQuantity}>
            <BsArrowLeftShort
              className={styles.postComments__commentsCloseIcon}
              onClick={() => setIsOpen(false)}
            />
          </span>
          Respuestas
        </div>
        
        <BsX
          className={styles.postComments__commentsCloseIcon}
          onClick={() => {
            setIsOpen(false)
            setCommentsOpen(false)
          }}
        /> 
      </div>
      <div className={styles.postComments__repliedComment}>
        {repliedComment}
      </div>
      
      <div className={styles.postComments__replies}>
        { replies.map((reply) => {
          return (
            <CommentCard
              comment={reply}
              key={reply.id}
            />
          )
        })}
        <button className={`
          ${styles.postComments__loadMore}
          ${canLoadMore ? styles.postComments__loadMore__open : ''}
        `}>
          Load more
        </button>
      </div>
      <div className={`
          ${styles.postComments__addCommentSection}
          ${commentable ? styles.postComments__addCommentSection__open : ''}
        `}>
          <img
            className={styles.postComments__userLogo}
            src={user?.image ?? ''}
            alt={user?.name}
          />
          <AutoSizableTextArea
            comment={comment}
            setComment={setComment}
          />
          <button className={styles.postComments__addCommentButton}>
            <BsChatDots
              className={styles.postComments__addCommentIcon}
              onClick={createReply}
            />
          </button>
        </div>
    </div>
  </div>
  )
}
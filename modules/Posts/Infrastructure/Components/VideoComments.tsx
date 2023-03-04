import { ChangeEvent, Dispatch, FC, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './VideoComments.module.scss'
import { BsArrowLeftShort, BsChatDots, BsX } from 'react-icons/bs'
import { CommentCard } from './CommentCard'
import { useUserContext } from '../../../../hooks/UserContext'
import { GetPostPostCommentsRespondeDto } from '../../Application/Dtos/GetPostPostCommentsResponseDto'
import { calculatePagesNumber, defaultPerPage } from '../../../Shared/Infrastructure/Pagination'
import { PostCommentComponentDto } from '../Dtos/PostCommentComponentDto'
import { PostCommentComponentDtoTranslator } from '../Translators/PostCommentComponentDtoTranslator'
import { useRouter } from 'next/router'
import { CommentApplicationDto } from '../../Application/Dtos/CommentApplicationDto'
import { GetPostPostChildCommentsRespondeDto } from '../../Application/Dtos/GetPostPostChildCommentsResponseDto'
import { PostChildCommentComponentDto } from '../Dtos/PostChildCommentComponentDto'
import { ChildCommentApplicationDto } from '../../Application/Dtos/ChildCommentApplicationDto'
import { PostChildCommentComponentDtoTranslator } from '../Translators/PostChildCommentComponentTranslator'

interface VideoCommentsProps {
  postId: string,
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setCommentsNumber: Dispatch<SetStateAction<number>>
  commentsNumber: number
}

interface CommentRepliesProps {
  postId: string,
  setCommentToReply: Dispatch<SetStateAction<PostCommentComponentDto | null>>
  setCommentsOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
  commentToReply: PostCommentComponentDto | null
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

interface AutoSizableTextAreaProps {
  setComment: Dispatch<SetStateAction<string>>
  comment: string
}

const usePostCommentable = () => {
  const { status } = useUserContext()
  const commentable = useRef(true)

  useEffect(() => {
    if (status === 'SIGNED_IN') {
      commentable.current = true
    }
    else {
      commentable.current = false
    }
  }, [status])

  return commentable.current
}

export const AutoSizableTextArea: FC<AutoSizableTextAreaProps> = ({ 
  setComment,
  comment 
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  useEffect(() => {
    if (textAreaRef !== null && textAreaRef.current !== null) {
      textAreaRef.current.style.height = '0px'
      let scrollHeight = textAreaRef.current.scrollHeight
      if (scrollHeight === 0) {
        scrollHeight = 40
      }
      textAreaRef.current.style.height = Math.min(scrollHeight, 90) + 'px'
    }
 
  }, [comment])

  return (
    <textarea
      className={styles.videoComments__commentInput}
      placeholder={ 'Escribe tu comentario'}
      onChange={handleOnChange}
      value={comment}
      ref={textAreaRef}
    />
  )
}

export const CommentReplies: FC<CommentRepliesProps> = ({ 
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
      ${styles.videoComments__repliesBackdrop}
      ${isOpen ? styles.videoComments__repliesBackdrop__open : ''}
    `}
      onClick={() => {
        setIsOpen(false)
      }}
    >
    <div 
      className={`
        ${styles.videoComments__container}
        ${isOpen ? styles.videoComments__container : ''}
      `}
      onClick={(event) => event.stopPropagation()} 
    >
      <div className={styles.videoComments__commentsTitleBar}>
        <div className={styles.videoComments__commentsTitle}>
          <span className={styles.videoComments__commentsQuantity}>
            <BsArrowLeftShort 
              className={styles.videoComments__commentsCloseIcon}
              onClick={() => setIsOpen(false)}
            />
          </span>
          Respuestas
        </div>
        
        <BsX 
          className={styles.videoComments__commentsCloseIcon}
          onClick={() => {
            setIsOpen(false)
            setCommentsOpen(false)
          }}
        /> 
      </div>
      <div className={styles.videoComments__repliedComment}>
        {repliedComment}
      </div>
      
      <div className={styles.videoComments__replies}>
        { replies.map((reply) => {
          return (
            <CommentCard
              comment={reply}
              key={reply.id}
            />
          )
        })}
        <button className={`
          ${styles.videoComments__loadMore}
          ${canLoadMore ? styles.videoComments__loadMore__open : ''}
        `}>
          Load more
        </button>
      </div>
      <div className={`
          ${styles.videoComments__addCommentSection}
          ${commentable ? styles.videoComments__addCommentSection__open : ''}
        `}>
          <img
            className={styles.videoComments__userLogo}
            src={user?.image ?? ''}
            alt={user?.name}
          />
          <AutoSizableTextArea
            comment={comment}
            setComment={setComment}
          />
          <button className={styles.videoComments__addCommentButton}>
            <BsChatDots 
              className={styles.videoComments__addCommentIcon}
              onClick={createReply}
            />
          </button>
        </div>
    </div>
  </div>
  )
}

export const VideoComments: FC<VideoCommentsProps> = ({ postId, isOpen, setIsOpen, setCommentsNumber, commentsNumber }) => {
  const [repliesOpen, setRepliesOpen] = useState<boolean>(false)
  const [commentToReply, setCommentToReply] = useState<PostCommentComponentDto | null>(null)
  const [comments, setComments] = useState<PostCommentComponentDto[]>([])
  const [canLoadMore, setCanLoadMore] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [comment, setComment] = useState<string>('')
  const commentsAreaRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const locale = router.locale ?? 'en'

  const { user } = useUserContext()

  const commentable = usePostCommentable()

  const createComment = async () => {
    try {
      const response: CommentApplicationDto = await
        (await fetch(`/api/posts/${postId}/comments`, {
          method: 'POST',
          body: JSON.stringify({
            comment: comment,
            parentCommentId: null,
          })
      })).json()

      const componentResponse = PostCommentComponentDtoTranslator
        .fromApplication({ childComments: 0, postComment: response }, locale)

      setComments([componentResponse, ...comments])
      setCommentsNumber(commentsNumber + 1)
      setComment('')

      if (commentsAreaRef.current) {
        commentsAreaRef.current.scrollTo({
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

  const fetchPostComments = async (): Promise<GetPostPostCommentsRespondeDto> => {
    const params = new URLSearchParams()
    params.append('page', pageNumber.toString())
    params.append('perPage', defaultPerPage.toString())
    return (await fetch(`/api/posts/${postId}/comments?${params}`)).json()
  }

  const updateComment = () => {
    if (commentToReply !== null) {
      setComments(comments.map((comment) => {
        return (comment.id === commentToReply?.id ? commentToReply : comment)
      }))
    }
  }

  const updatePostComments = async () => {
    const newComments = await fetchPostComments()

    const componentDtos = newComments.commentwithChildCount.map((applicationDto) => {
      return PostCommentComponentDtoTranslator.fromApplication(applicationDto, locale)
    })

    setComments([...comments, ...componentDtos])
    const pagesNumber = calculatePagesNumber(newComments.postPostCommentsCount, defaultPerPage)

    if (pageNumber < pagesNumber) {
      setCanLoadMore(true)
    }
    else {
      setCanLoadMore(false)
    }

    setPageNumber(pageNumber+1)
    setCommentsNumber(newComments.postPostCommentsCount)
  }

  useEffect(() => {
    if (isOpen) {
      if (comments.length === 0) {
        updatePostComments()
      }

      document.body.style.overflow = 'hidden'
    } 
    else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    if (!repliesOpen) {
      updateComment()
      setCommentToReply(null)
    }
  }, [repliesOpen])

  return (
    <>
      <CommentReplies 
        postId={postId}
        setCommentToReply={setCommentToReply}
        setCommentsOpen={setIsOpen}
        commentToReply={commentToReply}
        isOpen={repliesOpen}
        setIsOpen={setRepliesOpen}
      />

    <div className={ `
      ${styles.videoComments__backdrop}
      ${isOpen ? styles.videoComments__backdrop__open : ''}
    `}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className={styles.videoComments__container}
        onClick={(event) => event.stopPropagation()} 
      >
        <div className={styles.videoComments__commentsTitleBar}>
          <div className={styles.videoComments__commentsTitle}>
            Comentarios
            <span className={styles.videoComments__commentsQuantity}>
            {commentsNumber}
            </span>
          </div>
          
          <BsX 
            className={styles.videoComments__commentsCloseIcon}
            onClick={() => setIsOpen(false)}
          /> 
        </div>
        <div 
          className={styles.videoComments__comments}
          ref={commentsAreaRef}
        >
          { comments.map((comment) => {
            return (
              <div className={styles.videoComments__commentWithReplies}>
                <CommentCard
                  comment={comment}
                  key={comment.id}
                />
                <button
                  className={styles.videoComments__replies_button}
                  onClick={() => {
                    setCommentToReply(comment)
                    setRepliesOpen(true)
                  }}
                >
                  {comment.repliesNumber > 0 ? `${comment.repliesNumber} ` : ''}
                  {comment.repliesNumber > 0 ? 'replies' : 'reply'}
                </button>
              </div>
            )
        })}
          <button className={`
            ${styles.videoComments__loadMore}
            ${canLoadMore ? styles.videoComments__loadMore__open : ''}
            `}
            onClick={() => updatePostComments()}
          >
            Load more
          </button>
        </div>

        <div className={`
          ${styles.videoComments__addCommentSection}
          ${commentable ? styles.videoComments__addCommentSection__open : ''}
        `}>
          <img
            className={styles.videoComments__userLogo}
            src={user?.image ?? ''}
            alt={user?.name}
          />
          <AutoSizableTextArea
            comment={comment}
            setComment={setComment}
          />
          <button className={styles.videoComments__addCommentButton}>
            <BsChatDots 
              className={styles.videoComments__addCommentIcon}
              onClick={createComment}
            />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
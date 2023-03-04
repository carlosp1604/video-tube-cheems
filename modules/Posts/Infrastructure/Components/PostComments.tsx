import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './PostComments.module.scss'
import { BsChatDots, BsX } from 'react-icons/bs'
import { CommentCard } from './CommentCard'
import { useUserContext } from '../../../../hooks/UserContext'
import { GetPostPostCommentsRespondeDto } from '../../Application/Dtos/GetPostPostCommentsResponseDto'
import { calculatePagesNumber, defaultPerPage } from '../../../Shared/Infrastructure/Pagination'
import { PostCommentComponentDto } from '../Dtos/PostCommentComponentDto'
import { PostCommentComponentDtoTranslator } from '../Translators/PostCommentComponentDtoTranslator'
import { useRouter } from 'next/router'
import { CommentApplicationDto } from '../../Application/Dtos/CommentApplicationDto'
import { usePostCommentable } from '../../../../hooks/CommentableContext'
import { CommentReplies } from './PostCommentReplies'
import { AutoSizableTextArea } from './AutoSizableTextArea'

interface Props {
  postId: string,
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
      ${styles.postComments__backdrop}
      ${isOpen ? styles.postComments__backdrop__open : ''}
    `}
      onClick={() => setIsOpen(false)}
    >
      <div 
        className={styles.postComments__container}
        onClick={(event) => event.stopPropagation()} 
      >
        <div className={styles.postComments__commentsTitleBar}>
          <div className={styles.postComments__commentsTitle}>
            Comentarios
            <span className={styles.postComments__commentsQuantity}>
            {commentsNumber}
            </span>
          </div>
          
          <BsX 
            className={styles.postComments__commentsCloseIcon}
            onClick={() => setIsOpen(false)}
          /> 
        </div>
        <div 
          className={styles.postComments__comments}
          ref={commentsAreaRef}
        >
          { comments.map((comment) => {
            return (
              <div className={styles.postComments__commentWithReplies}>
                <CommentCard
                  comment={comment}
                  key={comment.id}
                />
                <button
                  className={styles.postComments__replies_button}
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
            ${styles.postComments__loadMore}
            ${canLoadMore ? styles.postComments__loadMore__open : ''}
            `}
            onClick={() => updatePostComments()}
          >
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
              onClick={createComment}
            />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
import { Dispatch, FC, ReactElement, SetStateAction, useEffect, useState } from 'react'
import styles from './VideoComments.module.scss'
import { CommentApplicationDto } from '../../Application/Dtos/CommentApplicationDto'
import { BsChatDots, BsX } from 'react-icons/bs'
import { CommentCard } from './CommentCard'
import { useUserContext } from '../../../../hooks/UserContext'

interface Props {
  comments: CommentApplicationDto[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const VideoComments: FC<Props> = ({ comments, isOpen, setIsOpen }) => {
  const [openCommentInput, setOpenCommentInput] = useState<boolean>(false)
  const [repliesOpen, setRepliesOpen] = useState<boolean>(false)
  const [commentToReply, setCommentToReply] = useState<CommentApplicationDto | null>(null)
  const [repliedComment, setRepliedComment] = useState<ReactElement | string>('')
  const [commentable, setCommentable] = useState<boolean>(false)
  const { status, user } = useUserContext()

  useEffect(() => {
    if (!isOpen) {
      setOpenCommentInput(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (status === 'SIGNED_IN') {
      setCommentable(true)
    }
  }, [status])

  useEffect(() => {
    if (commentToReply !== null) {
      setRepliesOpen(true)
      setRepliedComment(
        <CommentCard
          comment={commentToReply as CommentApplicationDto}
          setCommentToReply={setCommentToReply}
          key={commentToReply?.id}
          showRepliesLink={false}
        />
      )
    }
  }, [commentToReply])

  return (
    <>
    <div className={ `
      ${styles.videoComments__repliesBackdrop}
      ${repliesOpen ? styles.videoComments__repliesBackdrop__open : ''}
    `}
      onClick={() => {
        setCommentToReply(null) 
        setRepliesOpen(false)
      }}
    >
      <div 
        className={`
          ${styles.videoComments__container}
          ${repliesOpen ? styles.videoComments__container : ''}
        `}
        onClick={(event) => event.stopPropagation()} 
      >
        <div className={styles.videoComments__commentsTitleBar}>
          <div className={styles.videoComments__commentsTitle}>
            Respuestas
            <span className={styles.videoComments__commentsQuantity}>
              24
            </span>
          </div>
          
          <BsX 
            className={styles.videoComments__commentsCloseIcon}
            onClick={() => {
              setCommentToReply(null)
              setRepliesOpen(false)
            }}
          /> 
        </div>
        <div className={styles.videoComments__repliedComment}>
          {repliedComment}
        </div>
        
        <div className={styles.videoComments__replies}>
          { commentToReply?.childComments.map((childComment) => {
            return (
              <CommentCard
                comment={childComment}
                setCommentToReply={setCommentToReply}
                key={childComment.id}
                showRepliesLink={false}
              />
            )
          })}
        </div>
        <div className={`
          ${styles.videoComments__addCommentSection}
          ${openCommentInput ? styles.videoComments__addCommentSection__open : ''}
        `}>
          <button className={styles.videoComments__addCommentButton}>
            <BsChatDots className={styles.videoComments__addCommentIcon}/>
          </button>
          <textarea
            className={styles.videoComments__commentInput}
            placeholder={ 'message'}
          />
        </div>
        <button
          className={`
            ${styles.videoComments__openCommentInputButton}
            ${openCommentInput ? '' : styles.videoComments__openCommentInputButton__open}
          `}
          onClick={() => setOpenCommentInput(!openCommentInput)}
        >
          Add comment
        </button>
      </div>
    </div>
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
              24
            </span>
          </div>
          
          <BsX 
            className={styles.videoComments__commentsCloseIcon}
            onClick={() => setIsOpen(false)}
            /> 
        </div>
        <div className={styles.videoComments__comments}>
          { comments.map((comment) => {
            return (
              <CommentCard
                comment={comment}
                key={comment.id}
                setCommentToReply={setCommentToReply}
                showRepliesLink={true}
              />
            )
          })}
        </div>
        <div className={`
          ${styles.videoComments__addCommentSection}
          ${openCommentInput && commentable ? styles.videoComments__addCommentSection__open : ''}
        `}>
          <img
            className={styles.videoComments__userLogo}
            src={user?.image ?? ''}
            alt={user?.name}
          />
          <textarea
            className={styles.videoComments__commentInput}
            placeholder={ 'message'}
          />
          <button className={styles.videoComments__addCommentButton}>
            <BsChatDots className={styles.videoComments__addCommentIcon}/>
          </button>
        </div>
        <button
          className={`
            ${styles.videoComments__openCommentInputButton}
            ${openCommentInput && commentable ? '' : styles.videoComments__openCommentInputButton__open}
          `}
          onClick={() => setOpenCommentInput(!openCommentInput)}
        >
          Add comment
        </button>
      </div>
    </div>
    </>
  )
}
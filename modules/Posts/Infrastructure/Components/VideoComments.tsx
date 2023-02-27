import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import styles from './VideoComments.module.scss'
import { CommentApplicationDto } from '../../Application/Dtos/CommentApplicationDto'
import { BsChatDots, BsX } from 'react-icons/bs'
import { CommentCard } from './CommentCard'

interface Props {
  comments: CommentApplicationDto[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const VideoComments: FC<Props> = ({ comments, isOpen, setIsOpen }) => {
  const [openCommentInput, setOpenCommentInput] = useState<boolean>(false)
  const [repliesOpen, setRepliesOpen] = useState<boolean>(false)
  const [commentToReply, setCommentToReply] = useState<CommentApplicationDto | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setOpenCommentInput(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (commentToReply !== null) {
      setRepliesOpen(true)
    }
  }, [commentToReply])

  return (
    <>
        <div 
          className={styles.videoComments__container}
          onClick={(event) => event.stopPropagation()} 
        >
          <div className={styles.videoComments__commentsTitleBar}>
            <div className={styles.videoComments__commentsTitle}>
              Replies
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
            <div className={styles.videoComments__comments}>
              { comments.map((comment) => {
                return (
                  <CommentCard
                    comment={comment}
                    key={comment.id}
                    setCommentToReply={setCommentToReply}
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
    
    </>
    
  )
}
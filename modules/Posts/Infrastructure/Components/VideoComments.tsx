import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import styles from './VideoComments.module.scss'
import { CommentApplicationDto } from '../../Application/Dtos/CommentApplicationDto'
import { BsChatDots } from 'react-icons/bs'
import { CommentCard } from './CommentCard'
import { CommentReplies } from './CommentReplies'

interface Props {
  comments: CommentApplicationDto[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const VideoComments: FC<Props> = ({ comments, isOpen, setIsOpen }) => {
  const [openCommentInput, setOpenCommentInput] = useState<boolean>(false)
  const [commentToReply, setCommentToReply] = useState<CommentApplicationDto | null>(null)


  useEffect(() => {
    if (!isOpen) {
      setOpenCommentInput(false)
    }
  }, [isOpen])

  return (
    <>
      <CommentReplies comment={commentToReply} setCommentToReply={setCommentToReply} />

      <div className={ `
      ${styles.videoComments__layout}
      ${isOpen ? styles.videoComments__layout__open : ''}
    `}>
        <div
          className={`
          ${styles.videoComments__backdrop}
          ${isOpen ? styles.videoComments__backdrop__open : ''}
      `}
          onClick={() => setIsOpen(false)}
        />
        <div className={`
        ${styles.videoComments__container}
        ${isOpen ? styles.videoComments__container__open : ''}
      `}>
          <span className={styles.videoComments__commentsTitle}>
          Comentarios
        </span>
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
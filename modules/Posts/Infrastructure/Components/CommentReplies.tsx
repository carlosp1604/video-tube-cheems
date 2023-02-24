import { Dispatch, FC, ReactElement, SetStateAction } from 'react'
import styles from './CommentReplies.module.scss'
import { CommentApplicationDto } from '../../Application/Dtos/CommentApplicationDto'
import { DateTime } from 'luxon'

interface Props {
  comment: CommentApplicationDto | null
  setCommentToReply: Dispatch<SetStateAction<CommentApplicationDto | null>>
}

export const CommentReplies: FC<Props> = ({ comment, setCommentToReply }) => {
  const content: ReactElement | string = ''

  if (comment !== null) {
    return (
        <div className={styles.commentReplies__container}>
        <span className={styles.commentReplies__commentsTitle}>
          Respuestas
        </span>
          <div className={ styles.commentCard__container }>
            <img
              className={styles.commentCard__userLogo}
              src={comment.user.imageUrl ?? ''}
            />

            <div className={styles.commentCard__userNameDate}>
        <span className={styles.commentCard__userName}>
          {comment.user.name}
        </span>
              <span className={styles.commentCard__commentDate}>
          {DateTime.fromISO(comment.createdAt).toFormat('dd-LL-yyyy')}
        </span>
            </div>
            <div className={styles.commentCard__comment}>
              {comment.comment}
            </div>
          </div>
        </div>
      )
  }
  return (
    <div className={`
      ${styles.commentReplies__layout}
      ${comment !== null ? styles.commentReplies__layout__open : ''}
    `}>
      <div className={`
        ${styles.commentReplies__backdrop}
        ${comment !== null ? styles.commentReplies__backdrop__open : ''} 
      `}
        onClick={() => setCommentToReply(null)}
      />
      {content}
    </div>
  )
}
import { Dispatch, FC, ReactElement, SetStateAction } from 'react'
import styles from './CommentCard.module.scss'
import { CommentApplicationDto } from '../../Application/Dtos/CommentApplicationDto'
import { DateTime } from 'luxon'

interface Props {
  comment: CommentApplicationDto
  setCommentToReply: Dispatch<SetStateAction<CommentApplicationDto | null>>
  showRepliesLink: boolean
}

export const CommentCard: FC<Props> = ({ comment, setCommentToReply, showRepliesLink }) => {
  let responseLink: ReactElement | string = ''

  if (showRepliesLink) {
    responseLink = (
      <div
        className={styles.commentCard__replies_button}
        onClick={() => {
          setCommentToReply(comment)
        }}
      >
        {comment.childComments.length > 0 ? `${comment.childComments.length} ` : ''}
        {comment.childComments.length > 0 ? 'replies' : 'reply'}
      </div>
    )
  }

  return (
    <div className={ styles.commentCard__container }>
      <img
        className={styles.commentCard__userLogo}
        src={comment.user.imageUrl ?? ''}
        alt={comment.user.name}
      />

      <div className={styles.commentCard__userNameDate}>
        <span className={styles.commentCard__userName}>
          {comment.user.name}
        </span>
        <span className={styles.commentCard__commentDate}>
          {DateTime.fromISO(comment.createdAt).toFormat('dd-LL-yyyy')}
        </span>
      </div>
      <div
        className={styles.commentCard__comment}
        onClick={() => {
          setCommentToReply(comment)
        }}
      >
        {comment.comment}
      </div>
      {responseLink}
    </div>
  )
}
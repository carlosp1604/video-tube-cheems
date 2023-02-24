import { Dispatch, FC, ReactElement, SetStateAction } from 'react'
import styles from './CommentCard.module.scss'
import { CommentApplicationDto } from '../../Application/Dtos/CommentApplicationDto'
import { DateTime } from 'luxon'

interface Props {
  comment: CommentApplicationDto
  setCommentToReply: Dispatch<SetStateAction<CommentApplicationDto | null>>
}

export const CommentCard: FC<Props> = ({ comment, setCommentToReply }) => {
  let responseLink: ReactElement | string = ''

  if (comment.childComments.length !== 0) {
    responseLink = (
      <div
        className={styles.commentCard__replies_button}
        onClick={() => {
          console.log('COme')
          setCommentToReply(comment)
        }}
      >
        {comment.childComments.length} replies
      </div>
    )
  }
  return (
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
      <div
        className={styles.commentCard__comment}
        onClick={() => {
          console.log('asdasdas')
          setCommentToReply(comment)
        }}
      >
        {comment.comment}
      </div>
      {responseLink}
    </div>
  )
}
import { FC } from 'react'
import styles from './CommentCard.module.scss'
import { CommentApplicationDto } from '../../../Application/Dtos/CommentApplicationDto'
import { DateTime } from 'luxon'

interface Props {
  comment: CommentApplicationDto
}

export const ChildCommentCard: FC<Props> = ({ comment }) => {
  return (
    <div className={ styles.commentCard__childComment }>
      <img
        className={ styles.commentCard__childCommentUserLogo }
        src={ comment.user.imageUrl ?? '' }
      />

      <div className={ styles.commentCard__userNameDate }>
        <span className={ styles.commentCard__userName }>
          { comment.user.name }
        </span>
        <span className={ styles.commentCard__commentDate }>
          { DateTime.fromISO(comment.createdAt).toFormat('dd-LL-yyyy') }
        </span>
      </div>
      <p className={ styles.commentCard__comment }>
        { comment.comment }
      </p>
    </div>
  )
}

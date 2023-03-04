import { FC, ReactElement } from 'react'
import styles from './CommentCard.module.scss'
import { PostCommentComponentDto } from '../Dtos/PostCommentComponentDto'
import { BsDot } from 'react-icons/bs'

interface Props {
  comment: PostCommentComponentDto
}

export const CommentCard: FC<Props> = ({
  comment,
}) => {
  let responseLink: ReactElement | string = ''

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
        <BsDot className={styles.commentCard__separatorIcon}/> 
        <span className={styles.commentCard__commentDate}>
          {comment.createdAt}
        </span>
      </div>
      <div className={styles.commentCard__comment}>
        {comment.comment}
      </div>
      {responseLink}
    </div>
  )
}
import { FC, ReactElement } from 'react'
import styles from './CommentCard.module.scss'
import { BsDot } from 'react-icons/bs'
import { PostCommentCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentCardComponentDto'
import Avatar from 'react-avatar'

interface Props {
  comment: PostCommentCardComponentDto
}

export const CommentCard: FC<Props> = ({
  comment,
}) => {
  const responseLink: ReactElement | string = ''

  let avatar = null

  if (comment.user.imageUrl !== null) {
    avatar = (
      <img
        className={ styles.commentCard__userLogo }
        src={ comment.user.imageUrl ?? '' }
        alt={ comment.user.name }
      />
    )
  } else {
    avatar = (
      <Avatar
        className={ styles.commentCard__userLogo }
        round={ true }
        size={ '24' }
        name={ comment.user.name }
        textSizeRatio={ 2 }
    />)
  }

  return (
    <div className={ styles.commentCard__container }>
      { avatar }
      <div className={ styles.commentCard__userNameDate }>
        <span className={ styles.commentCard__userName }>
          { comment.user.name }
        </span>
        <BsDot className={ styles.commentCard__separatorIcon }/>
        <span className={ styles.commentCard__commentDate }>
          { comment.createdAt }
        </span>
      </div>
      <div className={ styles.commentCard__comment }>
        { comment.comment }
      </div>
      { responseLink }
    </div>
  )
}

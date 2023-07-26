import { FC } from 'react'
import styles from './PostCommentCard.module.scss'
import { BsDot } from 'react-icons/bs'
import { PostCommentCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentCardComponentDto'
import Avatar from 'react-avatar'

interface Props {
  postComment: PostCommentCardComponentDto
}

export const PostCommentCard: FC<Props> = ({ postComment }) => {
  let avatar

  if (postComment.user.imageUrl !== null) {
    avatar = (
      <img
        className={ styles.postCommentCard__userLogo }
        src={ postComment.user.imageUrl ?? '' }
        alt={ postComment.user.name }
      />
    )
  } else {
    avatar = (
      <Avatar
        className={ styles.commentCard__userLogo }
        round={ true }
        size={ '24' }
        name={ postComment.user.name }
        textSizeRatio={ 2 }
    />)
  }

  return (
    <div className={ styles.postCommentCard__container }>
      { avatar }
      <div className={ styles.postCommentCard__userNameDate }>
        <span className={ styles.postCommentCard__userName }>
          { postComment.user.name }
        </span>
        <BsDot className={ styles.postCommentCard__separatorIcon }/>
        <span className={ styles.postCommentCard__commentDate }>
          { postComment.createdAt }
        </span>
      </div>
      <div className={ styles.postCommentCard__comment }>
        { postComment.comment }
      </div>
    </div>
  )
}

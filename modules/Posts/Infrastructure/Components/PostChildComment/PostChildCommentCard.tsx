import { FC } from 'react'
import styles from './PostChildCommentCard.module.scss'
import { BsDot } from 'react-icons/bs'
import Avatar from 'react-avatar'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'

interface Props {
  postChildComment: PostChildCommentComponentDto
}

export const PostChildCommentCard: FC<Props> = ({ postChildComment }) => {
  let avatar

  if (postChildComment.user.imageUrl !== null) {
    avatar = (
      <img
        className={ styles.postChildCommentCard__userLogo }
        src={ postChildComment.user.imageUrl ?? '' }
        alt={ postChildComment.user.name }
      />
    )
  } else {
    avatar = (
      <Avatar
        className={ styles.postChildCommentCard__userLogo }
        round={ true }
        size={ '24' }
        name={ postChildComment.user.name }
        textSizeRatio={ 2 }
    />)
  }

  return (
    <div className={ styles.postChildCommentCard__container }>
      { avatar }
      <div className={ styles.postChildCommentCard__userNameDate }>
        <span className={ styles.postChildCommentCard__userName }>
          { postChildComment.user.name }
        </span>
        <BsDot className={ styles.postChildCommentCard__separatorIcon }/>
        <span className={ styles.postChildCommentCard__commentDate }>
          { postChildComment.createdAt }
        </span>
      </div>
      <div className={ styles.postChildCommentCard__comment }>
        { postChildComment.comment }
      </div>
    </div>
  )
}

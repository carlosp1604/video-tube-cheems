import { FC } from 'react'
import styles from './PostChildCommentCard.module.scss'
import { BsDot } from 'react-icons/bs'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import Image from 'next/image'
import Avatar from 'react-avatar'

interface Props {
  postChildComment: PostChildCommentComponentDto
}

export const PostChildCommentCard: FC<Props> = ({ postChildComment }) => {
  let avatar

  if (postChildComment.user.imageUrl !== null) {
    avatar = (
      <Image
        className={ styles.postChildCommentCard__userLogo }
        src={ postChildComment.user.imageUrl ?? '' }
        alt={ postChildComment.user.name }
        width={ 0 }
        height={ 0 }
        sizes={ '100vw' }
      />
    )
  } else {
    avatar = (
      <div className={ styles.postChildCommentCard__userAvatarContainer }>
        <Avatar
          name={ postChildComment.user.name }
          textSizeRatio={ 7 }
        />
      </div>
    )
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

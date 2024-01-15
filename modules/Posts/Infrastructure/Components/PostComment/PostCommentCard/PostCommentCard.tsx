import { FC } from 'react'
import styles from './PostCommentCard.module.scss'
import { BsDot } from 'react-icons/bs'
import { PostCommentCardComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentCardComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

interface Props {
  postComment: PostCommentCardComponentDto
}

export const PostCommentCard: FC<Props> = ({ postComment }) => {
  return (
    <div className={ styles.postCommentCard__container }>
      <AvatarImage
        imageUrl={ postComment.user.imageUrl }
        avatarClassName={ styles.postCommentCard__userAvatar }
        imageClassName={ styles.postCommentCard__userLogo }
        avatarName={ postComment.user.name }
        imageAlt={ postComment.user.name }
      />
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

import { FC } from 'react'
import styles from './PostChildCommentCard.module.scss'
import { BsDot } from 'react-icons/bs'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

interface Props {
  postChildComment: PostChildCommentComponentDto
}

export const PostChildCommentCard: FC<Props> = ({ postChildComment }) => {
  return (
    <div className={ styles.postChildCommentCard__container }>
      <AvatarImage
        imageUrl={ postChildComment.user.imageUrl }
        avatarClassName={ styles.postChildCommentCard__userAvatar }
        imageClassName={ styles.postChildCommentCard__userLogo }
        avatarName={ postChildComment.user.name }
        imageAlt={ postChildComment.user.name }
      />
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

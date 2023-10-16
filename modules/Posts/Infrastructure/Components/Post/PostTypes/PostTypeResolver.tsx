import { ReactElement } from 'react'
import { VideoPostType } from '~/modules/Posts/Infrastructure/Components/Post/PostTypes/VideoPostType'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'

export class PostTypeResolver {
  public static resolve (
    post: PostComponentDto,
    viewsNumber: number,
    likesNumber: number,
    dislikesNumber: number,
    commentsNumber: number,
    userReaction: ReactionComponentDto | null,
    onClickReactButton: (reactionType: ReactionType) => void,
    onClickCommentsButton: () => void
  ): ReactElement | null {
    switch (post.type) {
      case 'video':
        return (
          <VideoPostType
            post={ post }
            viewsNumber={ viewsNumber }
            likesNumber={ likesNumber }
            dislikesNumber={ dislikesNumber }
            commentsNumber={ commentsNumber }
            userReaction={ userReaction }
            onClickReactButton={ (reactionType) => onClickReactButton(reactionType) }
            onClickCommentsButton={ onClickCommentsButton }
          />
        )

      case 'image':
      case 'mixed':
      default:
        return null
    }
  }
}

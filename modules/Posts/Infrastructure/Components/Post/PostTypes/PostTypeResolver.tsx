import { ReactElement } from 'react'
import { VideoPostType } from '~/modules/Posts/Infrastructure/Components/Post/PostTypes/VideoPostType/VideoPostType'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { ReactionType } from '~/modules/Reactions/Infrastructure/ReactionType'

export class PostTypeResolver {
  public static resolve (
    post: PostComponentDto,
    userReaction: ReactionComponentDto | null,
    savedPost: boolean,
    onClickReactButton: (type: ReactionType) => Promise<void>,
    onClickCommentsButton: () => void,
    onClickSaveButton: () => Promise<void>,
    likesNumber: number,
    optionsDisabled: boolean,
    postBasicDataElement: ReactElement
  ): ReactElement | null {
    switch (post.type) {
      case 'video':
        return (
          <VideoPostType
            post={ post }
            postBasicDataElement={ postBasicDataElement }
            userReaction={ userReaction }
            savedPost={ savedPost }
            onClickReactButton={ async (type) => await onClickReactButton(type) }
            onClickCommentsButton={ onClickCommentsButton }
            onClickSaveButton={ async () => await onClickSaveButton() }
            likesNumber={ likesNumber }
            optionsDisabled={ optionsDisabled }
          />
        )

      case 'image':
      case 'mixed':
      default:
        return null
    }
  }
}

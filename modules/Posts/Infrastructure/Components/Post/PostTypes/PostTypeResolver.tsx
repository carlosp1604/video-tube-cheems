import { ReactElement } from 'react'
import { VideoPostType } from '~/modules/Posts/Infrastructure/Components/Post/PostTypes/VideoPostType'
import { PostComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostComponentDto'
import { MediaUrlComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostMedia/MediaUrlComponentDto'

export class PostTypeResolver {
  public static resolve (
    post: PostComponentDto,
    mediaUrls: MediaUrlComponentDto[],
    postBasicDataElement: ReactElement,
    postOptionsElement:ReactElement
  ): ReactElement | null {
    switch (post.type) {
      case 'video':
        return (
          <VideoPostType
            post={ post }
            mediaUrls={ mediaUrls }
            postBasicDataElement={ postBasicDataElement }
            postOptionsElement={ postOptionsElement }
          />
        )

      case 'image':
      case 'mixed':
      default:
        return null
    }
  }
}

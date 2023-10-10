import { AddPostViewApiRequest } from '~/modules/Posts/Infrastructure/Api/Requests/AddPostViewApiRequest'
import { AddPostViewApplicationRequest } from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationRequest'

export class AddPostViewRequestTranslator {
  public static fromApiDto (request: AddPostViewApiRequest): AddPostViewApplicationRequest {
    return {
      postId: request.postId,
      userId: request.userId,
    }
  }
}

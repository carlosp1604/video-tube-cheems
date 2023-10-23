import { AddSavedPostApiRequest } from '~/modules/Auth/Infrastructure/Api/Requests/AddSavedPostApiRequest'
import { AddSavedPostApplicationRequest } from '~/modules/Auth/Application/AddSavedPost/AddSavedPostApplicationRequest'

export class AddSavedPostApplicationRequestTranslator {
  public static fromApi (apiRequest: AddSavedPostApiRequest): AddSavedPostApplicationRequest {
    return {
      userId: apiRequest.userId,
      postId: apiRequest.postId,
    }
  }
}
